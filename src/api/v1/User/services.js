import { User } from "./User.js";

import { uploadFileToS3 } from "../../../utils/upload.js";
import moment from "moment/moment.js";
import { Op } from "sequelize";

const get_all_users = async (user_id) => {
  const users = await User.findAll({ where: { [Op.not]: { id: user_id } } });
  return users;
};

const get_user = async (user_id) => {
  const users = await User.findByPk(user_id, {
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  });
  return users;
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
