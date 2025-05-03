import { createToken, hashPsw, verifyPsw } from "../services/authService.js";
import fs from "fs";

const jsonPath = "./src/database/User.json";
let db = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
let id = 1;
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = db.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ error: "Email invalido" });
  }
  const isValid = await verifyPsw(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Senha invalida" });
  }
  const newToken = createToken(user);
  res
    .status(200)
    .cookie("auth", newToken, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
    .json({ token: newToken });
};
const registerHandler = async (req, res) => {
  const newUser = {
    id,
    email: req.body.email,
    password: await hashPsw(req.body.password),
  };
  id++;
  db.push(newUser);
  writeDB(db);
  res.status(201).json({ message: "Usuario cadastrado" });
};
const writeDB = (data) => {
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
};

export { loginHandler, registerHandler };
