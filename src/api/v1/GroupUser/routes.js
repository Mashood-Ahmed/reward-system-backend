import express from "express";
import {
  getGroupsByUser,
  getGroupMemebers,
  createGroupUser,
  deleteGroupUser,
  createGroupAdmin,
  deleteGroupAdmin,
} from "./controller.js";
import { isAuth, isGroupAdmin, isGroupMember } from "../../../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/mygroups", getGroupsByUser);
router.get("/members/:id", isGroupMember, getGroupMemebers);

router.post("/add/", createGroupUser);
router.put("/admin/add/:id", isGroupAdmin, createGroupAdmin);
router.put("/admin/delete/:id", isGroupAdmin, deleteGroupAdmin);
router.delete("/", isGroupAdmin, deleteGroupUser);

export default router;
