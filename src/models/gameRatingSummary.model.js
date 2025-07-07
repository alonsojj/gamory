"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class GameRatingSummary extends Model {}
  GameRatingSummary.init(
    {
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      averageRating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      totalRatings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "game_rating_summaries",
      timestamps: true,
      sequelize,
    }
  );
  return GameRatingSummary;
};
