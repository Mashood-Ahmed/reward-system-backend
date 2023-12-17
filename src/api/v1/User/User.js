import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";

const User = db.define("users", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(255),
    defaultValue: null,
  },
  email: {
    type: DataTypes.STRING(320),
    allowNull: false,
    unique: "email",
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Others"),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    defaultValue: null,
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  profile_picture_url: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  account_type: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: "user",
  },
});

//await User.sync({ alter: true });

export { User };
