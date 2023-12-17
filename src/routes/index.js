import express from "express";
import { isAuth } from "../middlewares/authMiddlewares.js";

import { login, signup } from "../api/v1/auth/controller.js";

import userRoutes from "../api/v1/User/routes.js";
import groupRoutes from "../api/v1/Group/routes.js";
import groupUserRoutes from "../api/v1/GroupUser/routes.js";
import taskRoutes from "../api/v1/Task/routes.js";
import friendRequestRoutes from "../api/v1/FriendRequest/routes.js";
import friendRoutes from "../api/v1/Friend/routes.js";
import feedRoutes from "../api/v1/Feed/routes.js";
import postRoutes from "../api/v1/Post/routes.js";
import likeRoutes from "../api/v1/Like/routes.js";
import commentRoutes from "../api/v1/Comment/routes.js";
import walletRoutes from "../api/v1/Wallet/routes.js";
import transactionRoutes from "../api/v1/Transaction/routes.js";

const router = express.Router();

router.get("/", (req, res) => res.send("API Running"));
router.post("/login", login);
router.post("/register", signup);

router.use("/user", userRoutes);
router.use("/group", isAuth, groupRoutes);
router.use("/groupuser", isAuth, groupUserRoutes);
router.use("/task", isAuth, taskRoutes);
router.use("/friendrequest", isAuth, friendRequestRoutes);
router.use("/friend", isAuth, friendRoutes);
router.use("/feed", isAuth, feedRoutes);
router.use("/post", isAuth, postRoutes);
router.use("/like", isAuth, likeRoutes);
router.use("/comment", isAuth, commentRoutes);
router.use("/wallet", isAuth, walletRoutes);
router.use("/transaction", isAuth, transactionRoutes);

export default router;
