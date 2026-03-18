import type { Request, Response } from "express";
import { orderService } from "../services/orderService";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const orderController = {
  // ─── Mis pedidos ─────────────────────────────────────────────────────────
  async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const orders = await orderService.getMyOrders(userId);
      res.status(200).json(orders);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Todos los pedidos (admin) ────────────────────────────────────────────
  async getAll(_req: Request, res: Response) {
    try {
      const orders = await orderService.getAll();
      res.status(200).json(orders);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Pedido por ID ────────────────────────────────────────────────────────
  async getById(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const userId = req.user!.userId;
      const role = req.user!.role;
      const order = await orderService.getById(id, userId, role);
      res.status(200).json(order);
    } catch (error) {
      if (error instanceof Error) {
        const status = error.message === "No autorizado" ? 403 : 404;
        res.status(status).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Crear pedido ─────────────────────────────────────────────────────────
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { shippingAddress, items } = req.body;

      if (!shippingAddress || !items || items.length === 0) {
        res.status(400).json({ message: "Dirección e items son requeridos" });
        return;
      }

      const order = await orderService.create(userId, {
        shippingAddress,
        items,
      });
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Actualizar estado (admin) ────────────────────────────────────────────
  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ message: "El estado es requerido" });
        return;
      }

      const order = await orderService.updateStatus(id, status);
      res.status(200).json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
