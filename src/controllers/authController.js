import { User } from "../database/conn.js";
import {
  createToken,
  hashPsw,
  verifyPsw,
  verifyToken,
} from "../services/authService.js";

async function authenticateAndRespond(req, res) {
  const { email, password } = req.body;
  const result = await User.findOne({
    where: { email },
    attributes: ["id", "nickname", "email", "password"],
  });
  if (!result) {
    return res.status(401).json({ error: "Email invalido" });
  }
  const isValid = await verifyPsw(password, result.password);
  if (!isValid) {
    return res.status(401).json({ error: "Senha invalida" });
  }
  const newToken = createToken(result.id);
  return res
    .status(200)
    .cookie("auth", newToken, {
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    })
    .json({ token: newToken });
}

export const loginHandler = async (req, res) => {
  const token =
    req.cookies?.auth || req.headers?.authorization?.replace("Bearer ", "");
  if (token) {
    try {
      await verifyToken(token);
      return res.status(403).json({ error: "Usuario ja logado" });
    } catch (err) {
      try {
        return await authenticateAndRespond(req, res);
      } catch (error) {
        return res.json(error);
      }
    }
  }
  try {
    return await authenticateAndRespond(req, res);
  } catch (error) {
    res.json(error);
  }
};
export const registerHandler = async (req, res) => {
  try {
    const passwordhash = await hashPsw(req.body.password);
    const newUser = {
      ...req.body,
      birthdate: new Date(req.body.birthdate),
      password: passwordhash,
    };
    await User.create(newUser);
  } catch (error) {
    return res.status(400).json({ error });
  }

  res.status(201).json({ message: "Usuario cadastrado" });
};

export default { loginHandler, registerHandler };
