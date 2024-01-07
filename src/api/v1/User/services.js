import { User } from "./User.js";
import { Task } from "../Task/Task.js";

import { uploadFileToS3 } from "../../../utils/upload.js";
import moment from "moment/moment.js";
import { Op } from "sequelize";
import { TaskParticipant } from "../TaskParticipant/TaskParticipant.js";
import { Friend } from "../Friend/Friend.js";

const get_all_users = async (user_id) => {
  const users = await User.findAll({ where: { [Op.not]: { id: user_id } } });
  return users;
};

const get_user = async (user_id) => {
  const user = await User.findByPk(user_id, {
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  });
  if(user){
    const taskModerated = await Task.count({
      where: { created_by: user_id },
    });
  
    const taskCompleted = await TaskParticipant.count({
      where: { user_id: user_id },
    });

    const friends = await Friend.count({
      where: {[Op.or] : {user1: user_id, user2: user_id}}
    })

    const total_tasks = taskModerated+taskCompleted || 0;
    
    return {
      user: user,
      total_tasks_count: total_tasks,
      friends_count: friends,
    }

  }else{
    return Error("Invalid User Id.")
  }
};

const upload_profile_picture = async (attachment, user_id) => {
  try {
    const imageBuffer = attachment ? attachment.buffer : null;

    let imageLocation = null;

    if (imageBuffer) {
      try {
        const filename = `users/${user_id}/profile_pictures/${moment().format(
          "YYYY-MM-DDHH:mm:ss"
        )}-${attachment.originalname}`;
        imageLocation = await uploadFileToS3(filename, imageBuffer);
      } catch (error) {
        console.error("Error uploading image to S3:", error);
        res.status(500).json({ error: "Error uploading image to S3" });
        return;
      }
    }

    const updated_group = await update_user(user_id, {
      profile_picture_url: imageLocation,
    });

    return updated_group;
  } catch (error) {
    return error;
  }
};

const update_user = async (user_id, data) => {
  const updatedUser = await User.update(data, {
    where: { id: user_id },
    returning: true,
    plain: true,
  });

  return updatedUser;
};

const delete_user = async (user_id, data) => {
  const deleteUser = await User.destroy({
    where: { id: user_id },
  });
  return deleteUser;
};

export {
  get_all_users,
  get_user,
  upload_profile_picture,
  update_user,
  delete_user,
};
