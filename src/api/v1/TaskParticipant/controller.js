import asyncHandler from "express-async-handler";
import { Task } from "../Task/Task.js";

import {
  add_task_participant,
  get_task_participants_by_task,
  remove_task_participant,
} from "./service.js";
import { TaskParticipant } from "./TaskParticipant.js";

const getTaskParticipantByTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await get_task_participants_by_task(task.id)
      .then((participants) => {
        res.json(participants);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res.status(404).json("Invalid Task Id. Task not found.");
  }
});

const addTaskParticipant = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const { user_id } = req.body;
  const task = await Task.findByPk(task_id);
  if (task) {
    await add_task_participant(task_id, user_id)
      .then((participant) => {
        res.status(200).json(participant);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res.status(404).json("Invalid Task Id. Task not found.");
  }
});

const removeTaskParticipant = asyncHandler(async (req, res) => {
  const participant_id = req.query.participantId;
  const participant = await TaskParticipant.findByPk(participant_id);
  if (participant) {
    await remove_task_participant(participant.id)
      .then((participant) => {
        res
          .status(200)
          .json(`${participant} Task Participant Removed Succesfully`);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } else {
    res
      .status(404)
      .json("Invalid Task Participant Id. Task Participant not found.");
  }
});

export { getTaskParticipantByTask, addTaskParticipant, removeTaskParticipant };
