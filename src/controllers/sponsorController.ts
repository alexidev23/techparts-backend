import type { Request, Response } from "express";
import { sponsorService } from "../services/sponsorService";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const sponsorController = {
  async getAll(_req: Request, res: Response) {
    try {
      const sponsors = await sponsorService.getAll();
      res.status(200).json(sponsors);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async getActive(_req: Request, res: Response) {
    try {
      const sponsors = await sponsorService.getActive();
      res.status(200).json(sponsors);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, logo, link } = req.body;
      if (!name || !logo || !link) {
        res.status(400).json({ message: "Todos los campos son requeridos" });
        return;
      }
      const sponsor = await sponsorService.create({ name, logo, link });
      res.status(201).json(sponsor);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const sponsor = await sponsorService.update(id, req.body);
      res.status(200).json(sponsor);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async remove(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      await sponsorService.remove(id);
      res.status(200).json({ message: "Sponsor eliminado correctamente" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
