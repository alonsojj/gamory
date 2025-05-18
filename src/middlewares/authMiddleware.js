import { verifyToken } from "../services/authService.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.auth;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }
    req.user = decoded;
    console.log(decoded);
  } catch (error) {
    res.status(400).json({ error });
  }
  next();
};

export default authMiddleware;
