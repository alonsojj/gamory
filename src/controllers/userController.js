import { User } from "../database/conn.js";
import { verifyPsw } from "../services/authService.js";

export const readUser = async (req, res) => {
  const id = req.params.id ? req.params.id : req.user.userId;
  const { friendship } = req.query;
  console.log(id);
  try {
    const includeOptions =
      friendship === "true" ? [{ association: "friends" }] : [];
    const result = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
      include: includeOptions, // Adiciona a opção de incluir amizades
    });
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result);
    console.log(result);
  } catch (error) {
    res.status(400).json({ error });
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
    "newPassword",
    "oldPassword",
  ];

  try {
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "birthDate") {
          fieldsToUpdate[field] = new Date(req.body[field]);
        }

        if (field === "newPassword") {
          const userPsw = await User.findOne({
            where: { id },
            attributes: { include: ["password"] },
          });
          const verify = await verifyPsw(req.body?.oldPassword, userPsw);
          if (!verify) {
            return res.status(400).json({ error: "Wrong password" });
          }
        }
        fieldsToUpdate[field] = req.body[field];
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
    res.status(400).json({ error });
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
      where: { [Op.like]: `%${nickname}` },
      attributes: { exclude: ["password"] },
    });
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result);
    console.log(result);
  } catch (error) {
    res.status(400).json({ error });
  }
};
