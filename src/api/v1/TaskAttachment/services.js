import moment from "moment";
import { deleteFileFromS3, uploadFileToS3 } from "../../../utils/upload.js";
import { TaskAttachment } from "./TaskAttachment.js";
import { Task } from "../Task/Task.js";

const get_task_attachment_by_id = async (attachment_id) => {
  const attachment = await TaskAttachment.findByPk(attachment_id);
  return attachment;
};

const get_task_attachment_by_task = async (task_id) => {
  const attachments = await TaskAttachment.findAll({
    where: {
      task_id: task_id,
    },
  });
  return attachments;
};

const add_task_attachment = async (attachment, task_id, user_id) => {
  try {
    const imageBuffer = {
      name: attachment?.originalname,
      file: attachment.buffer,
    };

    let uploadedImageLocation;
    try {
      const filename = `users/${user_id}/tasks/${task_id}/attachments/${imageBuffer.name}`;
      const imageLocation = await uploadFileToS3(filename, imageBuffer.file);
      uploadedImageLocation = imageLocation;
    } catch (error) {
      return error;
    }

    const task_attachment = await TaskAttachment.create({
      url: uploadedImageLocation,
      task_id: task_id,
    });

    return { attachments: task_attachment };
  } catch (error) {
    return error;
  }
};

const create_task_attachment = async (attachments, task_id, user_id) => {
  try {
    const imageBuffers = attachments
      ? attachments.map((file) => {
          return { name: file.originalname, file: file.buffer };
        })
      : [];

    const uploadedImageLocations = [];

    for (const imageBuffer of imageBuffers) {
      try {
        const filename = `users/${user_id}/tasks/${task_id}/attachments/${imageBuffer.name}`;
        const imageLocation = await uploadFileToS3(filename, imageBuffer.file);
        uploadedImageLocations.push(imageLocation);
      } catch (error) {
        return error;
      }
    }

    const allAttachments = uploadedImageLocations.map((file) => {
      return {
        url: file,
        task_id: task_id,
      };
    });

    const task_attachments = await TaskAttachment.bulkCreate(allAttachments);
    return task_attachments;
  } catch (error) {
    return error;
  }
};

const delete_attachment = async (attachment) => {
  try {
    const s3_removed = deleteFileFromS3(attachment.url);
    let removed_attachment = null;
    if (s3_removed) {
      removed_attachment = await TaskAttachment.destroy({
        where: { id: attachment.id },
      });
    }
    return removed_attachment;
  } catch (error) {
    return error;
  }
};

export {
  get_task_attachment_by_id,
  get_task_attachment_by_task,
  add_task_attachment,
  create_task_attachment,
  delete_attachment,
};
