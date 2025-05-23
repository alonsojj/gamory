"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Friend extends Model {}
  Friend.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      friendId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    { sequelize, modelName: "Friend" }
  );
  return Friend;
};
