import asyncHandler from "express-async-handler";
import pino from "pino";

import {
  get_groups_by_user,
  get_group_members,
  create_group_user,
  update_group_admin,
  delete_group_user,
} from "./services.js";

import { Group } from "../Group/Group.js";
import { User } from "../User/User.js";
import { GroupUser } from "./GroupUser.js";

const logger = pino();

const getGroupsByUser = asyncHandler(async (req, res) => {
  await get_groups_by_user(req.user.id)
    .then((groups) => {
      res.json(groups);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message.message });
    });
});

const getGroupMemebers = asyncHandler(async (req, res) => {
  const group = await Group.findByPk(req.params.id);
  if (group) {
    await get_group_members(group.id)
      .then((members) => {
        res.json(members);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message.message });
      });
  } else {
    res.status(404).json("Invalid Group Id.");
  }
});

const createGroupUser = asyncHandler(async (req, res) => {
  const { user_id, group_id } = req.body;

  const group = Group.findByPk(group_id);
  if (group) {
    const user = User.findByPk(user_id);
    if (user) {
      const groupMembers = await get_group_members(group_id);
      groupMembers.forEach((member) => {
        if (member.user_id === user_id) {
          res.status(401).json("User already exist in the group.");
          throw Error("Group User Adding Error");
        }
      });
      await create_group_user(user_id, group_id)
        .then((groupUser) => {
          logger.info("Group User Created: " + groupUser.id);
          res.status(201).json(groupUser);
        })
        .catch((error) => {
          logger.info("Group user creation for " + user_id + " error.");
          res.status(500).json({ error: error.message.message });
        });
    } else {
      res.status(404).json({ error: "Invalid User Id" });
    }
  } else {
    res.status(404).json({ error: "Invalid Group Id" });
  }
});

const createGroupAdmin = asyncHandler(async (req, res) => {
  const group_id = req.params.id;
  const { user_id } = req.body;

  const group = Group.findByPk(group_id);
  if (group) {
    const user = GroupUser.findOne({
      where: { group_id: group_id, user_id: user_id },
    });
    if (user) {
      await update_group_admin(true, user.id)
        .then((admin) => {
          logger.info(user_id + " set as admin for group " + group_id);
          res.status(200).json(admin);
        })
        .catch((error) => {
          logger.info(
            "Error setting " + user_id + " as admin for group " + group_id
          );
          console.log(error);
          res.status(500).json({ error: error.message });
        });
    } else {
      res.status(404).json({ error: "User is not a member of this group" });
    }
  } else {
    res.status(404).json({ error: "Invalid Group Id" });
  }
});

const deleteGroupAdmin = asyncHandler(async (req, res) => {
  const group_id = req.params.id;
  const { user_id } = req.body;

  const group = Group.findByPk(group_id);
  if (group) {
    const user = GroupUser.findOne({
      where: { user_id: user_id, group_id: group.id },
    });
    if (user) {
      await update_group_admin(false, user.id)
        .then((admin) => {
          logger.info(user_id + " removed as admin for group " + group_id);
          res.status(200).json(admin[1]);
        })
        .catch((error) => {
          logger.info(
            "Error removing " + user_id + " as admin for group " + group_id
          );
          res.status(500).json({ error: error.message.message });
        });
    } else {
      res.status(404).json({ error: "User is not a member of this group" });
    }
  } else {
    res.status(404).json({ error: "Invalid Group Id" });
  }
});

const deleteGroupUser = asyncHandler(async (req, res) => {
  const group_id = req.query.group;
  const user_id = req.query.user;

  const group = Group.findByPk(group_id);
  if (group) {
    const user = User.findByPk(user_id);
    if (user) {
      await delete_group_user(user_id, group_id)
        .then(() => {
          logger.info(user_id + " removed from group " + group_id);
          res.status(200).json("Removed " + user_id + "from group.");
        })
        .catch((error) => {
          logger.info("Error removing " + user_id + "  from group " + group_id);
          res.status(500).json({ error: error.message.message });
        });
    } else {
      res.status(404).json({ error: "Invalid User Id" });
    }
  } else {
    res.status(404).json({ error: "Invalid Group Id" });
  }
});

export {
  getGroupsByUser,
  getGroupMemebers,
  createGroupUser,
  createGroupAdmin,
  deleteGroupAdmin,
  deleteGroupUser,
};
