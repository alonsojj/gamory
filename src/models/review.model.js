import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Review extends Model {}

  Review.init(
    {
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
    { sequelize, modelName: "Review" }
  );
  return Review;
};
