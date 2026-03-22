import type { Response } from "express";
import { adminService } from "../services/adminService";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const adminController = {
  async getStats(req: AuthRequest, res: Response) {
    try {
      const stats = await adminService.getStats();
      res.status(200).json(stats);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await adminService.getUsers();
      res.status(200).json(users);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async updateUser(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const user = await adminService.updateUser(id, req.body);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async getOrders(req: AuthRequest, res: Response) {
    try {
      const orders = await adminService.getOrders();
      res.status(200).json(orders);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async getProducts(req: AuthRequest, res: Response) {
    try {
      const products = await adminService.getProducts();
      res.status(200).json(products);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async getCategories(req: AuthRequest, res: Response) {
    try {
      const categories = await adminService.getCategories();
      res.status(200).json(categories);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async deleteCategory(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      await adminService.deleteCategory(id);
      res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async getSubcategories(req: AuthRequest, res: Response) {
    try {
      const subcategories = await adminService.getSubcategories();
      res.status(200).json(subcategories);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async deleteSubcategory(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      await adminService.deleteSubcategory(id);
      res.status(200).json({ message: "Subcategoría eliminada correctamente" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async getProductsByCategory(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const products = await adminService.getProductsByCategory(id);
      res.status(200).json(products);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
