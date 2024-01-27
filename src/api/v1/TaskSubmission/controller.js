import asyncHandler from "express-async-handler";
import { Task } from "../Task/Task.js";

import { TaskSubmission } from "./TaskSubmission.js";
import {
  add_task_submission,
  create_task_submission,
  delete_submission,
  get_task_submission_by_id,
  get_task_submission_by_task,
  get_task_submission_by_user,
} from "./services.js";
import { TaskParticipant } from "../TaskParticipant/TaskParticipant.js";
import { User } from "../User/User.js";
import pino from "pino";

const logger = pino();

const getTaskSubmissionById = asyncHandler(async (req, res) => {
  const submission = await TaskSubmission.findByPk(req.params.id);
  if (submission) {
    await get_task_submission_by_id(submission.id)
      .then((submissions) => {
        res.json(submissions);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res
      .status(404)
      .json("Invalid Task Submission Id. Task Submission not found.");
  }
});

const getTaskSubmissionByTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await get_task_submission_by_task(task.id)
      .then((submissions) => {
        res.json(submissions);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res.status(404).json("Invalid Task Id. Task not found.");
  }
});

const getTaskSubmissionByUser = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  const user = req.query.userId;
  if (task) {
    await get_task_submission_by_user(user, task.id)
      .then((submissions) => {
        res.json(submissions);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res.status(404).json("Invalid Task Id. Task not found.");
  }
});

const submitTask = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const attachments = req.files ? req.files : null;

  if (attachments) {
    const task = await Task.findByPk(task_id);

    if (task) {
      await create_task_submission(attachments, req.user.id, task)
        .then((submittedFiles) => {
          logger.info("Task " + task.id + " submitted by " + req.user.id);
          res.status(200).json(submittedFiles);
        })
        .catch((error) => {
          logger.info("Task submission error: " + task_id + req.user.id);
          res.status(500).json({ error: error.message });
        });
    } else {
      res.status(404).json({ error: "Invalid Task Id." });
    }
  } else {
    return res.status(402).json("No attachments found.");
  }
});

const addTaskSubmission = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const submission = req.file ? req.file : null;
  const task = await Task.findByPk(task_id);
  if (task) {
    await add_task_submission(submission, req.user.id, task_id)
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

const removeTaskSubmission = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  const submission = await TaskSubmission.findByPk(req.query.submissionId);
  if (task && submission) {
    await delete_submission(task.id, req.user.id, submission.id)
      .then((result) => {
        res.status(200).json({result: result, msg: "Submission Removed Successfully"});
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res.status(404).json("Invalid Task or Submission Id. Task or Submission not found.");
  }
});

export {
  getTaskSubmissionById,
  getTaskSubmissionByUser,
  getTaskSubmissionByTask,
  submitTask,
  addTaskSubmission,
  removeTaskSubmission,
};
