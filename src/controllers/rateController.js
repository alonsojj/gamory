import { Rate, RateLike } from "../database/conn.js";
import { searchGames } from "../services/igdbService.js";
import { User } from "../database/conn.js";
export const createRate = async (req, res) => {
  const { gameId, score, commentary } = req.body;

  try {
    const isValidGame = await searchGames({ id: gameId });
    if (!isValidGame) {
      return res.status(400).json({ error: "Invalid game ID" });
    }

    const newRate = {
      userId: req.user.userId,
      gameId,
      score,
      commentary,
    };
    await Rate.create(newRate);
    res.status(200).json({ message: "Rate created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const readRate = async (req, res) => {
  try {
    const { userId, gameId, score, order } = req.query;
    const where = {};
    if (gameId) where.gameId = gameId;
    if (userId) where.userId = userId;
    if (score) where.score = score;

    const options = {
      where,
      include: [{ model: User, attributes: ["nickname", "profileImg"] }],
      order: [],
    };
    if (order === "desc" || order === "asc") {
      options.order = [["score", order]];
    }

    const rates = await Rate.findAll(options);

    const result = await Promise.all(
      rates.map(async (rate) => {
        const likesCount = await RateLike.count({
          where: { rateUserId: rate.userId, gameId: rate.gameId },
        });
        return {
          id: rate.id,
          userId: rate.userId,
          user: rate.User.nickname || "Usuário",
          photo: rate.User.profileImg,
          gameId: rate.gameId,
          rating: rate.score,
          comment: rate.commentary,
          likes: likesCount,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const editRate = async (req, res) => {
  const { gameId, score, commentary } = req.body;

  try {
    const isValidGame = await searchGames({ id: gameId });
    if (!isValidGame) {
      return res.status(400).json({ error: "Invalid game ID" });
    }

    const existingRate = await Rate.findOne({
      where: { userId: req.user.userId, gameId },
    });

    if (!existingRate) {
      return res.status(404).json({ error: "Rate not found" });
    }

    await Rate.update(
      { score, commentary },
      { where: { userId: req.user.userId, gameId } }
    );

    const updatedRate = await Rate.findOne({
      where: { userId: req.user.userId, gameId },
    });

    res.status(200).json({ message: "Rate updated", rate: updatedRate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteRate = async (req, res) => {
  const { gameId } = req.body;
  if (!gameId) return res.status(401).json({ error: "gameId not provided" });
  try {
    await RateLike.destroy({ where: { rateUserId: req.user.userId, gameId } });
    const result = await Rate.destroy({
      where: { userId: req.user.userId, gameId },
    });
    if (!result) return res.status(404).json({ error: "Rate not found" });
    res.status(200).json({ message: "Rate deleted", result });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const likeRate = async (req, res) => {
  const { gameId, rateUserId } = req.body;
  try {
    const isValidGame = await searchGames({ id: gameId });
    if (!isValidGame) {
      return res.status(400).json({ error: "Invalid game ID" });
    }
    const rate = await Rate.findOne({ where: { userId: rateUserId, gameId } });
    if (!rate) {
      return res.status(404).json({ error: "Rate not found" });
    }
    const newLike = {
      userId: req.user.userId,
      rateUserId,
      gameId,
    };
    await RateLike.create(newLike);
    res.status(200).json({ message: "Registered like", newLike });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
