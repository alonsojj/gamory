import express from "express";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import rateRouter from "./routes/rateRouter.js";
import gameRouter from "./routes/gameRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connect } from "./database/conn.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:8000"],
    credentials: true,
  })
);
app.use("/api", authRouter);
app.use("/api/user", userRouter);
app.use("/api/rate", rateRouter);
app.use("/api/games", gameRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/assets",
  express.static(path.join(__dirname, "../../gamory-site/assets"))
);
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../gamory-site/pages/login.html"));
});

app.get("/perfil", (req, res) => {
  res.sendFile(path.join(__dirname, "../../gamory-site/pages/perfil.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../../gamory-site/pages/home.html"));
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "../../gamory-site/pages/cadastro.html"));
});
app.get("/game", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../gamory-site/pages/description.html")
  );
});

connect();
app.listen(8000, () => console.log("Servidor ligado"));
