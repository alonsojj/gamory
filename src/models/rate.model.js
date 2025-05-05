"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Rate extends Model {}

  Rate.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      gameId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      score: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        validate: {
          min: 0,
          max: 5,
          isHalfPoint(value) {
            const strValue = value.toString();
            if (!/^\d+(\.5)?$/.test(strValue)) {
              throw new Error(
                "A nota é invalida, deve ser multiplo de 0.5 (ex: 1.0, 1.5, 2.0)"
              );
            }
          },
        },
      },
      commentary: {
        type: DataTypes.TEXT,
      },
    },
    { sequelize, modelName: "Rate" }
  );
  return Rate;
};
