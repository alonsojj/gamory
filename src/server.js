import express from "express";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import rateRouter from "./routes/rateRouter.js";
import gameRouter from "./routes/gameRouter.js";
import frontRouter from "./routes/frontRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connect } from "./database/conn.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:8000",
  "http://197.168.15.127:8080",
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use("/api", authRouter);
app.use("/api/user", userRouter);
app.use("/api/rate", rateRouter);
app.use("/api/games", gameRouter);

app.use("/", frontRouter);

connect();

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Servidor ligado na porta ${port}`));
