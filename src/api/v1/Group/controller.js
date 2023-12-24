import asyncHandler from "express-async-handler";
import pino from "pino";

import {
  get_group_by_id,
  create_group,
  update_group,
  delete_group,
  upload_group_image,
} from "./services.js";
import { Group } from "./Group.js";

const logger = pino();

const getGroupById = asyncHandler(async (req, res) => {
  const group_id = req.params.id;

  await get_group_by_id(group_id)
    .then((group) => {
      if (group) {
        res.status(200).json(group);
      } else {
        res.status(404).json({ error: "Invalid Group Id." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

pm.globals.set("USER_TOKEN", pm.response.json().token);

const createGroup = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;

  if (members.length > 0) {
    await create_group(name, description, req.user.id, members)
      .then((group) => {
        logger.info("Group created: " + group.id);
        res.status(201).json(group);
      })
      .catch((error) => {
        logger.info("Group creation by " + req.user.id + " error.");
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(401).json({ error: "Atleast add one member in a group" });
  }
});

const uploadGroupImage = asyncHandler(async (req, res) => {
  const group = await Group.findByPk(req.params.id);

  if (group) {
    const attachment = req.file;
    await upload_group_image(attachment, group.id)
      .then((updatedGroup) => {
        res.status(200).json(updatedGroup[1]);
      })
      .catch((error) => {
        logger.info("Group updated error: " + group_id);
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(404).json("Invalid Group Id. Group not found");
  }
});

const updateGroupById = asyncHandler(async (req, res) => {
  const group_id = req.params.id;
  const data = req.body;

  const group = await Group.findByPk(group_id);

  if (group) {
    if (group.created_by === req.user.id) {
      await update_group(group_id, data)
        .then((updatedGroup) => {
          logger.info("Group updated: " + updatedGroup[1].id);
          res.status(200).json(updatedGroup[1]);
        })
        .catch((error) => {
          logger.info("Group updated error: " + group_id);
          res.status(500).json({ error: error.message });
        });
    } else {
      res.status(401).json("Not authorized as group admin");
    }
  } else {
    res.status(404).json({ error: "Invalid Group Id." });
  }
});

const deleteGroupById = asyncHandler(async (req, res) => {
  const group_id = req.params.id;

  const group = await Group.findByPk(group_id);

  if (group) {
    if (group.created_by === req.user.id) {
      await delete_group(group_id)
        .then(() => {
          logger.info("Group deleted: " + group_id);
          res.status(200).json({ message: "Group deleted successfully" });
        })
        .catch((error) => {
          logger.info("Group deleting error : " + group_id);
          res.status(500).json({ error: error.message });
        });
    } else {
      res.status(401).json("Not authorized as group admin");
    }
  } else {
    res.status(404).json({ error: "Invalid Group Id." });
  }
});

export {
  getGroupById,
  createGroup,
  uploadGroupImage,
  updateGroupById,
  deleteGroupById,
};
