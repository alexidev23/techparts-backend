import prisma from "../lib/prisma";

export const productService = {
  // ─── Obtener todos los productos ─────────────────────────────────────────
  async getAll(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    return prisma.product.findMany({
      where: {
        status: "active",
        ...(filters?.category && {
          category: { name: filters.category },
        }),
        ...(filters?.search && {
          name: { contains: filters.search },
        }),
        ...(filters?.minPrice && {
          price: { gte: filters.minPrice },
        }),
        ...(filters?.maxPrice && {
          price: { lte: filters.maxPrice },
        }),
      },
      include: {
        category: true, // incluye los datos de la categoría
        images: true, // incluye las imágenes secundarias
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // ─── Obtener un producto por ID ───────────────────────────────────────────
  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        images: true,
      },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  },

  // ─── Crear producto (solo admin) ─────────────────────────────────────────
  async create(data: {
    name: string;
    description: string;
    price: number;
    brand: string;
    stock: number;
    imgPrincipal: string;
    categoryId: string;
    subcategoryId?: string;
    discountPercent?: number;
  }) {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  },

  // ─── Actualizar producto (solo admin) ────────────────────────────────────
  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      brand: string;
      stock: number;
      imgPrincipal: string;
      categoryId: string;
      subcategoryId?: string;
      discountPercent?: number;
      status: "active" | "inactive";
    }>,
  ) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  // ─── Eliminar producto (solo admin) ──────────────────────────────────────
  async remove(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return prisma.product.delete({ where: { id } });
  },
};
