import express, { Request, Response } from "express";
import indexRouter from "./routes/index.routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();
// Middleware untuk parsing JSON body
app.use(express.json());
const port = process.env.BACKEND_PORT || 3003;

app.get("/", (req: Request, res: Response) => {
  res.send("Halo, World! ");
});

// Routes
app.use('/api', indexRouter);

// Middleware untuk menangani error
app.use(errorMiddleware);


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
