import moment from "moment";
import { TaskParticipant } from "./TaskParticipant.js";
import { uploadFileToS3 } from "../../../utils/upload.js";
import { Task } from "../Task/Task.js";
import { User } from "../User/User.js";

const get_task_participants_by_task = async (task_id) => {
  const participants = await TaskParticipant.findAll({
    where: { task_id: task_id },
    include: [
      { model: User, attributes: ["id", "full_name", "profile_picture_url"] },
    ],
  });
  return participants;
};

const get_tasks_by_participants = async (user_id) => {
  const participants = await TaskParticipant.findAll({
    where: { user_id: user_id },
    include: [
      {
        model: Task,
        include: [{ model: User, attributes: ["id", "full_name"] }],
      },
    ],
    order: [["updatedAt", "ASC"]],
  });
  return participants;
};

const add_task_participant = async (task_id, user_id) => {
  const participants = await TaskParticipant.create({ task_id, user_id });
  return participants;
};

const create_task_participants = async (participantList) => {
  const participants = await TaskParticipant.bulkCreate(participantList);
  return participants;
};

const submit_task_by_task_participant = async (attachments, user_id, task) => {
  const uploadedImageLocations = [];

  if (attachments.length > 0) {
    const imageBuffers = attachments
      ? attachments.map((file) => {
          return { name: file.originalname, file: file.buffer };
        })
      : [];

    for (const imageBuffer of imageBuffers) {
      try {
        const filename = `users/${task.created_by}/tasks/${
          task.id
        }/submissions/${user_id}/${moment().format("YYYY-MM-DDHH:mm:ss")}-${
          imageBuffer.name
        }`;
        const imageLocation = await uploadFileToS3(filename, imageBuffer.file);
        uploadedImageLocations.push(imageLocation);
      } catch (error) {
        return error;
      }
    }
  }

  const participant = await TaskParticipant.update(
    { submissions: uploadedImageLocations, status: "Submitted" },
    {
      where: { user_id: user_id, task_id: task.id },
      returning: true,
      plain: true,
    }
  );
  return participant;
};

const update_task_participant = async (data, user_id, task_id) => {
  const participant = await TaskParticipant.update(data, {
    where: { user_id: user_id, task_id: task_id },
    returning: true,
    plain: true,
  });

  return participant;
};

const remove_task_participant = async (participant_id) => {
  const participants = await TaskParticipant.destroy({
    where: { id: participant_id },
  });
  return participants;
};

export {
  get_task_participants_by_task,
  get_tasks_by_participants,
  add_task_participant,
  create_task_participants,
  submit_task_by_task_participant,
  update_task_participant,
  remove_task_participant,
};
