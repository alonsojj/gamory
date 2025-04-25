import express from "express";
import { loginHandler, resgisterHandler } from "../controllers/authController";
const router = express.Router();

router.get("/login", loginHandler);
router.get("/register", resgisterHandler);

export default router;
