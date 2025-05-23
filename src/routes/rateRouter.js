import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  readRate,
  createRate,
  editRate,
  deleteRate,
} from "../controllers/rateController.js";
const router = express.Router();
router.get("/", readRate);
router.post("/", authMiddleware, createRate);
router.put("/", authMiddleware, editRate);
router.delete("/", authMiddleware, deleteRate);
export default router;
