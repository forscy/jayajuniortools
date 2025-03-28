import express from "express";
import authRouter from "./auth.routes";
import storeRouter from "./store.routes";
import userRouter from "./user.routes";
import productRouter from "./product.routes";
import imageRoutes from "./image.routes";
import categoryRoutes from "./category.routes";

const router = express();

router.use("/auth", authRouter);
router.use("/store", storeRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use('/images', imageRoutes);
router.use('/categories', categoryRoutes);


const indexRouter = router;
export default indexRouter;
