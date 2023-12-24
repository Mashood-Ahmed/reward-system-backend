import asyncHandler from "express-async-handler";

import bcrypt from "bcryptjs";
import generateToken from "../../../utils/generateToken.js";

import { User } from "../User/User.js";
import { Wallet } from "../Wallet/Wallet.js";

const registerUser = async (
  full_name,
  email,
  gender,
  password,
  account_type
) => {
  try {
    const user = await User.create({
      full_name,
      email,
      gender,
      password,
      account_type,
    });

    const wallet = await Wallet.create({ user_id: user.id });

    var userInfo = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      gender: user.gender,
      password: user.password,
      profile_picture: user.profile_picture_url,
      account_type: user.account_type,
      wallet: wallet,
      token: generateToken(user.id),
    };
    return userInfo;
  } catch (error) {}
};

const loginUser = asyncHandler(async (email, password) => {
  const user = await User.findOne({ where: { email } });
  //console.log(user);

  if (user) {
    const validatePassword = await bcrypt.compare(password, user.password);
    if (validatePassword) {
      const userInfo = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        profile_picture: user.profile_picture_url,
        account_type: user.account_type,
        token: generateToken(user.id),
      };
      return userInfo;
    } else {
      throw Error("Invalid password");
    }
  } else {
    throw Error("Invalid email");
  }
});

export { registerUser, loginUser };
