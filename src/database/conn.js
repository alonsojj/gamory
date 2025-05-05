import { DataTypes, Sequelize } from "sequelize";
import config from "../config/config.js";
import rateModel from "../models/rate.model.js";
import userModel from "../models/user.model.js";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: process.env.NODE_ENV == "development" ? false : console.log,
    dialectOptions:
      config.NODE_ENV == "development"
        ? {}
        : {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
  }
);
const Rate = rateModel(sequelize, DataTypes);
const User = userModel(sequelize, DataTypes);
User.hasMany(Rate, { foreignKey: "userId" });
Rate.belongsTo(User, { foreignKey: "userId" });
export const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao banco de dados");
    await sequelize.sync(
      config.NODE_ENV == "development" ? { alter: true } : { force: true }
    );
    console.log("Bancos de dados sincronizados");
  } catch (error) {
    console.error("Falha na inicialização:", error);
  }
};
