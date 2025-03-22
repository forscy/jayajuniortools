import express from 'express';
import authRouter from './auth.routes';
import storeRouter from './store.routes';
import userRouter from './user.routes';

const router = express();


router.use('/auth', authRouter);
router.use('/store', storeRouter);
router.use('/users', userRouter);

const indexRouter = router;
export default indexRouter;
