import express from "express";

import {
  getTransactionById,
  getTransactionsByUser,
  createTransaction,
} from "./controller.js";

const router = express.Router();

router.get("/:id", getTransactionById);
router.get("/user/:id", getTransactionsByUser);
router.post("/", createTransaction);

export default router;
