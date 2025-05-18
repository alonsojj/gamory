import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  readUser,
  editUser,
} from "../controllers/userController.js";
const router = express.Router();
router.get("/me", authMiddleware, readUser);
router.put("/me", authMiddleware, editUser);
router.delete("/me", authMiddleware, deleteUser);
router.get("/:id", readUser);
export default router;
