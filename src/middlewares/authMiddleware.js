import { error } from "console";
import { verifyToken } from "../services/authService.js";

const authMiddleware = (req) => {
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
    return new Error("Token inválido ou expirado", { cause: "401" });
  }
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return new Error("Token inválido ou expirado", { cause: "403" });
    }
    console.log("Token decodificado:", decoded);
    return decoded;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return new Error(error.message, { cause: "400" });
  }
};
export const authApi = (req, res, next) => {
  const result = authMiddleware(req);
  if (result?.cause == 403) {
    res.status(403).json({ error: result.message });
  } else if (result?.cause == 401) {
    res.status(401).json({ error: result.message });
  } else if (result?.cause == 400) {
    res.status(400).json({ error: error.message });
  } else {
    req.user = result;
    next();
  }
};
export const authFront = (req, res, next) => {
  const result = authMiddleware(req);
  if (result instanceof Error) {
    res.redirect("/login");
  } else {
    next();
  }
};
export default authApi;

export const optionalAuthApi = (req, res, next) => {
  const result = authMiddleware(req);
  if (result instanceof Error) {
    req.user = null;
  } else {
    req.user = result;
  }
  next();
};
