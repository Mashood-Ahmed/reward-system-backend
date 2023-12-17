import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";

const Wallet = db.define("wallet", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
});

User.hasOne(Wallet, {
  foreignKey: "user_id",
});
Wallet.belongsTo(User, {
  foreignKey: "user_id",
});

export { Wallet };
