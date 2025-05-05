import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Rate extends Model {}

  Rate.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      gameId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT(1, 1),
        allowNull: false,
        validate: {
          min: 0,
          max: 5,
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
