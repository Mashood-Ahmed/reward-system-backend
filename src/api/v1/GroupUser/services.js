import { GroupUser } from "./GroupUser.js";
import { Group } from "../Group/Group.js";
import { User } from "../User/User.js";

const get_groups_by_user = async (user_id) => {
  const groups = await GroupUser.findAll({
    where: { user_id: user_id },
    include: Group,
  });

  return groups;
};

const get_group_members = async (group_id) => {
  const groups = await GroupUser.findAll({
    where: { group_id: group_id },
    attributes: ["user_id", "is_admin", "group_id"],
    include: User,
  });

  return groups;
};

const create_group_user = async (user_id, group_id) => {
  const groupUser = await GroupUser.create({
    user_id,
    group_id,
  });
  return groupUser;
};

const create_group_members = async (members) => {
  const groupUser = await GroupUser.bulkCreate(members);
  return groupUser;
};

const update_group_admin = async (admin, user_id) => {
  try {
    const updatedAdmin = await GroupUser.update(
      { is_admin: admin },
      {
        where: {
          id: user_id,
        },
        returning: true,
        plain: true,
      }
    );

    return updatedAdmin;
  } catch (error) {
    return error;
  }
};

const delete_group_user = async (user_id, group_id) => {
  const deleteGroupUser = await GroupUser.destroy({
    where: { group_id: group_id, user_id: user_id },
  });
  return deleteGroupUser;
};

export {
  get_groups_by_user,
  get_group_members,
  create_group_user,
  create_group_members,
  update_group_admin,
  delete_group_user,
};
