import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";
import { Group } from "../Group/Group.js";

const GroupUser = db.define("groupuser", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.hasMany(GroupUser, {
  foreignKey: "user_id",
});
GroupUser.belongsTo(User, {
  foreignKey: "user_id",
});

Group.hasMany(GroupUser, {
  foreignKey: "group_id",
});
GroupUser.belongsTo(Group, {
  foreignKey: "group_id",
});

export { GroupUser };
