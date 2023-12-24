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

router.get("/mygroups", isAuth, getGroupsByUser);
router.get("/members/:id", isAuth, isGroupMember, getGroupMemebers);

router.post("/add/", createGroupUser);
router.put("/admin/add/:id", isGroupAdmin, createGroupAdmin);
router.put("/admin/delete/:id", isGroupAdmin, deleteGroupAdmin);
router.delete("/", isGroupAdmin, deleteGroupUser);

export default router;
