import express from "express";
import {
  loginHandler,
  registerHandler,
} from "../controllers/authController.js";
const router = express.Router();

router.get("/login", loginHandler);
router.get("/register", registerHandler);

export default router;
