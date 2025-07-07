import express from "express";
import authMiddleware, {
  optionalAuthApi,
} from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  readUser,
  editUser,
  queryUser,
  updatePassword,
} from "../controllers/userController.js";
import {
  createFriendship,
  updateFriendshipStatus,
} from "../controllers/friendController.js";

const router = express.Router();

router.get("/me", authMiddleware, readUser);
router.put("/me", authMiddleware, editUser);
router.delete("/me", authMiddleware, deleteUser);
router.post("/me/friendships", authMiddleware, createFriendship);
router.put("/me/friendships", authMiddleware, updateFriendshipStatus);
router.put("/me/password", authMiddleware, updatePassword);
router.get("/:id", optionalAuthApi, readUser);
router.get("/", queryUser);

export default router;
