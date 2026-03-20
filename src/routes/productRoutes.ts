import { Router } from "express";
import { productController } from "../controllers/productController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/productSchemas";

const router = Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validate(createProductSchema),
  productController.create,
);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  validate(updateProductSchema),
  productController.update,
);
router.delete("/:id", authenticate, authorizeAdmin, productController.remove);

export default router;
