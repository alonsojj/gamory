import { searchGames } from "../services/igdbService.js";

export const searchGamesController = async (req, res) => {
  const { name, id } = req.query;

  if (!name && !id) {
    return res
      .status(400)
      .json({ error: "Provide either 'name' or 'id' to search" });
  }

  try {
    const games = await searchGames({ name, id });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
