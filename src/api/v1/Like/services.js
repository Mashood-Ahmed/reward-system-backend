import { User } from "../User/User.js";
import { Like } from "./Like.js";

const get_likes_by_post_preview = async (post_id) => {
  const count = await Like.count({ where: { post_id: post_id } });
  const preview = await Like.findAll({
    where: { post_id: post_id },
    include: [
      { model: User, attributes: ["full_name", "profile_picture_url"] },
    ],
    limit: 3,
  });
  return { count: count, preview: preview };
};

const get_likes_by_post = async (post_id) => {
  const likes = await Like.findAndCountAll({
    where: { post_id: post_id },
    attributes: ["user_id"],
    include: [
      { model: User, attributes: ["full_name", "profile_picture_url"] },
    ],
  });
  return likes;
};

const like_post = async (post_id, user_id) => {
  const like = await Like.create({ post_id, user_id });
  return like;
};

const unlike_post = async (post_id, user_id) => {
  const likes = await Like.destroy({
    where: { post_id: post_id, user_id: user_id },
  });
  return likes;
};

export { get_likes_by_post_preview, get_likes_by_post, like_post, unlike_post };
