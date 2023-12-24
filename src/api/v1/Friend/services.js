import { Op } from "sequelize";
import { Friend } from "./Friend.js";
import { User } from "../User/User.js";

const get_friends_by_user = async (user_id) => {
  const friends = await Friend.findAll({
    where: { [Op.or]: { user1: user_id, user2: user_id } },
    include: [
      {
        model: User,
        foreignKey: "user_1",
        as: "User1",
        attributes: ["id", "full_name", "email", "profile_picture_url"],
      },
      {
        model: User,
        foreignKey: "user_2",
        as: "User2",
        attributes: ["id", "full_name", "email", "profile_picture_url"],
      },
    ],
  });

  // console.log(friends);

  return friends;
};

const get_mutual_friends = async (user1_id, user2_id) => {
  const user1_friends = await get_friends_by_user(user1_id);
  const user2_friends = await get_friends_by_user(user2_id);

  const mutualFriends = user1_friends.filter((friend1) => {
    return user2_friends.some(
      (friend2) =>
        (friend1.user1 === friend2.user1 && friend1.user2 === friend2.user2) ||
        (friend1.user1 === friend2.user2 && friend1.user2 === friend2.user1)
    );
  });

  return mutualFriends;
};

const create_friend = async (user1, user2) => {
  const friends = Friend.create({ user1, user2 });
  return friends;
};

const remove_friend_by_id = async (user1_id, user2_id) => {
  const exfriend = await Friend.destroy({
    where: { [Op.or]: { user1: user1_id, user2: user2_id } },
  });

  return exfriend;
};

export {
  get_friends_by_user,
  get_mutual_friends,
  create_friend,
  remove_friend_by_id,
};
