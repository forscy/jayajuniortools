import express, { Request, Response } from "express";
import indexRouter from "./routes/index.routes";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { storageConfig } from "./config/storage.config";

// INITIALIZE SERVER
dotenv.config();
const app = express();

// Middleware untuk parsing JSON body
app.use(express.json());

const port = process.env.BACKEND_PORT || 3003;

const allowedOrigins = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3008",
  "http://localhost:3009",
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

app.get("/", (req: Request, res: Response) => {
  res.send("Halo, World! ");
});

app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads/products', express.static(storageConfig.uploadDir));


// Setup Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "This is a sample API documentation generated using Swagger",
    },
  },
  apis: ["./src/routes/*.ts"], // file yang berisi route dengan komentar Swagger
};

// Setup Swagger Docs
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api", indexRouter);

// Middleware untuk menangani error
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

export default app;
