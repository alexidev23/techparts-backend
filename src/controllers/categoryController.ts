import type { Request, Response } from "express";
import { categoryService } from "../services/categoryService";
import prisma from "../lib/prisma";

export const categoryController = {
  async getAll(_req: Request, res: Response) {
    try {
      const categories = await categoryService.getAll();
      res.status(200).json(categories);
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const category = await categoryService.getById(id);
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ message: "El nombre es requerido" });
        return;
      }
      const category = await categoryService.create(name);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const category = await categoryService.update(id, req.body);
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await categoryService.remove(id);
      res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async createSubcategory(req: Request, res: Response) {
    try {
      const categoryId = String(req.params.id);
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ message: "El nombre es requerido" });
        return;
      }
      const subcategory = await categoryService.createSubcategory(
        name,
        categoryId,
      );
      res.status(201).json(subcategory);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
