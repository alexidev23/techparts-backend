import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
// import type { JwtPayload } from "../types";

export const authService = {
  // ─── Registro ────────────────────────────────────────────────────────────
  async register(name: string, email: string, password: string) {
    // Verificamos si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("El correo ya está registrado");
    }

    // Hasheamos la contraseña — el 10 es el "salt rounds", más alto = más seguro pero más lento
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generamos el token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    // Devolvemos el usuario sin la contraseña y el token
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  // ─── Login ───────────────────────────────────────────────────────────────
  async login(email: string, password: string) {
    // Buscamos el usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Comparamos la contraseña con el hash guardado
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Generamos el token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    // Devolvemos el usuario sin la contraseña y el token
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },
};
