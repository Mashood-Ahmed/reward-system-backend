import moment from "moment";
import { deleteFileFromS3, uploadFileToS3 } from "../../../utils/upload.js";
import { TaskSubmission } from "./TaskSubmission.js";
import { Task } from "../Task/Task.js";
import { TaskParticipant } from "../TaskParticipant/TaskParticipant.js";
import { User } from "../User/User.js";

const get_task_submission_by_id = async (submission_id) => {
  const submission = await TaskSubmission.findByPk(submission_id);
  return submission;
};

const get_task_submission_by_user = async (participant_id, task_id) => {
  const submissions = await TaskSubmission.findAll({
    where: {
      participant_id: participant_id,
      task_id: task_id,
    },
  });
  return submissions;
};

const get_task_submission_by_task = async (task_id) => {
  const submissions = await TaskSubmission.findAll({
    where: {
      task_id: task_id,
    },
  });

  const groupedData = {};
  if (submissions.length > 0) {
    submissions.forEach((result) => {
      const participantId = result.participant_id;

      if (!groupedData[participantId]) {
        groupedData[participantId] = [];
      }
      groupedData[participantId].push(result);
    });
  }

  return groupedData;
};

const create_task_submission = async (attachments, user_id, task) => {
  const uploadedImageLocations = [];

  if (attachments.length > 0) {
    const imageBuffers = attachments
      ? attachments.map((file) => {
          return { name: file.originalname, file: file.buffer };
        })
      : [];

    for (const imageBuffer of imageBuffers) {
      try {
        const filename = `users/${task.created_by}/tasks/${task.id}/submissions/${user_id}/${imageBuffer.name}`;
        const imageLocation = await uploadFileToS3(filename, imageBuffer.file);
        uploadedImageLocations.push(imageLocation);
      } catch (error) {
        return error;
      }
    }
  }

  const task_submissions = uploadedImageLocations.map((file) => {
    return {
      url: file,
      task_id: task.id,
      participant_id: user_id,
    };
  });

  const submissions = await TaskSubmission.bulkCreate(task_submissions);

  const participant = await TaskParticipant.update(
    { status: "Submitted" },
    {
      where: { user_id: user_id, task_id: task.id },
      returning: true,
      plain: true,
    }
  );
  return submissions;
};

const add_task_submission = async (submission, user_id, task_id) => {
  try {
    const imageBuffer = {
      name: submission?.originalname,
      file: submission.buffer,
    };

    let uploadedImageLocation;
    try {
      const filename = `users/${user_id}/tasks/${task_id}/submissions/${user_id}/${moment().format(
        "YYYY-MM-DDHH:mm:ss"
      )}-${imageBuffer.name}`;
      const imageLocation = await uploadFileToS3(filename, imageBuffer.file);
      uploadedImageLocation = imageLocation;
    } catch (error) {
      return error;
    }

    const task_submission = await TaskSubmission.create({
      url: uploadedImageLocation,
      participant_id: user_id,
      task_id: task_id,
    });

    return task_submission;
  } catch (error) {
    return error;
  }
};

// const create_task_submission = async (submissions, user_id, task_id) => {
//   try {
//     if (submissions.length > 0) {
//       const imageBuffers = submissions
//         ? submissions.map((file) => {
//             return { name: file.originalname, file: file.buffer };
//           })
//         : [];

//       const uploadedImageLocations = [];

//       for (const imageBuffer of imageBuffers) {
//         try {
//           const filename = `users/${
//             newTask.created_by
//           }/tasks/${task_id}/submissions/${user_id}/${moment().format(
//             "YYYY-MM-DDHH:mm:ss"
//           )}-${imageBuffer.name}`;
//           const imageLocation = await uploadFileToS3(
//             filename,
//             imageBuffer.file
//           );
//           uploadedImageLocations.push(imageLocation);
//         } catch (error) {
//           return error;
//         }
//       }

//       const allSubmissions = uploadedImageLocations.map((file) => {
//         return {
//           url: file,
//           user_id: user_id,
//           task_id: task_id,
//         };
//       });

//       const task_submissions = await TaskSubmission.bulkCreate(allSubmissions);
//       return { submissions: task_submissions };
//     } else {
//       return Error("Atleast one file must be attached");
//     }
//   } catch (error) {
//     return error;
//   }
// };

const delete_submission = async (task_id, user_id, submission_id) => {
  try {
    const submission = await TaskSubmission.findByPk(submission_id);
    const s3_removed = deleteFileFromS3(submission.url);
    let removed_submission = null;
    if (s3_removed) {
      removed_submission = await TaskSubmission.destroy({
        where: { id: submission.id },
      });
    }

    let updated_status;

    if(removed_submission){
      const submission_count = await TaskSubmission.count({where: {task_id: task_id, user_id: user_id}});
      
      if(submission_count > 1){
        const updated_participant = await TaskParticipant.update({status: "Pending"}, {where: {task_id: task_id, user_id: user_id}, returning: true, plain: true});
        if(updated_participant){
          updated_status = updated_participant[1].status
        }
      }
    }

    return {submission: removed_submission, status: updated_status}

  } catch (error) {
    return error;
  }
};

export {
  get_task_submission_by_id,
  get_task_submission_by_task,
  get_task_submission_by_user,
  add_task_submission,
  create_task_submission,
  delete_submission,
};
