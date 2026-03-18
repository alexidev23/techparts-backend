import { PrismaClient } from "@prisma/client";

// Creamos una sola instancia de PrismaClient para todo el proyecto
// Si creáramos una instancia en cada archivo, agotaríamos las conexiones a la base de datos
const prisma = new PrismaClient();

export default prisma;
