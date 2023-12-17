import { db } from "./db.js";
import { User } from "../api/v1/User/User.js";
import { Task } from "../api/v1/Task/Task.js";
import { Group } from "../api/v1/Group/Group.js";
import { GroupUser } from "../api/v1/GroupUser/GroupUser.js";
import { FriendRequest } from "../api/v1/FriendRequest/FriendRequest.js";
import { Friend } from "../api/v1/Friend/Friend.js";
import { Post } from "../api/v1/Post/Post.js";
import { Like } from "../api/v1/Like/Like.js";
import { Comment } from "../api/v1/Comment/Comment.js";

//all models

export default initModels = async () => {
  await User.sync({ alter: true });
  await Task.sync({ alter: true });
  await Group.sync({ alter: true });
  await GroupUser.sync({ alter: true });
  await FriendRequest.sync({ alter: true });
  await Friend.sync({ alter: true });
  await Post.sync({ alter: true });
  await Like.sync({ alter: true });
  await Comment.sync({ alter: true });
  await db.sync({ alter: true });
};
