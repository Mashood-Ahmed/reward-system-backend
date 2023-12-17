import express from "express";
import { isAuth, admin } from "../../../middlewares/authMiddlewares.js";
import {
  getUsersByApp,
  getUserById,
  uploadProfilePicture,
  updateUserById,
  deleteUserById,
} from "./controller.js";

import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for image data
});

const router = express.Router();

router.get("/app", isAuth, getUsersByApp);
router.get("/:id", isAuth, getUserById);
router.put("/pfp", isAuth, upload.single("image"), uploadProfilePicture);
router.put("/", isAuth, updateUserById);
router.delete("/:id", isAuth, admin, deleteUserById);

export default router;
