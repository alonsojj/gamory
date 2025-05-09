import { User } from "../database/conn.js";
import { createToken, hashPsw, verifyPsw } from "../services/authService.js";

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const result = await User.findOne({
    where: {
      email,
    },
    attributes: ["id", "nickname", "email", "password"],
  });
  console.log(result);
  if (!result) {
    return res.status(401).json({ error: "Email invalido" });
  }
  const isValid = await verifyPsw(password, result.password);
  if (!isValid) {
    return res.status(401).json({ error: "Senha invalida" });
  }
  const newToken = createToken(result);
  res
    .status(200)
    .cookie("auth", newToken, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
    .json({ token: newToken });
};
export const registerHandler = async (req, res) => {
  const passwordhash = await hashPsw(req.body.password);
  const newUser = {
    ...req.body,
    birthdate: new Date(req.body.birthdate),
    password: passwordhash,
  };
  try {
    await User.create(newUser);
  } catch (error) {
    return res.status(400).json({ error });
  }

  res.status(201).json({ message: "Usuario cadastrado" });
};

export default { loginHandler, registerHandler };
