import express from "express";

import {
  getPostById,
  getPostByUser,
  createPost,
  updatePost,
  deletePost,
} from "./controller.js";

const router = express.Router();

router.get("/:id", getPostById);
router.get("/user/:id", getPostByUser);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
