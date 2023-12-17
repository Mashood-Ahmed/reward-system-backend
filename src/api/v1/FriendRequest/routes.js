import express from "express";
import {
  acceptRequest,
  cancelRequest,
  getRequestsByUser,
  getUsersListForRequest,
  sendRequest,
} from "./controller.js";

const router = express.Router();

router.get("/list/", getUsersListForRequest);
router.get("/", getRequestsByUser);
router.post("/:id", sendRequest);
router.put("/:id", acceptRequest);
router.delete("/:id", cancelRequest);

export default router;
