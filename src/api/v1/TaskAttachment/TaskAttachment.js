import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { Task } from "../Task/Task.js";

const TaskAttachment = db.define("task_attachment", {
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

Task.hasMany(TaskAttachment, {
  foreignKey: "task_id",
});
TaskAttachment.belongsTo(Task, {
  foreignKey: "task_id",
});

export { TaskAttachment };
