import { createToken, hashPsw, verifyPsw } from "../services/authService.js";
import fs from "fs";

const jsonPath = "./src/database/User.json";
let db = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
let id = 1;
function loginHandler(req, res) {
  const userLogin = req.body;
  const user = db.find(
    (user) => user.name == userLogin.name && verifyPsw(userLogin.psw, user.psw)
  );
  if (!user) {
    return res.status(401).json({ error: "Senha ou Usuario Incorreto" });
  }
  const newToken = createToken(user);
  res.status(200).json(newToken);
}
async function registerHandler(req, res) {
  const newUser = {
    id,
    name: req.body.name,
    psw: await hashPsw(req.body.psw),
  };
  id++;
  db.push(newUser);
  writeDB(db);
  res.status(200).json({ message: "Usuario cadastrado" });
}
const writeDB = (data) => {
  fs.writeFileSync(jsonPath, JSON.stringify(data));
};

export { loginHandler, registerHandler };
