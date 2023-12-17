import { Sequelize, DataTypes } from "sequelize";
import { db } from "../config/db.js";
import { User } from "../api/v1/User/User.js";
import { Group } from "../api/v1/Group/Group.js";
import { GroupUser } from "../api/v1/GroupUser/GroupUser.js";
import { Task } from "../api/v1/Task/Task.js";
import { TaskParticipant } from "../api/v1/TaskParticipant/TaskParticipant.js";
import { Friend } from "../api/v1/Friend/Friend.js";
import { FriendRequest } from "../api/v1/FriendRequest/FriendRequest.js";
import { Post } from "../api/v1/Post/Post.js";
import { Like } from "../api/v1/Like/Like.js";
import { Comment } from "../api/v1/Comment/Comment.js";
import { Transaction } from "../api/v1/Transaction/Transaction.js";
import { Wallet } from "../api/v1/Wallet/Wallet.js";
import { createGroupAdminTrigger, deleteTaskParticipants } from "./trigger.js";
import { TaskAttachment } from "../api/v1/TaskAttachment/TaskAttachment.js";
import { TaskSubmission } from "../api/v1/TaskSubmission/TaskSubmission.js";

const initModels = async () => {
  await db.sync({ alter: true });
  await User.sync({ alter: true });
  await Group.sync({ alter: true });
  await GroupUser.sync({ alter: true });
  await Task.sync({ alter: true });
  await TaskAttachment.sync({ alter: true });
  await TaskParticipant.sync({ alter: true });
  await TaskSubmission.sync({ alter: true });
  await Friend.sync({ alter: true });
  await FriendRequest.sync({ alter: true });
  await Post.sync({ alter: true });
  await Like.sync({ alter: true });
  await Comment.sync({ alter: true });
  await Transaction.sync({ alter: true });
  await Wallet.sync({ alter: true });
};

const initializeDatabase = async (req, res) => {
  try {
    await initModels();
    res.json("Database Set Up complete");
  } catch (err) {
    res.send(err);
  }
};

const initProcedures = async (req, res) => {
  try {
    await createGroupAdminTrigger();
    await deleteTaskParticipants();
    res.json("Procedures Created Succesfully");
  } catch (err) {
    res.send(err);
  }
};

export { initializeDatabase, initProcedures };
