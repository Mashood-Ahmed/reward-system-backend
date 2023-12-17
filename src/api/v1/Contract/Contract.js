import { Sequelize, DataTypes, NOW } from "sequelize";
import { db } from "../../../config/db.js";
import { Task } from "../Task/Task.js";

const Contract = db.define("task", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  opened_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: NOW(),
  },
  closed_at: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM("Opened", "Failed", "Successfull"),
    defaultValue: "Opened",
  },
});

Task.hasMany(Contract, {
  foreignKey: "task_id",
});
Contract.belongsTo(Task, {
  foreignKey: "task_id",
});

TaskParticipant.hasMany(Contract, {
  foreignKey: "participant_id",
});
Contract.belongsTo(TaskParticipant, {
  foreignKey: "participant_id",
});

export { Contract };
