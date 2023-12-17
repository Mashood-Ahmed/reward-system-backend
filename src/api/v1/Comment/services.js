import { User } from "../User/User.js";
import { Comment } from "./Comment.js";

const get_comment_by_id = async (comment_id) => {
  const comment = await Comment.findByPk(comment_id);
  return comment;
};

const get_comments_by_post = async (post_id) => {
  const comment = await Comment.findAndCountAll({
    where: { post_id: post_id },
    attributes: ["id", "comment", "user_id", "createdAt"],
    include: [
      { model: User, attributes: ["full_name", "profile_picture_url"] },
    ],
  });
  return comment;
};

const create_comment = async (comment, post_id, user_id) => {
  const user_comment = await Comment.create({ comment, post_id, user_id });
  return user_comment;
};

const update_comment = async (comment, comment_id) => {
  const user_comment = await Comment.update(
    { comment: comment },
    {
      where: { id: comment_id },
      returning: true,
      plain: true,
    }
  );
  return user_comment;
};

const delete_comment = async (comment_id) => {
  const comment = await Comment.destroy({ where: { id: comment_id } });
  return comment;
};

export {
  get_comment_by_id,
  get_comments_by_post,
  create_comment,
  update_comment,
  delete_comment,
};
