import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../api/v1/User/User.js";
import { Task } from "../api/v1/Task/Task.js";
import { Group } from "../api/v1/Group/Group.js";
import { GroupUser } from "../api/v1/GroupUser/GroupUser.js";
import { TaskParticipant } from "../api/v1/TaskParticipant/TaskParticipant.js";

const isAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id);

      next();
    } catch (err) {
      res.status(401).json("Middleware Error: Not Authorized , token failed");
    }
  }

  if (!token) {
    res.status(401).json("Middleware Error: Not Authorized, no token");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.account_type === "admin") {
    next();
  } else {
    res.status(401).json("Middleware Error: Not authorized as an admin");
  }
});

const isTaskCreator = asyncHandler(async (req, res, next) => {
  const task = await Task.findByPk(req.params.id);

  if (task) {
    if (task.created_by === req.user.id) {
      next();
    } else {
      res.status(401).json("Middleware Error: Not authorized as task moderator");
    }
  } else {
    res.status(404).json("Middleware Error: Invalid Task Id.");
  }
});

const isTaskParticipant = asyncHandler(async (req, res, next) => {
  const task = await Task.findByPk(req.params.id);

  if (task) {
    const participant = await TaskParticipant.findOne({
      where: { task_id: task.id, user_id: req.user.id },
    });
    if (participant) {
      next();
    } else {
      res.status(401).json("Middleware Error: Not a participant of the task");
    }
  } else {
    res.status(404).json("Middleware Error: Invalid Task Id.");
  }
});

const isGroupAdmin = asyncHandler(async (req, res, next) => {
  const group_id = req.params.id ?  req.params.id : req.query.group;
  const group = await Group.findByPk(group_id);

  if (group) {
    if (group.created_by === req.user.id) {
      next();
    } else {
      res.status(401).json("Middleware Error: Not authorized as group admin");
    }
  } else {
    res.status(404).json("Middleware Error: Invalid Group Id.");
  }
});

const isGroupMember = asyncHandler(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id);

  if (group) {
    const member = await GroupUser.findOne({
      where: { group_id: group.id, user_id: req.user.id },
    });
    if (member) {
      next();
    } else {
      res.status(401).json("Middleware Error:  Not a group member.");
    }
  } else {
    res.status(404).json("Middleware Error:  Invalid Group Id.");
  }
});

export {
  isAuth,
  admin,
  isTaskCreator,
  isTaskParticipant,
  isGroupAdmin,
  isGroupMember,
};
