import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  brand: z.string().min(1, "La marca es requerida"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  imgPrincipal: z.string().url("La imagen debe ser una URL válida"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  subcategoryId: z.string().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateProductSchema = createProductSchema.partial();
