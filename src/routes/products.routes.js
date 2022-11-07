import { Router } from "express";
import * as productsController from "../controllers/products.controller";
import { auth } from "../middlewares";

const router = Router();

router.post(
  "/",
  [auth.verifyToken, auth.isModerator],
  productsController.createProduct
);

router.get("/", productsController.getProducts);

router.get("/:productId", productsController.getProductById);

router.put(
  "/:productId",
  [auth.verifyToken, auth.isModerator],
  productsController.updateProductById
);

router.delete(
  "/:productId",
  [auth.verifyToken, auth.isModerator],
  productsController.deleteProductById
);

export default router;
