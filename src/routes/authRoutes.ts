import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

// POST /api/auth/register — crear cuenta
router.post("/register", authController.register);

// POST /api/auth/login — iniciar sesión
router.post("/login", authController.login);

export default router;
