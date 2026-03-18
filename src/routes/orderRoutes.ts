import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Rutas privadas — usuario logueado
router.get("/my-orders", authenticate, orderController.getMyOrders);
router.get("/:id", authenticate, orderController.getById);
router.post("/", authenticate, orderController.create);

// Rutas solo admin
router.get("/", authenticate, authorizeAdmin, orderController.getAll);
router.put(
  "/:id/status",
  authenticate,
  authorizeAdmin,
  orderController.updateStatus,
);

export default router;
