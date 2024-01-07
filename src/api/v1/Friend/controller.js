import asyncHandler from "express-async-handler";
import {
  get_friends_by_user,
  get_mutual_friends,
  remove_friend_by_id,
} from "./services.js";
import { User } from "../User/User.js";
import { Friend } from "./Friend.js";

const getFriendsByUser = asyncHandler(async (req, res) => {
  try {
    const friends = await get_friends_by_user(req.params.id);
    res.json(friends);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

const getMutualFriendsByUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    try {
      const mutualFriends = await get_mutual_friends(req.user.id, user.id);
      res.json(mutualFriends);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  } else {
    res.status(404).json("Invalid User Id. User not found.");
  }
});

const removeFriend = asyncHandler(async (req, res) => {
  const friend = await Friend.findByPk(req.params.id);
  if (friend) {
    try {
      const exFriends = await remove_friend_by_id(friend.id);
      if (exFriends) {
        res.json("User Unfriended.");
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  } else {
    res.status(404).json("Invalid Friend Id. Friend not found.");
  }
});

export { getFriendsByUser, getMutualFriendsByUser, removeFriend };
