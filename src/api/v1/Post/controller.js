import asyncHandler from "express-async-handler";
import { Post } from "./Post.js";

import {
  get_post_by_id,
  get_post_by_user,
  create_post,
  update_post,
  delete_post,
} from "./services.js";
import { User } from "../User/User.js";

const getPostByUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await get_post_by_user(user.id)
      .then((posts) => {
        res.json(posts);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid User Id. User not found.");
  }
});

const getPostById = asyncHandler(async (req, res) => {
  await get_post_by_id(req.params.id)
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

const createPost = asyncHandler(async (req, res) => {
  const { title, caption, image_urls } = req.body;

  await create_post(title, caption, image_urls, req.user.id)
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) {
    await update_post(req.body, post.id)
      .then((updatedPost) => {
        res.json(updatedPost[1]);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid Post Id. Post not found.");
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) {
    await delete_post(post.id)
      .then(() => {
        res.json("Post Deleted Successfully");
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid Post Id. Post not found.");
  }
});

export { getPostById, getPostByUser, createPost, updatePost, deletePost };
