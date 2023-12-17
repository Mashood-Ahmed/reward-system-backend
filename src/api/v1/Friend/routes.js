import express from "express";
import {
  getFriendsByUser,
  getMutualFriendsByUser,
  removeFriend,
} from "./controller.js";

const router = express.Router();

router.get("/:id", getFriendsByUser);
router.get("/mutual/:id", getMutualFriendsByUser);
router.delete("/remove/:id", removeFriend);

export default router;
