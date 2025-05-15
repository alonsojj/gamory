import { DataTypes, Sequelize } from "sequelize";
import { db } from "../config/config.js";
import rateModel from "../models/rate.model.js";
import userModel from "../models/user.model.js";

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  dialect: db.dialect,
  port: db.port,
  logging: db.env == "development" ? false : console.log,
  dialectOptions:
    db.env == "development"
      ? {}
      : {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
});
export const Rate = rateModel(sequelize, DataTypes);
export const User = userModel(sequelize, DataTypes);
User.hasMany(Rate, { foreignKey: "userId" });
Rate.belongsTo(User, { foreignKey: "userId" });
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
