import express from "express";

import { getWalletById, getWalletByUser } from "./controller.js";

const router = express.Router();

router.get("/:id", getWalletById);
router.get("/user/1", getWalletByUser);

export default router;
