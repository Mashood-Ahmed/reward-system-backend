import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";

const Transaction = db.define("transaction", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  ttype: {
    type: DataTypes.ENUM("Credit", "Debit"),
    allowNull: false,
  },
});

User.hasMany(Transaction, {
  foreignKey: "sender_id",
});
Transaction.belongsTo(User, {
  foreignKey: "sender_id",
});

User.hasMany(Transaction, {
  foreignKey: "reciever_id",
});
Transaction.belongsTo(User, {
  foreignKey: "reciever_id",
});

export { Transaction };
