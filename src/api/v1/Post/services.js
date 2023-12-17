import { Post } from "./Post.js";

const get_post_by_id = async (post_id) => {
  const post = await Post.findByPk(post_id);
  return post;
};

const get_post_by_user = async (user_id) => {
  const post = await Post.findAll({ where: { user_id: user_id } });
  return post;
};

const create_post = async (title, caption, image_urls, user_id) => {
  const post = await Post.create({ title, caption, image_urls, user_id });
  return post;
};

const update_post = async (data, post_id) => {
  const post = await Post.update(data, {
    where: { id: post_id },
    returning: true,
    plain: true,
  });
  return post;
};

const delete_post = async (post_id) => {
  const post = await Post.destroy({ where: { id: post_id } });
  return post;
};

export {
  get_post_by_id,
  get_post_by_user,
  create_post,
  update_post,
  delete_post,
};
