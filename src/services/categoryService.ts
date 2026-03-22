import prisma from "../lib/prisma";

export const categoryService = {
  // ─── Obtener todas las categorías ────────────────────────────────────────
  async getAll() {
    return prisma.category.findMany({
      where: { status: "active" },
      include: {
        subcategories: true,
        _count: {
          select: { products: true }, // cantidad de productos por categoría
        },
      },
      orderBy: { name: "asc" },
    });
  },

  // ─── Obtener una categoría por ID ────────────────────────────────────────
  async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
        products: {
          where: { status: "active" },
          include: { images: true },
        },
      },
    });

    if (!category) {
      throw new Error("Categoría no encontrada");
    }

    return category;
  },

  // ─── Crear categoría (solo admin) ────────────────────────────────────────
  async create(name: string) {
    const existing = await prisma.category.findUnique({ where: { name } });

    if (existing) {
      throw new Error("Ya existe una categoría con ese nombre");
    }

    return prisma.category.create({ data: { name } });
  },

  async createSubcategory(name: string, categoryId: string) {
    return prisma.subcategory.create({
      data: { name, categoryId },
      include: { category: true },
    });
  },

  // ─── Actualizar categoría (solo admin) ───────────────────────────────────
  async update(
    id: string,
    data: { name?: string; status?: "active" | "inactive" },
  ) {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new Error("Categoría no encontrada");
    }

    return prisma.category.update({ where: { id }, data });
  },

  // ─── Eliminar categoría (solo admin) ─────────────────────────────────────
  async remove(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new Error("Categoría no encontrada");
    }

    return prisma.category.delete({ where: { id } });
  },
};
