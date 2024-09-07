import { IProvider } from "@web3auth/base";
import { BrowserProvider, Contract } from "ethers";

const pglAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "vrfWrapper",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [

        ],
        "name": "FailedCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "InsufficientValue",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "expiration",
                "type": "uint256"
            }
        ],
        "name": "InvalidExpiration",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "msgSender",
                "type": "address"
            }
        ],
        "name": "InvalidOnTokenTransferMsgSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lowerId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "upperId",
                "type": "uint256"
            }
        ],
        "name": "InvalidTicketIds",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "requestId",
                "type": "uint256"
            }
        ],
        "name": "LotteryEndAlreadyRequested",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            }
        ],
        "name": "LotteryHasEnded",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            }
        ],
        "name": "LotteryInProgress",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "requestId",
                "type": "uint256"
            }
        ],
        "name": "LotteryVRFUnfulfilled",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            }
        ],
        "name": "NonexistentLottery",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "have",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "want",
                "type": "address"
            }
        ],
        "name": "OnlyVRFWrapperCanFulfill",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "expiration",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "LotteryCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vrfRequestId",
                "type": "uint256"
            }
        ],
        "name": "LotteryEndRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address[]",
                "name": "winners",
                "type": "address[]"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "winnersValues",
                "type": "uint256[]"
            }
        ],
        "name": "LotteryEnded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "ticketId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "receiver",
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
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "TicketPurchased",
        "type": "event"
    },
    {
        "inputs": [

        ],
        "name": "PG_PERCENTAGE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "TICKET_DECIMALS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "VRF_CALLBACK_GAS_LIMIT",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "VRF_REQUEST_CONFIRMATIONS",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "WINNERS_PERCENTAGE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "WINNERS_PERCENTAGES",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "buyTicket",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "ticketId",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "expiration",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "createLottery",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "lowerTicketIds",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "upperTicketIds",
                "type": "uint256[]"
            }
        ],
        "name": "fulfillEndLottery",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "getLinkToken",
        "outputs": [
            {
                "internalType": "contract LinkTokenInterface",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "i_vrfV2PlusWrapper",
        "outputs": [
            {
                "internalType": "contract IVRFV2PlusWrapper",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "onTokenTransfer",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_requestId",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "_randomWords",
                "type": "uint256[]"
            }
        ],
        "name": "rawFulfillRandomWords",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            }
        ],
        "name": "requestEndLottery",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const pglAddress = "0x19C1C374fDB513DA78CdE1202FBf2B0c56c5cdDc";

export const ticketPrice = 1000000000000000n;

export async function getAddress(provider: IProvider): Promise<string | undefined> {
    try {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        return await signer.getAddress();
    } catch (error) {
        console.log(error);
    }

    return undefined;
}

export async function createLottery(provider: IProvider, name: string, description: string, expiration: Date, receiver: string) {
    try {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();    
        
        const pglContract = new Contract(pglAddress, pglAbi, signer);

        const tx = await pglContract.createLottery(name, description, expiration.getTime(), receiver);
        console.log(tx);
    } catch (error) {
        console.log(error);
    }
}

export async function buyTickets(provider: IProvider, lotteryId: string, value: bigint) {
    try {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();    
        
        const pglContract = new Contract(pglAddress, pglAbi, signer);

        const receiver = await signer.getAddress();

        const tx = await pglContract.buyTicket(lotteryId, receiver, {
            value: value
        });
        console.log(tx);
    } catch (error) {
        console.log(error);
    }
}