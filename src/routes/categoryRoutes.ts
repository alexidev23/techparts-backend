import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Rutas públicas
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

// Rutas privadas — solo admin
router.post("/", authenticate, authorizeAdmin, categoryController.create);
router.put("/:id", authenticate, authorizeAdmin, categoryController.update);
router.delete("/:id", authenticate, authorizeAdmin, categoryController.remove);
// En categoryRoutes.ts
router.post(
  "/:id/subcategories",
  authenticate,
  authorizeAdmin,
  categoryController.createSubcategory,
);

export default router;
