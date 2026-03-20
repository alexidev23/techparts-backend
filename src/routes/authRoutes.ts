import { Router } from "express";
import { authController } from "../controllers/authController";
import { validate } from "../middlewares/validateMiddleware";
import { registerSchema, loginSchema } from "../schemas/authSchemas";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);

export default router;
