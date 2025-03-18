import express from 'express';
import authRouter from './auth.routes';

const router = express();


router.use('/auth', authRouter);


const indexRouter = router;
export default indexRouter;
