import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || "secret-key-here";
const TOKEN_EXPIRY = "1h";
const SALT_ROUNDS = 10;

async function hashPsw(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}
function verifyPsw(password, hash) {
  return bcrypt.compare(password, hash);
}
function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT error", error.message);
  }
}

export { createToken, verifyToken, hashPsw, verifyPsw };
