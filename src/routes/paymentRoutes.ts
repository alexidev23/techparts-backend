import { Router } from "express";
import { paymentController } from "../controllers/paymentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Crear preferencia — usuario logueado
router.post("/preference", authenticate, paymentController.createPreference);

// Webhook — MP llama a esta URL, no requiere autenticación
router.post("/webhook", paymentController.webhook);

export default router;
