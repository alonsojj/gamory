import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { findUser, listAllUsers } from "../controllers/userController.js";
const router = express.Router();
router.get("/", authMiddleware, listAllUsers);
router.get("/me", authMiddleware, findUser);
export default router;
