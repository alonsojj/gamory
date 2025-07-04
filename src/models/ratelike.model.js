"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class RateLike extends Model {}
  RateLike.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      rateUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      gameId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    { sequelize, modelName: "RateLike", timestamps: false }
  );
  return RateLike;
};
