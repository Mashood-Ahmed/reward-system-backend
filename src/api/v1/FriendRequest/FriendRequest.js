import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";

const FriendRequest = db.define("friendrequests", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Accepted", "Rejected"),
    defaultValue: "Pending",
  },
});

User.hasMany(FriendRequest, {
  foreignKey: "request_from",
  as: "requestFrom",
  allowNull: false,
});
FriendRequest.belongsTo(User, {
  foreignKey: "request_from",
  as: "requestFrom",
  allowNull: false,
});
User.hasMany(FriendRequest, {
  foreignKey: "request_to",
  as: "requestTo",
  allowNull: false,
});
FriendRequest.belongsTo(User, {
  foreignKey: "request_to",
  as: "requestTo",
  allowNull: false,
});

export { FriendRequest };
