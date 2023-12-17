import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";
import { Post } from "../Post/Post.js";

const Comment = db.define("comment", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  comment: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
});
Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
});
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

export { Comment };
