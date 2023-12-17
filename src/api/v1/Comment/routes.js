import express from "express";

import {
  getCommentById,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from "./controller.js";

const router = express.Router();

router.get("/:id", getCommentById);
router.get("/post/:id", getCommentsByPost);
router.post("/:id", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
