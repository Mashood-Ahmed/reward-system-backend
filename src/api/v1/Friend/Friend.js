import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";

const Friend = db.define("friends", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
});

User.hasMany(Friend, {
  foreignKey: "user1",
  as: "User1",
  allowNull: false,
});
Friend.belongsTo(User, {
  foreignKey: "user1",
  as: "User1",
  allowNull: false,
});
User.hasMany(Friend, {
  foreignKey: "user2",
  as: "User2",
  allowNull: false,
});
Friend.belongsTo(User, {
  foreignKey: "user2",
  as: "User2",
  allowNull: false,
});

//await Friend.sync({ alter: true });

export { Friend };
