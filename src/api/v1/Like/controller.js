import asyncHandler from "express-async-handler";

import { Like } from "./Like.js";
import { Post } from "../Post/Post.js";

import { get_likes_by_post, like_post, unlike_post } from "./services.js";

const getLikesByPost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) {
    await get_likes_by_post(post.id)
      .then((likes) => {
        res.json(likes);
      })
      .catch((error) => {
        req.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid Post Id. Post not found");
  }
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) {
    const existingLike = await Like.findOne({
      where: { post_id: post.id, user_id: req.user.id },
    });
    if (!existingLike) {
      await like_post(post.id, req.user.id)
        .then((like) => {
          res.json(like);
        })
        .catch((error) => {
          req.status(500).json(error.message);
        });
    } else {
      return res.status(402).json("Post already liked");
    }
  } else {
    res.status(404).json("Invalid Post Id. Post not found");
  }
});

const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) {
    const existingLike = await Like.findOne({
      where: { post_id: post.id, user_id: req.user.id },
    });
    if (existingLike) {
      await unlike_post(post.id, req.user.id)
        .then(() => {
          res.json("Post Unliked Successfully");
        })
        .catch((error) => {
          req.status(500).json(error.message);
        });
    } else {
      return res.status(402).json("Post not liked");
    }
  } else {
    res.status(404).json("Invalid Post Id. Post not found");
  }
});

export { getLikesByPost, likePost, unlikePost };
