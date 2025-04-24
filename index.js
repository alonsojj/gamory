import express from "express";

const logins = [
  {
    user: "teste",
    psw: "12345",
  },
];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
  const { user, psw } = req.body;
  const correctUser = logins.some(
    (login) => login.user === user && login.psw === psw
  );
  correctUser
    ? res.status(200).redirect("/sucess")
    : res.status(401).redirect("/error");
});
app.get("/error", (req, res) => {
  res.send("Senha ou Usuarios errados");
});
app.get("/sucess", (req, res) => {
  res.send("Tudo certo");
});
app.post("/signup", (req, res) => {
  const newUser = req.body;

  logins.push(newUser);
  res.status(200).redirect("/sucess");
});

app.listen(8000, () => console.log("Servidor ligado"));
