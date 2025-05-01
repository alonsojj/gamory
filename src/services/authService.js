import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || "secret-key-here";
const TOKEN_EXPIRY = "1h";

const hashPsw = async (password) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};
const verifyPsw = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
const createToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT error", error.message);
  }
};

export { createToken, verifyToken, hashPsw, verifyPsw };
