import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.get("/stats", authenticate, authorizeAdmin, adminController.getStats);
router.get("/users", authenticate, authorizeAdmin, adminController.getUsers);
router.put(
  "/users/:id",
  authenticate,
  authorizeAdmin,
  adminController.updateUser,
);
router.get("/orders", authenticate, authorizeAdmin, adminController.getOrders);
router.get(
  "/products",
  authenticate,
  authorizeAdmin,
  adminController.getProducts,
);

export default router;
