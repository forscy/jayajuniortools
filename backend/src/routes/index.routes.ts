import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import productRouter from "./product.routes";
import imageRoutes from "./image.routes";
import categoryRoutes from "./category.routes";
import orderRoutes from "./order.routes";
import paymentRoutes from "./payment.routes";

const router = express();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use('/images', imageRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);


const indexRouter = router;
export default indexRouter;
