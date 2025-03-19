import express from 'express';
import authRouter from './auth.routes';
import storeRouter from './store.routes';

const router = express();


router.use('/auth', authRouter);
router.use('/store', storeRouter);

const indexRouter = router;
export default indexRouter;
