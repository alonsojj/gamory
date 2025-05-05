"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    getFullName() {
      return [this.firstName, this.lastName].join(" ");
    }
    getAge() {
      return Math.floor(
        (new Date() - new Date(this.birthDate).getTime()) / 3.15576e10
      );
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validator: {
          isEmail: true,
        },
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      gender: {
        type: DataTypes.ENUM("M", "W", "O"),
        allowNull: false,
      },
      profileImg: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
