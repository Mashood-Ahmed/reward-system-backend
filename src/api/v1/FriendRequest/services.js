import { get_friends_by_user } from "../Friend/services.js";
import { User } from "../User/User.js";
import { get_all_users } from "../User/services.js";
import { FriendRequest } from "./FriendRequest.js";

const get_friend_requests_by_sender = async (user_id) => {
  const requests = await FriendRequest.findAll({
    where: { request_from: user_id },
  });

  return requests;
};

const get_friend_requests_by_user = async (user_id) => {
  const requests = await FriendRequest.findAll({
    where: { request_to: user_id, status: "Pending" },
    include: [
      {
        model: User,
        foreignKey: "request_from",
        as: "requestFrom",
        attributes: ["id", "full_name", "email", "profile_picture_url"],
      },
    ],
  });

  return requests;
};

const get_users_list_for_request = async (user_id) => {
  const users = await get_all_users(user_id);
  console.log(users);
  const recieved_requests = await get_friend_requests_by_user(user_id);
  const sent_requests = await get_friend_requests_by_sender(user_id);
  const friends = await get_friends_by_user(user_id);

  const recieved_users = recieved_requests
    .filter((req) => req.status === "Pending")
    .map((req) => req.request_from);
  const sent_users = sent_requests
    .filter((req) => req.status === "Pending")
    .map((req) => req.request_to);
  const friends_users = friends.map((friend) =>
    friend.user1 === user_id ? friend.user2 : friend.user1
  );

  const requestable_list = users
    .filter((user) => !friends_users.includes(user.id))
    .map((user) => {
      let request_flag = 0;
      if (recieved_users.includes(user.id)) {
        request_flag = 1;
      }
      if (sent_users.includes(user.id)) {
        request_flag = 2;
      }
      return { user, request_flag };
    });

  return requestable_list;
};

const create_friend_request = async (request_to, request_from) => {
  const request = await FriendRequest.create({
    request_from,
    request_to,
  });

  return request;
};

const update_friend_request_status = async (status, request_id) => {
  const updatedRequest = await FriendRequest.update(
    { status: status },
    { where: { id: request_id }, returning: true, plain: true }
  );

  return updatedRequest;
};

const delete_friend_request = async (request_id) => {
  const deleteRequest = await FriendRequest.destroy({
    where: { id: request_id },
  });

  return deleteRequest;
};

export {
  get_users_list_for_request,
  get_friend_requests_by_user,
  create_friend_request,
  update_friend_request_status,
  delete_friend_request,
};
