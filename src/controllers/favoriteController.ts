import type { Response } from "express";
import { favoriteService } from "../services/favoriteService";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const favoriteController = {
  // ─── Obtener favoritos ───────────────────────────────────────────────────
  async getMyFavorites(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const favorites = await favoriteService.getMyFavorites(userId);
      res.status(200).json(favorites);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Agregar favorito ────────────────────────────────────────────────────
  async add(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.body;

      if (!productId) {
        res.status(400).json({ message: "El productId es requerido" });
        return;
      }

      const favorite = await favoriteService.add(userId, productId);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Eliminar favorito ───────────────────────────────────────────────────
  async remove(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.params;
      await favoriteService.remove(userId, String(productId));
      res.status(200).json({ message: "Eliminado de favoritos" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
