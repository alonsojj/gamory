import { Rate, RateLike } from "../database/conn.js";
import { searchGames } from "../services/igdbService.js";
import { User } from "../database/conn.js";
import { updateGameAverageRating } from "../services/gameService.js";
export const createRate = async (req, res) => {
  const { score, commentary } = req.body;
  const gameId = req.params.gameId;
  try {
    const isValidGame = await searchGames({ id: gameId });
    if (!isValidGame || isValidGame.length === 0) {
      return res.status(400).json({ error: "Invalid game ID" });
    }

    const newRate = {
      userId: req.user.userId,
      gameId,
      score,
      commentary,
    };
    await Rate.create(newRate);
    await updateGameAverageRating(gameId);
    res.status(201).json({ message: "Rate created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const readRate = async (req, res) => {
  try {
    const { gameId, userId, score, order, expand } = req.query;
    const where = {};

    if (!gameId && !userId) {
      return res.status(400).json({ error: "At least 'gameId' or 'userId' must be provided as a query parameter." });
    }

    if (gameId) where.gameId = gameId;
    if (userId) where.userId = userId;
    if (score) where.score = score;
    if (userId) where.userId = userId;
    if (score) where.score = score;

    const options = {
      where,
      include: [{ model: User, attributes: ["nickname", "profileImg"] }],
      order: [],
    };

    if (req.user) {
      options.order.push([
        Rate.sequelize.literal(
          "CASE WHEN `Rate`.`userId` = '" +
            req.user.userId +
            "' THEN 0 ELSE 1 END"
        ),
      ]);
    }

    if (order === "desc" || order === "asc") {
      options.order.push(["score", order]);
    } else {
      options.order.push(["createdAt", "DESC"]);
    }

    const rates = await Rate.findAll(options);

    let gamesInfo = {};
    if (expand && expand.includes("game")) {
      const gameIds = [...new Set(rates.map((r) => r.gameId))];
      for (const gid of gameIds) {
        const games = await searchGames({ id: gid });
        if (games && games[0]) {
          gamesInfo[gid] = {
            id: games[0].id,
            name: games[0].name,
            coverUrl: games[0].coverUrl,
            bannerUrl: games[0].bannerUrl,
          };
        }
      }
    }

    const result = await Promise.all(
      rates.map(async (rate) => {
        const likesCount = await RateLike.count({
          where: { rateUserId: rate.userId, gameId: rate.gameId },
        });
        let likedByCurrentUser = false;
        if (req.user) {
          const userLike = await RateLike.findOne({
            where: {
              userId: req.user.userId,
              rateUserId: rate.userId,
              gameId: rate.gameId,
            },
          });
          likedByCurrentUser = !!userLike;
        }

        const base = {
          id: rate.id,
          userId: rate.userId,
          user:
            req.user && req.user.userId === rate.userId
              ? "Você"
              : rate.User.nickname || "Usuário",
          photo: rate.User.profileImg,
          gameId: rate.gameId,
          rating: rate.score,
          comment: rate.commentary,
          likes: likesCount,
          likedByCurrentUser: likedByCurrentUser,
        };
        if (expand && expand.includes("game")) {
          base.game = gamesInfo[rate.gameId] || { id: rate.gameId };
        }
        return base;
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const editRate = async (req, res) => {
  const { score, commentary } = req.body;
  const gameId = req.params.gameId;
  try {
    const isValidGame = await searchGames({ id: gameId });
    if (!isValidGame || isValidGame.length === 0) {
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
    await updateGameAverageRating(gameId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteRate = async (req, res) => {
  const { gameId } = req.body;
  if (!gameId) return res.status(400).json({ error: "gameId not provided" });
  try {
    await RateLike.destroy({ where: { rateUserId: req.user.userId, gameId } });
    const result = await Rate.destroy({
      where: { userId: req.user.userId, gameId },
    });
    if (!result) return res.status(404).json({ error: "Rate not found" });
    await updateGameAverageRating(gameId);
    res.status(200).json({ message: "Rate deleted", result });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const likeRate = async (req, res) => {
  const { rateUserId } = req.body;
  const { gameId } = req.params;
  if (!gameId) {
    return res.status(400).json({ error: "gameId is required." });
  }
  if (!rateUserId) {
    return res.status(400).json({ error: "rateUserId is required." });
  }
  if (!req.user || !req.user.userId) {
    return res
      .status(400)
      .json({ error: "User not authenticated or user ID missing." });
  }

  try {
    const isValidGame = await searchGames({ id: gameId });
    if (!isValidGame || isValidGame.length === 0) {
      return res.status(400).json({ error: "Invalid game ID provided." });
    }
    const rate = await Rate.findOne({ where: { userId: rateUserId, gameId } });
    if (!rate) {
      return res
        .status(404)
        .json({ error: "Rate not found for the given user and game." });
    }

    const existingLike = await RateLike.findOne({
      where: { userId: req.user.userId, rateUserId, gameId },
    });

    if (existingLike) {
      await RateLike.destroy({
        where: { userId: req.user.userId, rateUserId, gameId },
      });
      return res.status(200).json({ message: "Unliked rate" });
    } else {
      const newLike = {
        userId: req.user.userId,
        rateUserId,
        gameId,
      };
      await RateLike.create(newLike);
      return res.status(200).json({ message: "Liked rate", newLike });
    }
  } catch (error) {
    console.error("Error in likeRate:", error);
    res.status(400).json({
      error: "An unexpected error occurred while processing your like request.",
    });
  }
};