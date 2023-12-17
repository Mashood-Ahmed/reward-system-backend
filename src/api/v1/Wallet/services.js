import { Wallet } from "./Wallet.js";

const get_wallet_by_id = async (wallet_id) => {
  const wallet = await Wallet.findByPk(wallet_id);
  return wallet;
};

const get_wallet_by_user = async (user_id) => {
  const wallet = await Wallet.findOne({ where: { user_id: user_id } });
  return wallet;
};

const update_wallet_by_user = async (amount, type, user_id) => {
  var updatedWallet;
  if (type == "Debit") {
    updatedWallet = await Wallet.increment("balance", {
      by: amount,
      where: { user_id: user_id },
    });
  } else {
    updatedWallet = await Wallet.decrement("balance", {
      by: amount,
      where: { user_id: user_id },
    });
  }

  return updatedWallet;
};

export { get_wallet_by_id, get_wallet_by_user, update_wallet_by_user };
