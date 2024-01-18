import asyncHandler from "express-async-handler";
import pino from "pino";

import {
  get_task_by_id,
  get_task_by_group_id,
  get_tasks_by_creator,
  create_task,
  update_task,
  delete_task,
  update_task_status,
  get_task_stats_by_user,
} from "./services.js";
import { Task } from "./Task.js";
import {
  get_tasks_by_participants,
  submit_task_by_task_participant,
  update_task_participant,
} from "../TaskParticipant/service.js";

import { Group } from "../Group/Group.js";

import { create_transaction } from "../Transaction/services.js";
import { TaskParticipant } from "../TaskParticipant/TaskParticipant.js";
import recordPayment from "../../../utils/web3.js";

const logger = pino();

const getTaskById = asyncHandler(async (req, res) => {
  const task_id = req.params.id;

  await get_task_by_id(task_id)
    .then((task) => {
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ error: "Invalid Task Id." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

const getTaskByGroupId = asyncHandler(async (req, res) => {
  const group_id = req.params.id;

  const group = await Group.findByPk(group_id);

  if (group) {
    await get_task_by_group_id(group_id)
      .then((tasks) => {
        res.status(200).json(tasks);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(404).json("Invalid Group Id, Group not found");
  }
});

const getTaskByUser = asyncHandler(async (req, res) => {
  const user_id = req.user.id;

  await get_tasks_by_participants(user_id)
    .then((tasks) => {
      if (tasks) {
        res.status(200).json(tasks);
      } else {
        res.status(404).json({ error: "No Tasks Found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

const getTaskStatsByUser = asyncHandler(async (req, res) => {
  const user_id = req.user.id;

  await get_task_stats_by_user(user_id)
    .then((stats) => {
      if (stats) {
        res.status(200).json(stats);
      } else {
        res.status(404).json({ error: "No Stats Found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

const getTaskByCreator = asyncHandler(async (req, res) => {
  const user_id = req.user.id;

  await get_tasks_by_creator(user_id)
    .then((tasks) => {
      if (tasks) {
        res.status(200).json(tasks);
      } else {
        res.status(404).json({ error: "No Tasks Found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    start_time,
    end_time,
    reward,
    tags,
    assigned_to,
    group_id,
  } = req.body;

  console.log("$$$$$$$$$$$$$$$$$$$$", reward)

  try {
    const task = await create_task(
      title,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      parseInt(reward),
      JSON.parse(tags),
      req.files ? req.files : null,
      JSON.parse(assigned_to),
      group_id || null,
      req.user.id
    );

    logger.info("Task created: " + task.id);
    res.json(task);
    // res.status(201).json({ task: task.task, participants: task.participants });
  } catch (error) {
    logger.info("Task creation by " + req.user.id + " error.");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

const updateTaskById = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    start_time,
    end_time,
    reward,
    tags,
  } = req.body;

  const task = await Task.findByPk(req.params.id);

  if (task) {
    try {
      const updatedTask = await update_task(
        task.id,
        title,
        description,
        start_date,
        end_date,
        start_time,
        end_time,
        reward,
        tags,
        req.user.id
      );

      logger.info("Task updated: " + task.id);
      res.json(updatedTask[1]);
    } catch (error) {
      logger.info("Task updating by " + req.user.id + " error.");
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Invalid Task Id." });
  }
});

const approveTask = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const { user_id } = req.body;

  const task = await Task.findByPk(task_id);

  if (task) {
    const participant = await TaskParticipant.findOne({
      where: { task_id: task_id, user_id: user_id },
    });
    if (participant) {
      const data = { status: "Approved" };
      try {
        const participants = await update_task_participant(
          data,
          user_id,
          task_id
        );
        logger.info("Task " + task.id + " approved by " + req.user.id);
        res.status(200).json({ participant: participants[1] });
      } catch (error) {
        logger.info("Task submission error: " + task_id + req.user.id);
        res.status(500).json({ error: error.message });
      }
    } else {
      res
        .status(400)
        .json({ error: "User is not a participant of this task." });
    }
  } else {
    res.status(404).json({ error: "Invalid Task Id." });
  }
});

const closeTask = asyncHandler(async (req, res) => {
  const task_id = req.params.id;

  const task = await Task.findByPk(task_id);

  if (task) {
    const data = { status: "Completed" };
    try {
      const updatedTask = await update_task_status(data, task_id);
      logger.info("Task " + task.id + " closed by " + req.user.id);
      res.status(200).json({ task: updatedTask[1] });
    } catch (error) {
      logger.info("Task closing error: " + task_id + req.user.id);
      res.status(500).json({ error: error.message });
    }
  }
});

const rewardTask = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const { transaction_id, user_id } = req.body;

  const task = await Task.findByPk(task_id);

  if (task) {
    if(transaction_id){
      const data = { status: "Rewarded" };
      try {
        const blockchain = await recordPayment(user_id, task.reward, task_id, transaction_id);

        const reward = await create_transaction(
          task.reward,
          "Debit",
          user_id,
          req.user.id
        );
        const participants = await update_task_participant(
          data,
          user_id,
          req.params.id
        );
  
        logger.info(
          "Task " + task.id + " rewarded to " + user_id + " by " + req.user.id
        );
        res.status(200).json({
          blockchain_response: blockchain,
          reward: reward,
          participant: participants[1],
        });
      } catch (error) {
        logger.info("Task rewarding error: " + task_id + req.user.id);
        res.status(500).json({ error: error.message });
      }

    }else{
      res.status(404).json({ error: "Transaction Id Not Found." });
    }
  } else {
    res.status(404).json({ error: "Invalid Task Id." });
  }
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const { status } = req.body;

  const task = await Task.findByPk(task_id);

  if (task) {
    await update_task(task_id, { status: status })
      .then((updatedTask) => {
        logger.info("Task updated: " + updatedTask[1].id);
        res.status(200).json(updatedTask[1]);
      })
      .catch((error) => {
        logger.info("Task updated error: " + task_id);
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(404).json({ error: "Invalid Task Id." });
  }
});

const deleteTaskById = asyncHandler(async (req, res) => {
  const task_id = req.params.id;

  const task = await Task.findByPk(task_id);

  if (task) {
    await delete_task(task_id)
      .then((deletedTask) => {
        logger.info("Task deleted: " + task_id);
        res
          .status(201)
          .json(
            `${deletedTask.task} Tasks Deleted. ${deletedTask.participants} Participants Deleted. ${deletedTask.attachments} Attachments Deleted`
          );
      })
      .catch((error) => {
        logger.info("Task deleting error : " + task_id);
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(404).json({ error: "Invalid Task Id." });
  }
});

export {
  getTaskById,
  getTaskByGroupId,
  getTaskByUser,
  getTaskByCreator,
  getTaskStatsByUser,
  createTask,
  updateTaskStatus,
  approveTask,
  rewardTask,
  closeTask,
  updateTaskById,
  deleteTaskById,
};
