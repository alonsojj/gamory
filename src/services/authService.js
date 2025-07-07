import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { auth } from "../config/config.js";

export const hashPsw = async (password) => {
  const salt = await bcrypt.genSalt(auth.saltRounds);
  return await bcrypt.hash(password, salt);
};
export const verifyPsw = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
export const createToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    auth.jwtSecret,
    { expiresIn: auth.tokenExpiry }
  );
};
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, auth.jwtSecret);
  } catch (error) {
    return null;
  }
};
