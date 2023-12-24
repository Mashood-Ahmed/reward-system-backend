import express from "express";
import {
  getTaskById,
  getTaskByGroupId,
  getTaskByCreator,
  getTaskByUser,
  createTask,
  updateTaskById,
  deleteTaskById,
  approveTask,
  rewardTask,
  closeTask,
  getTaskStatsByUser,
} from "./controller.js";
import {
  isAuth,
  isGroupMember,
  isTaskCreator,
  isTaskParticipant,
} from "../../../middlewares/authMiddlewares.js";
import {
  getTaskParticipantByTask,
  addTaskParticipant,
  removeTaskParticipant,
} from "../TaskParticipant/controller.js";

import multer from "multer";
import {
  addTaskAttachment,
  getTaskAttachmentByTask,
  getTaskAttachmentById,
  removeTaskAttachment,
} from "../TaskAttachment/controller.js";
import {
  addTaskSubmission,
  submitTask,
  getTaskSubmissionById,
  getTaskSubmissionByTask,
  getTaskSubmissionByUser,
  removeTaskSubmission,
} from "../TaskSubmission/controller.js";

const router = express.Router();

const uploads = multer({
  storage: multer.memoryStorage(), // Use memory storage for image data
});

router.get("/:id", getTaskById);
router.get("/creator/1", getTaskByCreator);
router.get("/member/1", getTaskByUser);
router.get("/group/:id", isAuth, isGroupMember, getTaskByGroupId);
router.get("/stats/1", getTaskStatsByUser);
router.post("/", uploads.array("files"), createTask);
router.put("/:id", isAuth, isTaskCreator, updateTaskById);
router.delete("/:id", isAuth, isTaskCreator, deleteTaskById);

router.put("/approve/:id", isAuth, isTaskCreator, approveTask);
router.put("/reward/:id", isAuth, isTaskCreator, rewardTask);
router.put("/close/:id", isAuth, isTaskCreator, closeTask);

router.get("/participants/:id", getTaskParticipantByTask);
router.post("/participant/:id", isAuth, isTaskCreator, addTaskParticipant);
router.delete("/participant/:id", isAuth, isTaskCreator, removeTaskParticipant);

router.get("/attachment/:id", getTaskAttachmentById);
router.get("/attachments/:id", getTaskAttachmentByTask);
router.post(
  "/attachment/:id",
  uploads.single("file"),
  isAuth,
  isTaskCreator,
  addTaskAttachment
);
router.delete("/attachment/:id", isAuth, isTaskCreator, removeTaskAttachment);

router.get("/submission/:id", getTaskSubmissionById);
router.get("/submissions/:id", getTaskSubmissionByTask);
router.get("/user/submissions/:id", getTaskSubmissionByUser);
router.put(
  "/submit/:id",
  uploads.array("files"),
  isAuth,
  isTaskParticipant,
  submitTask
);
router.post(
  "/submission/:id",
  uploads.single("file"),
  isAuth,
  isTaskParticipant,
  addTaskSubmission
);
router.delete("/submission/:id", isAuth, isTaskParticipant, removeTaskSubmission);

export default router;
