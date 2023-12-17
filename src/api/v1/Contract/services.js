import { Contract } from "./Contract.js";
import { NOW } from "sequelize";

const getContractById = async (contract_id) => {
  const contract = await Contract.findByPk(contract_id);
  return contract;
};

const openSmartContract = async (task_id, address) => {
  const contract = await Contract.create({
    address: address,
    task_id: task_id,
  });

  return contract;
};

const closeSmartContract = async (contract_id, status) => {
  const contract = await Contract.update(
    {
      closed_at: NOW(),
      status: status,
    },
    { where: { id: contract_id }, returning: true, plain: true }
  );

  return contract;
};

export { getContractById, openSmartContract, closeSmartContract };
