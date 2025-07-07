import { DataTypes, Sequelize } from "sequelize";
import { db } from "../config/config.js";
import rateModel from "../models/rate.model.js";
import userModel from "../models/user.model.js";
import friendModel from "../models/friend.model.js";
import ratelikeModel from "../models/ratelike.model.js";
import gameRatingSummaryModel from "../models/gameRatingSummary.model.js";

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  dialect: db.dialect,
  port: db.port,
  logging: db.env == "development" ? false : console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    authPlugins: {
      caching_sha2_password: () =>
        require("mysql2/lib/auth/caching_sha2_password"),
    },
  },
});
export const Rate = rateModel(sequelize, DataTypes);
export const RateLike = ratelikeModel(sequelize, DataTypes);
export const User = userModel(sequelize, DataTypes);
export const Friend = friendModel(sequelize, DataTypes);
export const GameRatingSummary = gameRatingSummaryModel(sequelize, DataTypes);

User.hasMany(Rate, { foreignKey: "userId" });
Rate.belongsTo(User, { foreignKey: "userId" });
User.hasMany(RateLike, { foreignKey: "userId", as: "rateLikes" });
RateLike.belongsTo(User, { foreignKey: "userId", as: "user" });

User.belongsToMany(User, {
  as: "sentFriends",
  through: Friend,
  foreignKey: "userId",
  otherKey: "friendId",
});

User.belongsToMany(User, {
  as: "receivedFriends",
  through: Friend,
  foreignKey: "friendId",
  otherKey: "userId",
});

export const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao banco de dados");
    await sequelize.sync(
      db.env == "development" ? { alter: true } : { force: true }
    );
    console.log("Bancos de dados sincronizados");
  } catch (error) {
    console.error("Falha na inicialização:", error);
  }
};
