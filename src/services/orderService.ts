import prisma from "../lib/prisma";

export const orderService = {
  // ─── Obtener pedidos del usuario logueado ────────────────────────────────
  async getMyOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imgPrincipal: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // ─── Obtener todos los pedidos (solo admin) ───────────────────────────────
  async getAll() {
    return prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imgPrincipal: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // ─── Obtener un pedido por ID ─────────────────────────────────────────────
  async getById(id: string, userId: string, role: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imgPrincipal: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Pedido no encontrado");
    }

    // Un usuario solo puede ver sus propios pedidos, el admin puede ver todos
    if (role !== "admin" && order.userId !== userId) {
      throw new Error("No autorizado");
    }

    return order;
  },

  // ─── Crear pedido ─────────────────────────────────────────────────────────
  async create(
    userId: string,
    data: {
      shippingAddress: string;
      items: { productId: string; quantity: number }[];
    },
  ) {
    // Verificamos que todos los productos existan y tengan stock
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== data.items.length) {
      throw new Error("Uno o más productos no existen");
    }

    // Calculamos el total y verificamos stock
    let totalPrice = 0;
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}`);
      }

      const price = Number(product.price);
      totalPrice += price * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // guardamos el precio al momento de la compra
      };
    });

    // Creamos el pedido con sus items en una sola transacción
    // Si algo falla, no se guarda nada — todo o nada
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          shippingAddress: data.shippingAddress,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imgPrincipal: true,
                },
              },
            },
          },
        },
      });

      // Actualizamos el stock de cada producto
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return order;
  },

  // ─── Actualizar estado del pedido (solo admin) ────────────────────────────
  async updateStatus(
    id: string,
    status: "procesando" | "enviado" | "entregado" | "cancelado",
  ) {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new Error("Pedido no encontrado");
    }

    return prisma.order.update({
      where: { id },
      data: { status },
    });
  },
};
