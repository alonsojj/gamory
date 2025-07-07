import { Friend } from "../database/conn.js";
import { Op } from "sequelize";

export const createFriendship = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;
  try {
    if (userId === friendId) {
      return res.status(400).json({ error: "Cannot add yourself as a friend" });
    }
    const existingFriendship = await Friend.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
        status: "pending",
      },
    });
    if (existingFriendship) {
      return res.status(400).json({ error: "A pending friendship request already exists with this user." });
    }
    await Friend.create({ userId, friendId, status: "pending" });
    res.status(201).json({ message: "Friendship request sent" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const updateFriendshipStatus = async (req, res) => {
  const { friendId, status } = req.body;
  const userId = req.user.userId;
  try {
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const friendship = await Friend.findOne({
      where: { userId: friendId, friendId: userId },
    });
    if (!friendship) {
      return res.status(404).json({ error: "Friendship not found" });
    }
    await friendship.update({ status });
    res.status(200).json({ message: "Friendship status updated" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
