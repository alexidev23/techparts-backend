import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // El token viene en el header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No autorizado, token requerido" });
    return;
  }

  // Extraemos el token sacando el "Bearer " del principio
  const token = authHeader.split(" ")[1];

  try {
    // Verificamos que el token sea válido y no haya expirado
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    req.user = decoded;
    next(); // Todo bien, seguimos al controller
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Acceso denegado, se requiere rol admin" });
    return;
  }
  next();
};
