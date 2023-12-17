import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import pino from "pino";

const logger = pino();

import { registerUser, loginUser } from "./services.js";
import { User } from "../User/User.js";

const signup = asyncHandler(async (req, res) => {
  const { full_name, email, gender, password, account_type } = req.body;

  if (email) {
    var isUser = await User.findOne({ where: { email } });
  }

  if (!isUser) {
    try {
      var hashed_password = await bcrypt.hash(password, 10);
    } catch (e) {
      return res.status(500).send(e.message);
    }

    await registerUser(full_name, email, gender, hashed_password, account_type)
      .then((user) => {
        logger.info("User " + user.id + " Created");
        return res
          .status(201)
          .json({ message: "Account created successfully", user: user });
      })
      .catch((error) => {
        return res
          .status(500)
          .send({ message: "Error Creating User", error: error.message });
      });
  } else {
    return res.status(400).send({ error: "Account with email already exists" });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  await loginUser(email, password)
    .then((user) => {
      logger.info("User " + user.id + " Logged In");
      res
        .status(200)
        .json({ message: "Account logged in successfully", user: user });
    })
    .catch((err) => {
      return res.status(500).send({ error: err.message });
    });
});

export { login, signup };
