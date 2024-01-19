import { Wallet, ethers, Contract } from "ethers";
import dotenv from "dotenv";
dotenv.config();

import abi from "../web3/contract_abi.js"

const { WEB3_KEY } = process.env;

async function recordPayment(amount, task_id, transaction_id, user_id) {
    const provider = new ethers.WebSocketProvider('wss://eth-sepolia.g.alchemy.com/v2/0PehriR-bczOTDONtVmXdZmZP4cXn7mt');
    
    const contractAddress = "0xa4dc3E9f536E254bf0b63df536C3a60572297660";
    
    let wallet = new Wallet(WEB3_KEY, provider);

    const paymentContract = new Contract(contractAddress, abi, wallet);

    const tx = await paymentContract.recordPayment("0x1234567890123456789012345678901234567890", amount, task_id, transaction_id, user_id);

    const txReceipt = await tx.wait();

    // Transaction mined successfully
    return txReceipt.transactionHash;


   }

export default recordPayment