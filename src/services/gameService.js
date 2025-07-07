import { GameRatingSummary, Rate } from "../database/conn.js";

export const getRecentlyRatedGamesId = async (limit = 10) => {
  const rates = await Rate.findAll({
    attributes: ["gameId"],
    group: ["gameId"],
    order: [
      [Rate.sequelize.fn("MAX", Rate.sequelize.col("createdAt")), "DESC"],
    ],
    limit: limit,
  });
  return rates.map((rate) => rate.gameId);
};
export const updateGameAverageRating = async (gameId) => {
  try {
    const totalScore = await Rate.sum('score', { where: { gameId: gameId } });
    const totalRatings = await Rate.count({ where: { gameId: gameId } });

    console.log('Total Score:', totalScore);
    console.log('Total Ratings:', totalRatings);

    let averageRating = 0;
    if (totalRatings > 0) {
      averageRating = (totalScore / totalRatings).toFixed(1);
    }

    console.log('Calculated averageRating:', averageRating);

    await GameRatingSummary.upsert(
      {
        gameId: gameId,
        averageRating: parseFloat(averageRating),
        totalRatings: totalRatings,
      },
      { where: { gameId: gameId } }
    );
    console.log(
      `Average rating for game ${gameId} updated: ${averageRating} (${totalRatings} ratings)`
    );
  } catch (error) {
    console.error(`Error updating average rating for game ${gameId}:`, error);
  }
};

export const getGameAverageRating = async (gameId) => {
  try {
    const summary = await GameRatingSummary.findOne({
      where: { gameId: gameId },
    });
    return summary ? { averageRating: summary.averageRating, totalRatings: summary.totalRatings } : { averageRating: null, totalRatings: 0 };
  } catch (error) {
    console.error(`Error fetching average rating for game ${gameId}:`, error);
    return { averageRating: null, totalRatings: 0 };
  }
};
