import express, { Request, Response } from "express";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

const app = express();
// Middleware untuk parsing JSON body
app.use(express.json());
const port = process.env.BACKEND_PORT || 3003;

app.get("/", (req: Request, res: Response) => {
  res.send("Halo, World! ");
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
