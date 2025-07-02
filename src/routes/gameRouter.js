import express from "express";
import {
  searchGamesController,
  getPopularGamesController,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/", searchGamesController);
router.get("/popular", getPopularGamesController);

export default router;
