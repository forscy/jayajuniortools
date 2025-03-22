import { Router } from "express";
import { getAllUsers, getUserByEmail } from "../controllers/user.controller";
import {
  authenticateJWT,
  verifyOwnerRole,
} from "../middlewares/auth.middleware";

const router = Router();

// get user by email
router.get("/:email", authenticateJWT, verifyOwnerRole, getUserByEmail);


// get all user for owner
router.get("/", authenticateJWT, verifyOwnerRole, getAllUsers);


export default router;