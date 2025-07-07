import { User, Friend } from "../database/conn.js";
import { hashPsw, verifyPsw } from "../services/authService.js";
import { Op } from "sequelize";

export const readUser = async (req, res) => {
  const id = req.params.id ? req.params.id : req.user.userId;
  const { friendship } = req.query;
  try {
    let includeOptions = [];
    if (friendship === "true") {
      includeOptions = [
        {
          association: "sentFriends",
          through: { attributes: ["status"] },
          attributes: { exclude: ["password"] },
        },
        {
          association: "receivedFriends",
          through: { attributes: ["status"] },
          attributes: { exclude: ["password"] },
        },
      ];
    }
    const result = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
      include: includeOptions,
    });
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    let relation = null;
    if (req.user) {
      const currentUserId = req.user.userId;
      const targetUserId = id;

      if (currentUserId !== targetUserId) {
        const sentRequest = await Friend.findOne({
          where: { userId: currentUserId, friendId: targetUserId },
        });
        const receivedRequest = await Friend.findOne({
          where: { userId: targetUserId, friendId: currentUserId },
        });
        if (sentRequest) {
          relation = sentRequest.status;
        } else if (receivedRequest) {
          relation = receivedRequest.status;
        }
      }
    }

    res.status(200).json({ ...result.toJSON(), relation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editUser = async (req, res) => {
  const id = req.user.userId;
  const fieldsToUpdate = {};
  const allowedFields = [
    "nickname",
    "firstName",
    "lastName",
    "email",
    "birthDate",
    "biography",
    "profileImg",
  ];

  try {
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "birthDate") {
          fieldsToUpdate[field] = new Date(req.body[field]);
        } else {
          fieldsToUpdate[field] = req.body[field];
        }
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ error: "No field to update" });
    }
    const [updatedRows] = await User.update(fieldsToUpdate, { where: { id } });
    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ error: "User not found or field not changed" });
    }
    res.status(200).json({ message: "Sucess update" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const id = req.user.userId;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: { id },
      attributes: ["password"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await verifyPsw(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong old password" });
    }

    const hashedPassword = await hashPsw(newPassword);
    const [updatedRows] = await User.update(
      { password: hashedPassword },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(500).json({ error: "Failed to update password" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  const id = req.user.userId;
  try {
    const deletedRows = await User.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Sucess delete" });
    console.log("passou", deletedRows);
  } catch (error) {
    res.status(400).json({ error });
  }
};
export const queryUser = async (req, res) => {
  const { nickname } = req.query;
  try {
    const result = await User.findAll({
      where: { nickname: { [Op.like]: `%${nickname}%` } },
      attributes: { exclude: ["password"] },
    });
    if (!result || result.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
