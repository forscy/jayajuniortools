import express, { Request, Response } from "express";
import indexRouter from "./routes/index.routes";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import dotenv from "dotenv";

// INITIALIZE SERVER
dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost", // React app 1 URL
  "http://localhost:3000", // React app 1 URL
  "http://localhost:3002", // React app 2 URL
  "http://localhost:3008", // React app 2 URL
  "http://localhost:3009", // React app 2 URL
  "https://completely-safe-moth.ngrok-free.app", // Ngrok URL
  "https://movie-nexus-kappa.vercel.app", // Vercel URL
  "https://movie-nexus-jtk.vercel.app", // Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the incoming request origin is in the allowedOrigins array
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Izinkan pengiriman cookie lintas domain
    methods: ["GET", "POST", "PUT", "DELETE"], // Izinkan metode HTTP yang digunakan
  })
);

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


export default app;