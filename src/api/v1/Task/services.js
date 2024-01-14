import { Op, Sequelize } from "sequelize";
import { Task } from "./Task.js";
import { User } from "../User/User.js";
import { create_task_participants } from "../TaskParticipant/service.js";
import { create_task_attachment } from "../TaskAttachment/services.js";
import { TaskParticipant } from "../TaskParticipant/TaskParticipant.js";
import { TaskAttachment } from "../TaskAttachment/TaskAttachment.js";

const get_task_by_id = async (task_id) => {
  const tasks = await Task.findByPk(task_id, {
    include: [TaskParticipant, TaskAttachment],
  });
  return tasks;
};

const get_task_by_group_id = async (group_id) => {
  const tasks = await Task.findAll({
    where: { group_id: group_id },
    include: [{model: User, attributes: ["id", "full_name", " profile_picture_url"]}]
    order: [["createdAt", "ASC"]],
  });
  return tasks;
};

const get_tasks_by_creator = async (creator_id) => {
  const tasks = await Task.findAll({
    where: { created_by: creator_id },
    include: [{ model: User, attributes: ["id", "full_name"] }],
    order: [["updatedAt", "ASC"]],
  });
  return tasks;
};

const get_task_stats_by_user = async (user_id) => {
  const taskModerated = await Task.count({
    where: { created_by: user_id, status: "Completed" },
  });

  const taskCompleted = await TaskParticipant.count({
    where: { user_id: user_id, status: "Approved" },
  });

  const rewardsEarned = await TaskParticipant.findAll({
    attributes: ["id"],
    where: { user_id: user_id, status: "Approved" },
    include: {
      model: Task,
      attributes: ["reward"],
    },
  });

  let totalReward = 0;

  rewardsEarned.forEach((task) => (totalReward += task.task.reward));

  const allTasks = await TaskParticipant.count({ where: { user_id: user_id } });

  const completion_rate = taskCompleted / allTasks;

  const stats = {
    taskModerated: taskModerated || 0,
    taskCompleted: taskCompleted || 0,
    rewardsEarned: totalReward || 0,
    completionRate: completion_rate || 0,
  };

  return stats;
};

const create_task = async (
  title,
  description,
  start_date,
  end_date,
  start_time,
  end_time,
  reward,
  tags,
  attachments,
  assigned_to,
  group_id,
  created_by
) => {
  try {
    const rewardInt = parseInt(reward);
    const newTask = await Task.create({
      title,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      rewardInt,
      tags,
      assigned_to,
      group_id,
      created_by,
    });

    let participants = [];

    if (newTask) {
      const taskParticipants = assigned_to.map((participant) => {
        return {
          user_id: participant,
          task_id: newTask.id,
        };
      });

      if (taskParticipants.length > 0) {
        participants = await create_task_participants(taskParticipants);
      }
    }

    let attachment_list;
    if (attachments.length > 0) {
      attachment_list = await create_task_attachment(
        attachments,
        newTask.id,
        created_by
      );
    }

    return {
      task: newTask,
      participants: participants,
      attachments: attachment_list,
    };
  } catch (error) {
    return error;
  }
};

const update_task = async (
  task_id,
  title,
  description,
  start_date,
  end_date,
  start_time,
  end_time,
  reward,
  tags,
  created_by
) => {
  try {
    const newTask = await Task.update(
      {
        title,
        description,
        start_date,
        end_date,
        start_time,
        end_time,
        reward,
        tags,
        created_by,
      },
      { where: { id: task_id }, returning: true, plain: true }
    );

    return newTask;
  } catch (error) {
    return error;
  }
};

const update_task_status = async (data, task_id) => {
  try {
    const newTask = await Task.update(data, {
      where: { id: task_id },
      returning: true,
      plain: true,
    });

    return newTask;
  } catch (error) {
    return error;
  }
};

const delete_task = async (task_id) => {
  try {
    const deleted_participants = await TaskParticipant.destroy({
      where: { task_id: task_id },
    });
    const deleted_attachments = await TaskAttachment.destroy({
      where: { task_id: task_id },
    });
    const deleted_task = await Task.destroy({ where: { id: task_id } });
    return {
      task: deleted_task,
      participants: deleted_participants,
      attachments: deleted_attachments,
    };
  } catch (error) {
    return error;
  }
};

export {
  get_task_by_id,
  get_task_by_group_id,
  get_tasks_by_creator,
  get_task_stats_by_user,
  create_task,
  update_task,
  update_task_status,
  delete_task,
};
