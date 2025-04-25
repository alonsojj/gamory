import express from "express";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(8000, () => console.log("Servidor ligado"));
