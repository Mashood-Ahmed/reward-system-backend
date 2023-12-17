import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";
import { Task } from "../Task/Task.js";

const TaskParticipant = db.define("task_participant", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  submissions: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  status: {
    type: DataTypes.ENUM("Pending", "Submitted", "Approved", "Rewarded"),
    defaultValue: "Pending",
  },
});

User.hasMany(TaskParticipant, {
  foreignKey: "user_id",
});
TaskParticipant.belongsTo(User, {
  foreignKey: "user_id",
});

Task.hasMany(TaskParticipant, {
  foreignKey: "task_id",
  onDelete: "CASCADE",
});
TaskParticipant.belongsTo(Task, {
  foreignKey: "task_id",
  onDelete: "CASCADE",
});

export { TaskParticipant };
