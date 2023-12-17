import { Sequelize, DataTypes } from "sequelize";
import { db } from "../../../config/db.js";
import { User } from "../User/User.js";
import { Task } from "../Task/Task.js";

const Post = db.define("post", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  caption: {
    type: DataTypes.TEXT,
  },
  image_urls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
});

User.hasMany(Post, {
  foreignKey: "user_id",
});
Post.belongsTo(User, {
  foreignKey: "user_id",
});

export { Post };
