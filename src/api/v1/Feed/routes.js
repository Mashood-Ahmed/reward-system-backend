import express from "express";

import getFeeds from "./controller.js";

const router = express.Router();

router.get("/", getFeeds);

export default router;
