import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  readUser,
  editUser,
  queryUser,
} from "../controllers/userController.js";
import {
  createFriendship,
  updateFriendshipStatus,
} from "../controllers/friendController.js";

const router = express.Router();

router.get("/me", authMiddleware, readUser);
router.put("/me", authMiddleware, editUser);
router.delete("/me", authMiddleware, deleteUser);
router.post("me/friendships", authMiddleware, createFriendship);
router.put("me/friendships", authMiddleware, updateFriendshipStatus);
router.get("/:id", readUser);
router.get("/search", queryUser);

export default router;
