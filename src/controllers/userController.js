import { User } from "../database/conn.js";

export const listAllUsers = async (req, res) => {
  const result = await User.findAll({ attributes: { exclude: ["password"] } });
  res.status(200).json(result);
};
export const findUser = async (req, res) => {
  const result = await User.findAll({
    where: { id: req.user.userId },
    attributes: { exclude: ["password"] },
  });
  res.status(200).json(result);
};
