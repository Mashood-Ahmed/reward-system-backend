import asyncHandler from "express-async-handler";
import {
  create_friend_request,
  delete_friend_request,
  get_friend_requests_by_user,
  get_users_list_for_request,
  update_friend_request_status,
} from "./services.js";
import { User } from "../User/User.js";
import { create_friend } from "../Friend/services.js";
import { FriendRequest } from "./FriendRequest.js";

const getUsersListForRequest = asyncHandler(async (req, res) => {
  try {
    const users_list = await get_users_list_for_request(req.user.id);
    res.status(200).json(users_list);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const getRequestsByUser = asyncHandler(async (req, res) => {
  try {
    const requests = await get_friend_requests_by_user(req.user.id);
    res.json(requests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const sendRequest = asyncHandler(async (req, res) => {
  const request_to = await User.findByPk(req.params.id);

  if (request_to) {
    const is_request = await FriendRequest.findOne({
      where: { request_from: req.user.id, request_to: req.params.id },
    });
    const is_request_recieved = await FriendRequest.findOne({
      where: { request_from: req.params.id, request_to: req.user.id },
    });

    if (!is_request && !is_request_recieved) {
      try {
        const request = await create_friend_request(request_to.id, req.user.id);
        res.status(200).json(request);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    } else {
      res.status(301).json("Request is already sent.");
    }
  } else {
    res.status(404).json("Invalid User Id. User not found.");
  }
});

const acceptRequest = asyncHandler(async (req, res) => {
  const friend_request = await FriendRequest.findByPk(req.params.id);
  if (friend_request) {
    if (friend_request.request_to === req.user.id) {
      try {
        const request = await update_friend_request_status(
          "Accepted",
          friend_request.id
        );
        const friends = await create_friend(
          friend_request.request_from,
          friend_request.request_to
        );

        res.status(200).json({ request: request[1], friend: friends });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    } else {
      res.status(404).json("Unauthorized Request. User cannot accept request.");
    }
  } else {
    res.status(404).json("Invalid Friend requests Id. Request not found.");
  }
});

const cancelRequest = asyncHandler(async (req, res) => {
  const request_id = await FriendRequest.findByPk(req.params.id);
  if (request_id) {
    try {
      const request = await delete_friend_request(request_id.id);
      if (request) {
        res.status(200).json("Request Rejected");
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(404).json("Invalid Friend requests Id. Request not found.");
  }
});

export {
  getUsersListForRequest,
  getRequestsByUser,
  sendRequest,
  acceptRequest,
  cancelRequest,
};
