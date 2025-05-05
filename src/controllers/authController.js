import { User } from "../database/conn.js";
import { createToken, hashPsw, verifyPsw } from "../services/authService.js";

const jsonPath = "./src/database/User.json";
const loginHandler = async (req, res) => {
  const { nickname, password } = req.body;
  const result = await User.findOne({
    where: {
      nickname,
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
const registerHandler = async (req, res) => {
  const { nickname, email, firstName, lastName, birthdate, gender, password } =
    req.body;
  const passwordhash = await hashPsw(password);
  const newUser = {
    nickname,
    email,
    firstName,
    lastName,
    birthDate: new Date(birthdate),
    gender,
    email,
    password: passwordhash,
  };
  const status = await User.create(newUser);
  if (!status) {
    res.staus(500).json(JSON.stringify(status));
  }
  res.status(201).json({ message: "Usuario cadastrado" });
};

export { loginHandler, registerHandler };
