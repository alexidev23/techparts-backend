import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAddress: z.string().min(1, "La dirección de envío es requerida"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "El productId es requerido"),
        quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
      }),
    )
    .min(1, "El pedido debe tener al menos un producto"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["procesando", "enviado", "entregado", "cancelado"]),
});
