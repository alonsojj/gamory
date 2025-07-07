import express from "express";
import authMiddleware, {
  optionalAuthApi,
} from "../middlewares/authMiddleware.js";
import {
  readRate,
  createRate,
  editRate,
  deleteRate,
  likeRate,
} from "../controllers/rateController.js";
const router = express.Router();
router.get("/", optionalAuthApi, readRate);
router.post("/:gameId", authMiddleware, createRate);
router.put("/:gameId", authMiddleware, editRate);
router.delete("/", authMiddleware, deleteRate);
router.post("/:gameId/like", authMiddleware, likeRate);
export default router;
