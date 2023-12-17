import { Op } from "sequelize";
import { Transaction } from "./Transaction.js";
import { User } from "../User/User.js";
import { update_wallet_by_user } from "../Wallet/services.js";

const get_transaction_by_id = async (transaction_id) => {
  const transaction = await Transaction.findByPk(transaction_id);
  return transaction;
};

const get_transactions_by_user = async (user_id) => {
  const transaction = await Transaction.findAll({
    where: { [Op.or]: { sender_id: user_id, reciever_id: user_id } },
  });
  return transaction;
};

const create_transaction = async (amount, ttype, reciever_id, sender_id) => {
  try {
    const transaction = await Transaction.create({
      amount,
      ttype,
      reciever_id,
      sender_id,
    });
    const reciever_wallet = await update_wallet_by_user(
      amount,
      "Debit",
      reciever_id
    );
    const sender_wallet = await update_wallet_by_user(
      amount,
      "Credit",
      sender_id
    );

    return {
      transaction: transaction,
      sender: sender_wallet,
      reciever: reciever_wallet,
    };
  } catch (error) {
    return error;
  }
};

export { get_transaction_by_id, get_transactions_by_user, create_transaction };
