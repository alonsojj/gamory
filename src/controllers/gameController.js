import {
  searchGames,
  getPopularGames,
  getUpcomingGames,
} from "../services/igdbService.js";
import { getRecentlyRatedGamesId, getGameAverageRating } from "../services/gameService.js";

const MAX_LIMIT = 30;

export const searchGamesController = async (req, res) => {
  const { name, id } = req.query;

  if (!name && !id) {
    return res
      .status(400)
      .json({ error: "Provide either 'name' or 'id' to search" });
  }

  try {
    let games = await searchGames({ name, id });

    if (id && games.length > 0) {
      const gameId = Array.isArray(id) ? id[0] : id;
      const { averageRating, totalRatings } = await getGameAverageRating(gameId);
      games[0].averageRating = averageRating;
      games[0].totalRatings = totalRatings;
    }

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getPopularGamesController = async (req, res) => {
  const limit = req.query?.limit || 10;
  if (limit > MAX_LIMIT) return res.status(400).json({ error: `Max limit is ${MAX_LIMIT}` });

  try {
    const games = await getPopularGames(limit);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getUpcomingGamesController = async (req, res) => {
  const limit = req.query?.limit || 10;
  if (limit > MAX_LIMIT) return res.status(400).json({ error: `Max limit is ${MAX_LIMIT}` });

  try {
    const games = await getUpcomingGames(limit);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecentlyRatedGamesController = async (req, res) => {
  const limit = req.query?.limit || 10;
  if (limit > MAX_LIMIT) return res.status(400).json({ error: `Max limit is ${MAX_LIMIT}` });
  try {
    const gameIds = await getRecentlyRatedGamesId(limit);
    if (gameIds.length === 0) {
      return res.status(200).json([]);
    }
    const games = await searchGames({ id: gameIds });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};