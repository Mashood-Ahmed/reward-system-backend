import asyncHandler from "express-async-handler";
import { Comment } from "./Comment.js";

import {
  get_comments_by_post,
  get_comment_by_id,
  create_comment,
  update_comment,
  delete_comment,
} from "./services.js";
import { Post } from "../Post/Post.js";

const getCommentsByPost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) {
    await get_comments_by_post(post.id)
      .then((comments) => {
        res.json(comments);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid Post Id. User post found.");
  }
});

const getCommentById = asyncHandler(async (req, res) => {
  await get_comment_by_id(req.params.id)
    .then((comment) => {
      res.json(comment);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

const createComment = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (post) {
    const { comment } = req.body;

    await create_comment(comment, post.id, req.user.id)
      .then((user_comment) => {
        res.json(user_comment);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid Post Id. Post not found");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (comment) {
    await update_comment(req.body.comment, comment.id)
      .then((updatedComment) => {
        res.json(updatedComment[1]);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid Comment Id. Comment not found.");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (comment) {
    await delete_comment(comment.id)
      .then(() => {
        res.json("Comment Deleted Successfully");
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid Comment Id. Comment not found.");
  }
});

export {
  getCommentById,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};
