import express from "express";
import {
  getGroupById,
  createGroup,
  updateGroupById,
  deleteGroupById,
  uploadGroupImage,
} from "./controller.js";

import { isGroupAdmin } from "../../../middlewares/authMiddlewares.js";

import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for image data
});

const router = express.Router();

router.get("/:id", getGroupById);
router.post("/", createGroup);
router.put("/picture/:id", upload.single("image"), uploadGroupImage);
router.put("/:id", updateGroupById);
router.delete("/:id", isGroupAdmin, deleteGroupById);

export default router;
