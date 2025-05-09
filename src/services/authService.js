import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || "secret-key-here";
const TOKEN_EXPIRY = "1h";
const SALT_ROUNDS = 10;

export const hashPsw = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};
export const verifyPsw = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
export const createToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT error", error.message);
    throw error;
  }
};
