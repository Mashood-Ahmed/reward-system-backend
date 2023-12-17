import express from "express";

import { getLikesByPost, likePost, unlikePost } from "./controller.js";

const router = express.Router();

router.get("/:id", getLikesByPost);
router.post("/:id", likePost);
router.delete("/:id", unlikePost);

export default router;
