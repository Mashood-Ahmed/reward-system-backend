import asyncHandler from "express-async-handler";
import { User } from "../User/User.js";
import {
  get_transaction_by_id,
  get_transactions_by_user,
  create_transaction,
} from "./services.js";

const getTransactionsByUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await get_transactions_by_user(user.id)
      .then((transaction) => {
        res.json(transaction);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid User Id. User not found.");
  }
});

const getTransactionById = asyncHandler(async (req, res) => {
  await get_transaction_by_id(req.params.id)
    .then((transaction) => {
      res.json(transaction);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

const createTransaction = asyncHandler(async (req, res) => {
  const { amount, ttype, reciever_id } = req.body;

  const reciever = await User.findByPk(reciever_id);
  if (reciever) {
    await create_transaction(amount, ttype, reciever_id, req.user.id)
      .then((transaction) => {
        res.json(transaction);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  } else {
    res.status(404).json("Invalid User Id. User not found.");
  }
});

export { getTransactionById, getTransactionsByUser, createTransaction };
