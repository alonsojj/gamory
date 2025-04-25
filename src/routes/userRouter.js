import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/", authMiddleware, (req, res) => {
  res.send("Autorizado");
});
export default router;
