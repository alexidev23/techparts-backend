import prisma from "../lib/prisma";

export const sponsorService = {
  async getAll() {
    return prisma.sponsor.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getActive() {
    return prisma.sponsor.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(data: { name: string; logo: string; link: string }) {
    return prisma.sponsor.create({ data });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      logo: string;
      link: string;
      status: "active" | "inactive";
    }>,
  ) {
    const sponsor = await prisma.sponsor.findUnique({ where: { id } });
    if (!sponsor) throw new Error("Sponsor no encontrado");
    return prisma.sponsor.update({ where: { id }, data });
  },

  async remove(id: string) {
    const sponsor = await prisma.sponsor.findUnique({ where: { id } });
    if (!sponsor) throw new Error("Sponsor no encontrado");
    return prisma.sponsor.delete({ where: { id } });
  },
};
