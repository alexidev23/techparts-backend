import { Router } from "express";
import { productController } from "../controllers/productController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Rutas públicas — cualquiera puede ver productos
router.get("/", productController.getAll);
router.get("/:id", productController.getById);

// Rutas privadas — solo admin puede crear, editar y eliminar
router.post("/", authenticate, authorizeAdmin, productController.create);
router.put("/:id", authenticate, authorizeAdmin, productController.update);
router.delete("/:id", authenticate, authorizeAdmin, productController.remove);

export default router;
