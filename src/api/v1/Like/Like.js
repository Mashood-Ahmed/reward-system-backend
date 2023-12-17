import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";
import { Post } from "../Post/Post.js";

const Like = db.define("like", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
});

Post.hasMany(Like, {
  foreignKey: "post_id",
});
Like.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Like, {
  foreignKey: "user_id",
});
Like.belongsTo(User, {
  foreignKey: "user_id",
});

export { Like };
