import { Group } from "./Group.js";

import moment from "moment";
import { uploadFileToS3 } from "../../../utils/upload.js";
import { create_group_members } from "../GroupUser/services.js";
import { GroupUser } from "../GroupUser/GroupUser.js";

const get_group_by_id = async (group_id) => {
  const groups = await Group.findByPk(group_id);
  return groups;
};

const create_group = async (name, description, created_by, members_ids) => {
  try {
    const newGroup = await Group.create({
      name,
      description,
      created_by,
    });

    const membersBulk = members_ids.map((member) => {
      return {
        user_id: member,
        group_id: newGroup.id,
      };
    });

    const members = await create_group_members(membersBulk);

    const response = { group: newGroup, members: members };

    return response;
  } catch (error) {
    return error;
  }
};

const upload_group_image = async (attachment, group_id) => {
  try {
    const imageBuffer = attachment ? attachment.buffer : null;

    let imageLocation = null;

    if (imageBuffer) {
      try {
        const filename = `groups/${group_id}/group_images/${moment().format(
          "YYYY-MM-DDHH:mm:ss"
        )}-${attachment.originalname}`;
        imageLocation = await uploadFileToS3(filename, imageBuffer);
      } catch (error) {
        console.error("Error uploading image to S3:", error);
        res.status(500).json({ error: "Error uploading image to S3" });
        return;
      }
    }

    const updated_group = await update_group(group_id, {
      group_image: imageLocation,
    });

    return updated_group;
  } catch (error) {
    return error;
  }
};

const update_group = async (group_id, data) => {
  const updatedGroup = await Group.update(data, {
    where: { id: group_id },
    returning: true,
    plain: true,
  });

  return updatedGroup;
};

const delete_group = async (group_id) => {
  const deleteGroup = await Group.destroy({
    where: { id: group_id },
  });

  if(deleteGroup){
    const delete_members = await GroupUser.destroy({where: {group_id: group_id}});
  }
  return deleteGroup;
};

export {
  get_group_by_id,
  create_group,
  upload_group_image,
  update_group,
  delete_group,
};
