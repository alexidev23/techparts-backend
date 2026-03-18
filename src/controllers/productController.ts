import type { Request, Response } from "express";
import { productService } from "../services/productService";

export const productController = {
  // ─── Obtener todos ───────────────────────────────────────────────────────
  async getAll(req: Request, res: Response) {
    try {
      const { category, search, minPrice, maxPrice } = req.query;

      const products = await productService.getAll({
        category: category ? String(category) : undefined,
        search: search ? String(search) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Obtener por ID ──────────────────────────────────────────────────────
  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const product = await productService.getById(id);
      res.status(200).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Crear
  async create(req: Request, res: Response) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Actualizar
  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const product = await productService.update(id, req.body);
      res.status(200).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Eliminar
  async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await productService.remove(id);
      res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
