import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { Task } from "../Task/Task.js";
import { TaskParticipant } from "../TaskParticipant/TaskParticipant.js";
import { User } from "../User/User.js";

const TaskSubmission = db.define("task_submission", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: DataTypes.TEXT,
  },
});

Task.hasMany(TaskSubmission, {
  foreignKey: "task_id",
});
TaskSubmission.belongsTo(Task, {
  foreignKey: "task_id",
});

User.hasMany(TaskSubmission, {
  foreignKey: "participant_id",
});
TaskSubmission.belongsTo(User, {
  foreignKey: "participant_id",
});

export { TaskSubmission };
