import asyncHandler from "express-async-handler";
import { Task } from "../Task/Task.js";

import { TaskAttachment } from "./TaskAttachment.js";
import {
  add_task_attachment,
  delete_attachment,
  get_task_attachment_by_id,
  get_task_attachment_by_task,
} from "./services.js";

const getTaskAttachmentById = asyncHandler(async (req, res) => {
  const attachment = await TaskAttachment.findByPk(req.params.id);
  if (attachment) {
    await get_task_attachment_by_id(attachment.id)
      .then((attachments) => {
        res.json(attachments);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res
      .status(404)
      .json("Invalid Task Attachment Id. Task Attachment not found.");
  }
});

const getTaskAttachmentByTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await get_task_attachment_by_task(task.id)
      .then((attachments) => {
        res.json(attachments);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res.status(404).json("Invalid Task Id. Task not found.");
  }
});

const addTaskAttachment = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const attachment = req.file;
  const task = await Task.findByPk(task_id);
  if (task) {
    await add_task_attachment(attachment, task_id, req.user.id)
      .then((attachedFile) => {
        res.status(200).json(attachedFile);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res.status(404).json("Invalid Task Id. Task not found.");
  }
});

const removeTaskAttachment = asyncHandler(async (req, res) => {
  const attachment = await TaskAttachment.findByPk(req.query.attachmentId);
  if (attachment) {
    await delete_attachment(attachment)
      .then(() => {
        res.status(200).json("Task Attachment Removed Succesfully");
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res
      .status(404)
      .json("Invalid Task Attachment Id. Task Attachment not found.");
  }
});

export {
  getTaskAttachmentById,
  getTaskAttachmentByTask,
  addTaskAttachment,
  removeTaskAttachment,
};
