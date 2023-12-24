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

router.get("/app", getUsersByApp);
router.get("/:id", getUserById);
router.put("/pfp", upload.single("image"), uploadProfilePicture);
router.put("/", updateUserById);
router.delete("/:id", admin, deleteUserById);

export default router;
