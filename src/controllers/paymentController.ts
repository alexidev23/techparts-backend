import type { Request, Response } from "express";
import { mercadopagoService } from "../services/mercadopagoService";
import { orderService } from "../services/orderService";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const paymentController = {
  // ─── Crear preferencia de pago ───────────────────────────────────────────
  async createPreference(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.body;
      const userId = req.user!.userId;

      // Obtenemos el pedido
      const order = await orderService.getById(orderId, userId, "user");

      // Armamos los items para MP
      const items = order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
      }));

      const preference = await mercadopagoService.createPreference({
        orderId,
        items,
        payer: {
          name: order.user.name ?? "",
          email: order.user.email,
        },
      });

      res.status(200).json({
        preferenceId: preference.id,
        initPoint: preference.init_point, // URL producción
        sandboxInitPoint: preference.sandbox_init_point, // URL sandbox/pruebas
      });
    } catch (error) {
      // if (error instanceof Error) {
      //   res.status(400).json({ message: error.message });
      //   return;
      // }
      // res.status(500).json({ message: "Error interno del servidor" });

      console.log("ERROR DETALLADO:", error); // agregá esta línea
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // ─── Webhook de Mercado Pago ─────────────────────────────────────────────
  // MP llama a esta URL cuando el estado del pago cambia
  async webhook(req: Request, res: Response) {
    try {
      const { type, data } = req.body;

      if (type === "payment") {
        const paymentId = data.id;
        // Acá iría la lógica para verificar el pago y actualizar el pedido
        // Por ahora solo confirmamos que recibimos el webhook
        console.log("Webhook recibido, paymentId:", paymentId);
      }

      // MP requiere que respondamos 200 para confirmar que recibimos el webhook
      res.status(200).send();
    } catch {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
