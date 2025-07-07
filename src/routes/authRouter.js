import express from "express";
import {
  loginHandler,
  registerHandler,
  logoutHandler,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/login", loginHandler);
router.post("/register", registerHandler);
router.post("/logout", logoutHandler);

export default router;
