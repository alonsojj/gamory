import express from "express";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api/user", userRouter);

app.listen(8000, () => console.log("Servidor ligado"));
