const Web3 = require('web3')

// Configure web3 to connect to the Sepolia testnet
const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/0PehriR-bczOTDONtVmXdZmZP4cXn7mt'); // Replace with the actual Sepolia testnet URL

// ABI and contract address of your Ethereum smart contract
const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "payer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "userId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "transactionId",
          "type": "string"
        }
      ],
      "name": "PaymentRecorded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_transactionId",
          "type": "string"
        }
      ],
      "name": "getPaymentDetails",
      "outputs": [
        {
          "internalType": "address",
          "name": "payer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "userId",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "payments",
      "outputs": [
        {
          "internalType": "address",
          "name": "payer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "userId",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_payer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_transactionId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_userId",
          "type": "string"
        }
      ],
      "name": "recordPayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

const contractAddress = '0xA770A5d43E169e5f52f0308615F4BA078aD6Ab3d';

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

const recordPayment = async (payer,amount,description,transactionId) => {
    const result = await contract.methods.recordPayment(
        payer,
        amount,
        description,
        transactionId
      ).send({
        from: '0xb205B60aae2361d479CE6EF4b33acEbD50748819', // Replace with your wallet address
        gas: 2000000 // Adjust gas limit as needed
      });

      return result
}