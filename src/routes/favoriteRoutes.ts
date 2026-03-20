import { Router } from "express";
import { favoriteController } from "../controllers/favoriteController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// Todas las rutas de favoritos requieren estar logueado
router.get("/", authenticate, favoriteController.getMyFavorites);
router.post("/", authenticate, favoriteController.add);
router.delete("/:productId", authenticate, favoriteController.remove);

export default router;
