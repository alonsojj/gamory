import { verifyToken } from "../services/authService.js";

const authMiddleware = (req, res, next) => {
  let token = null;
  console.log("Authorization header:", req.headers.authorization);
  console.log("Auth cookie:", req.cookies?.auth);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.auth) {
    token = req.cookies.auth;
  }
  console.log("Token usado:", token);

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }
    req.user = decoded;
    console.log("Token decodificado:", decoded);
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(400).json({ error: error.message });
  }
  next();
};

export default authMiddleware;
