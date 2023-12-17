import asyncHandler from "express-async-handler";
import { Post } from "../Post/Post.js";
import { get_friends_by_user } from "../Friend/services.js";
import { Op } from "sequelize";

const getFeeds = asyncHandler(async (req, res) => {
  const friends = await get_friends_by_user(req.user.id);
  const friendIds = friends.reduce((ids, friend) => {
    if (friend.user1 !== req.user.id) {
      ids.push(friend.user1);
    }
    if (friend.user2 !== req.user.id) {
      ids.push(friend.user2);
    }
    return ids;
  }, []);

  const feeds = await Post.findAll({
    where: { user_id: { [Op.or]: friendIds } },
    order: [["createdAt", "DESC"]],
  });

  res.json(feeds);
});

export default getFeeds;
