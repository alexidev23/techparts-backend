import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../schemas/orderSchemas";

const router = Router();

router.get("/my-orders", authenticate, orderController.getMyOrders);
router.get("/:id", authenticate, orderController.getById);
router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  orderController.create,
);
router.get("/", authenticate, authorizeAdmin, orderController.getAll);
router.put(
  "/:id/status",
  authenticate,
  authorizeAdmin,
  validate(updateOrderStatusSchema),
  orderController.updateStatus,
);

export default router;
