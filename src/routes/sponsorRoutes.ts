import { Router } from "express";
import { sponsorController } from "../controllers/sponsorController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Pública — para el carrusel de la home
router.get("/active", sponsorController.getActive);

// Admin
router.get("/", authenticate, authorizeAdmin, sponsorController.getAll);
router.post("/", authenticate, authorizeAdmin, sponsorController.create);
router.put("/:id", authenticate, authorizeAdmin, sponsorController.update);
router.delete("/:id", authenticate, authorizeAdmin, sponsorController.remove);

export default router;
