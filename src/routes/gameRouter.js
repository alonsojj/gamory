import express from "express";
import {
  searchGamesController,
  getPopularGamesController,
  getUpcomingGamesController,
  getRecentlyRatedGamesController,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/", searchGamesController);
router.get("/popular", getPopularGamesController);
router.get("/upcoming", getUpcomingGamesController);
router.get("/recently-rated", getRecentlyRatedGamesController);

export default router;
