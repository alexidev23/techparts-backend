import prisma from "../lib/prisma";

export const favoriteService = {
  // ─── Obtener favoritos del usuario ───────────────────────────────────────
  async getMyFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // ─── Agregar a favoritos ─────────────────────────────────────────────────
  async add(userId: string, productId: string) {
    // Verificamos que el producto exista
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // Verificamos que no esté ya en favoritos
    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      throw new Error("El producto ya está en favoritos");
    }

    return prisma.favorite.create({
      data: { userId, productId },
      include: { product: true },
    });
  },

  // ─── Eliminar de favoritos ───────────────────────────────────────────────
  async remove(userId: string, productId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!favorite) {
      throw new Error("El producto no está en favoritos");
    }

    return prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });
  },
};
