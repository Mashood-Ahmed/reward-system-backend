import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";
import { Group } from "../Group/Group.js";

const Task = db.define("task", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  start_date: {
    type: DataTypes.DATEONLY,
  },
  end_date: {
    type: DataTypes.DATEONLY,
  },
  start_time: {
    type: DataTypes.TIME,
  },
  end_time: {
    type: DataTypes.TIME,
  },
  reward: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  status: {
    type: DataTypes.ENUM(
      "Pending",
      "Assigned",
      "Submitted",
      "Completed",
      "Rewarded"
    ),
    defaultValue: "Pending",
  },
});

User.hasMany(Task, {
  foreignKey: "created_by",
});
Task.belongsTo(User, {
  foreignKey: "created_by",
});

Group.hasMany(Task, {
  foreignKey: "group_id",
  allowNull: true,
});
Task.belongsTo(Group, {
  foreignKey: "group_id",
  allowNull: true,
});

export { Task };
