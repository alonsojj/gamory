import { User } from "../database/conn.js";
import { createToken, hashPsw, verifyPsw } from "../services/authService.js";

export const loginHandler = async (req, res) => {
  if ((req.cookies && req.cookies.auth) || req.headers?.authorization) {
    return res.status(403).json({ error: "Usuario ja logado" });
  }
  const { email, password } = req.body;
  try {
    const result = await User.findOne({
      where: {
        email,
      },
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
    res
      .status(200)
      .cookie("auth", newToken, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
      .json({ token: newToken });
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
