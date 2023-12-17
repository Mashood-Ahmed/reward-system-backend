import asyncHandler from "express-async-handler";
import { get_wallet_by_id, get_wallet_by_user } from "./services.js";

const getWalletByUser = asyncHandler(async (req, res) => {
  await get_wallet_by_user(req.user.id)
    .then((wallet) => {
      res.json(wallet);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

const getWalletById = asyncHandler(async (req, res) => {
  await get_wallet_by_id(req.params.id)
    .then((wallet) => {
      res.json(wallet);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

export { getWalletById, getWalletByUser };
