import type { Request, Response } from "express";
import { authService } from "../services/authService";

export const authController = {
  // ─── Registro ────────────────────────────────────────────────────────────
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Validación básica — después agregamos Zod
      if (!name || !email || !password) {
        res.status(400).json({ message: "Todos los campos son requeridos" });
        return;
      }

      const result = await authService.register(name, email, password);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Login ───────────────────────────────────────────────────────────────
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Todos los campos son requeridos" });
        return;
      }

      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
