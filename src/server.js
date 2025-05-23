import express from "express";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import rateRouter from "./routes/rateRouter.js";
import cookieParser from "cookie-parser";

import { connect } from "./database/conn.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api/user", userRouter);
app.use("/api/rate", rateRouter);
connect();
app.listen(8000, () => console.log("Servidor ligado"));
