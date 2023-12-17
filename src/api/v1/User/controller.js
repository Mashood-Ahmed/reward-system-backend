import asyncHandler from "express-async-handler";
import pino from "pino";

import {
  get_all_users,
  get_user,
  upload_profile_picture,
  update_user,
  delete_user,
} from "./services.js";
import { User } from "./User.js";

const logger = pino();

const getUsersByApp = asyncHandler(async (req, res) => {
  await get_all_users(req.user.id)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

const getUserById = asyncHandler(async (req, res) => {
  const user_id = req.params.id;

  await get_user(user_id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

const uploadProfilePicture = asyncHandler(async (req, res) => {
  const attachment = req.file;
  if (attachment) {
    await upload_profile_picture(attachment, req.user.id)
      .then((updatedUser) => {
        res.status(200).json(updatedUser[1]);
      })
      .catch((error) => {
        logger.info("Group updated error: " + group_id);
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(402).json("No attachments found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const data = req.body;

  if (data.email) {
    const isUser = await User.findOne({ where: { email: data.email } });
    if (isUser && isUser.id !== req.user.id) {
      return res
        .status(401)
        .json({ error: "An account with email already exists" });
    }
  }

  await update_user(req.user.id, data)
    .then((updatedUser) => {
      logger.info("User updated: " + updatedUser[1].id);
      return res.status(200).json(updatedUser[1]);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    await delete_user(req.params.id)
      .then((deletedUser) => {
        logger.info("User updated: " + deletedUser[1].id);
        return res.status(200).json({ message: "User deleted successfully" });
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } else {
    return res.status(404).json({ error: "Incorrect User Id: No user found." });
  }
});

export {
  getUsersByApp,
  getUserById,
  uploadProfilePicture,
  updateUserById,
  deleteUserById,
};
