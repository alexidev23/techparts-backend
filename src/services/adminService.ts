import prisma from "../lib/prisma";

export const adminService = {
  async getStats() {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        orderBy: { stock: "asc" },
        select: { id: true, name: true, stock: true },
      }),
    ]);

    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true },
    });

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: Number(totalRevenue._sum.totalPrice ?? 0),
      recentOrders: recentOrders.map((o) => ({
        order: o.id.slice(0, 8).toUpperCase(),
        name: o.user.name ?? o.user.email,
        status: o.status,
      })),
      lowStockProducts,
    };
  },
  async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true, // ← agregá esto
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
  async updateUser(
    id: string,
    data: {
      name?: string;
      role?: "admin" | "user";
      status?: "active" | "inactive";
    },
  ) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("Usuario no encontrado");
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  },
  async getOrders() {
    return prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, imgPrincipal: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  async getProducts() {
    return prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
  async getCategories() {
    return prisma.category.findMany({
      include: {
        subcategories: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error("Categoría no encontrada");
    return prisma.category.delete({ where: { id } });
  },

  async getSubcategories() {
    return prisma.subcategory.findMany({
      include: {
        category: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });
  },

  async deleteSubcategory(id: string) {
    const sub = await prisma.subcategory.findUnique({ where: { id } });
    if (!sub) throw new Error("Subcategoría no encontrada");
    return prisma.subcategory.delete({ where: { id } });
  },

  async getProductsByCategory(categoryId: string) {
    return prisma.product.findMany({
      where: { categoryId },
      select: { id: true, name: true, stock: true, status: true },
      orderBy: { name: "asc" },
    });
  },
};
