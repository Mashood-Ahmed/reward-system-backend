import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";

const Group = db.define("group", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  group_image: {
    type: DataTypes.TEXT,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

User.hasMany(Group, {
  foreignKey: "created_by",
});
Group.belongsTo(User, {
  foreignKey: "created_by",
});

export { Group };
