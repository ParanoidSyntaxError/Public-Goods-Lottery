import { IProvider } from "@web3auth/base";
import { AbiCoder, BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import { Lottery, TicketHolder, Winner } from "./lottery-indexer";

export interface OnchainLottery {
    expiration: bigint;
    receiver: string;
    totalTickets: bigint;
    vrfRequestId: bigint;
    vrfResponses: bigint[];
}

const chainlinkTokenAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "uint256", "name": "supplyAfterMint", "type": "uint256" }], "name": "MaxSupplyExceeded", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "SenderNotBurner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "SenderNotMinter", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "burner", "type": "address" }], "name": "BurnAccessGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "burner", "type": "address" }], "name": "BurnAccessRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "minter", "type": "address" }], "name": "MintAccessGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "minter", "type": "address" }], "name": "MintAccessRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferRequested", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "acceptOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getBurners", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getMinters", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "burner", "type": "address" }], "name": "grantBurnRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "burnAndMinter", "type": "address" }], "name": "grantMintAndBurnRoles", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "minter", "type": "address" }], "name": "grantMintRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "burner", "type": "address" }], "name": "isBurner", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "minter", "type": "address" }], "name": "isMinter", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "burner", "type": "address" }], "name": "revokeBurnRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "minter", "type": "address" }], "name": "revokeMintRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "transferAndCall", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

const pglAbi = [{"inputs":[{"internalType":"address","name":"vrfWrapper","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FailedCall","type":"error"},{"inputs":[{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"InsufficientBalance","type":"error"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"InsufficientValue","type":"error"},{"inputs":[{"internalType":"uint256","name":"expiration","type":"uint256"}],"name":"InvalidExpiration","type":"error"},{"inputs":[{"internalType":"address","name":"msgSender","type":"address"}],"name":"InvalidOnTokenTransferMsgSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"ticketId","type":"uint256"}],"name":"InvalidTicketId","type":"error"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"},{"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"LotteryEndAlreadyRequested","type":"error"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"}],"name":"LotteryHasEnded","type":"error"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"}],"name":"LotteryInProgress","type":"error"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"},{"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"LotteryVRFUnfulfilled","type":"error"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"}],"name":"NonexistentLottery","type":"error"},{"inputs":[{"internalType":"address","name":"have","type":"address"},{"internalType":"address","name":"want","type":"address"}],"name":"OnlyVRFWrapperCanFulfill","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"lotteryId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":true,"internalType":"uint256","name":"expiration","type":"uint256"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"}],"name":"LotteryCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"lotteryId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"vrfRequestId","type":"uint256"}],"name":"LotteryEndRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"lotteryId","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"winners","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"winnersValues","type":"uint256[]"}],"name":"LotteryEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"lotteryId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"ticketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TicketPurchased","type":"event"},{"inputs":[],"name":"PG_PERCENTAGE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TICKET_DECIMALS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VRF_CALLBACK_GAS_LIMIT","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VRF_REQUEST_CONFIRMATIONS","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WINNERS_PERCENTAGE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"WINNERS_PERCENTAGES","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"buyTicket","outputs":[{"internalType":"uint256","name":"ticketId","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"expiration","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"createLottery","outputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"},{"internalType":"uint256[]","name":"ticketIds","type":"uint256[]"}],"name":"fulfillEndLottery","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLinkToken","outputs":[{"internalType":"contract LinkTokenInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"i_vrfV2PlusWrapper","outputs":[{"internalType":"contract IVRFV2PlusWrapper","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"}],"name":"lottery","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"onTokenTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_requestId","type":"uint256"},{"internalType":"uint256[]","name":"_randomWords","type":"uint256[]"}],"name":"rawFulfillRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lotteryId","type":"uint256"}],"name":"requestEndLottery","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalLotteries","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

const chainlinkTokenAddress = "0xE4aB69C077896252FAFBD49EFD26B5D171A32410";
const pglAddress = "0xfFB4913877eCEc0aDf4a467D67B926809577F411";

export const ticketPrice = 1000000000000000n;

const winnersPercentage = 30;
const winnersPercentages = [60, 30, 10];

export async function getAddress(provider: IProvider): Promise<string | undefined> {
    try {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        return (await signer.getAddress());
    } catch (error) {
        console.log(error);
    }

    return undefined;
}

export async function getOnchainLottery(lotteryId: bigint): Promise<OnchainLottery | undefined> {
    try {
        const provider = new JsonRpcProvider("https://sepolia.base.org/");

        const pglContract = new Contract(pglAddress, pglAbi, provider);

        const data = await pglContract.lottery(lotteryId);

        return {
            expiration: data[0],
            receiver: data[1],
            totalTickets: data[2],
            vrfRequestId: data[3],
            vrfResponses: data[4],
        };
    } catch (error) {
        console.log(error);
    }

    return undefined;
}

export async function calculateWinners(lottery: Lottery, ticketHolders: TicketHolder[]): Promise<Winner[]> {
    try {
        const onchainLottery = await getOnchainLottery(lottery.id);
        if (!onchainLottery) {
            return [];
        }

        ticketHolders = ticketHolders.sort((a, b) => {
            if (a.onchainId < b.onchainId) return -1;
            if (a.onchainId > b.onchainId) return 1;
            return 0;
        });

        const winnersValue = (Number(lottery.value) / 100) * winnersPercentage;
        const winners: Winner[] = [];
        onchainLottery.vrfResponses.forEach((vrfResponse, vrfIndex) => {
            const winningTicket = vrfResponse % lottery.totalTickets;

            let ticketCount = 0n;
            for (let i = 0; i < ticketHolders.length; i++) {
                ticketCount += ticketHolders[i].amount;

                if (ticketCount > winningTicket) {
                    winners.push({
                        envioId: ticketHolders[i].envioId,
                        onchainId: ticketHolders[i].onchainId,
                        address: ticketHolders[i].address,
                        value: BigInt(Math.trunc((winnersValue / 100) * winnersPercentages[vrfIndex]))
                    });
                    break;
                }
            }
        });

        return winners;
    } catch (error) {
        console.log(error);
    }

    return [];
}

export async function createLottery(provider: IProvider, name: string, description: string, expiration: Date, receiver: string) {
    try {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const pglContract = new Contract(pglAddress, pglAbi, signer);

        const tx = await pglContract.createLottery(name, description, BigInt(Math.trunc(expiration.getTime() / 1000)), receiver);
    } catch (error) {
        console.log(error);
    }
}

export async function buyTickets(provider: IProvider, lotteryId: bigint, value: bigint) {
    try {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const pglContract = new Contract(pglAddress, pglAbi, signer);

        const receiver = await signer.getAddress();

        const tx = await pglContract.buyTicket(lotteryId, receiver, {
            value: value
        });
    } catch (error) {
        console.log(error);
    }
}

export async function requestEndLottery(provider: IProvider, lotteryId: bigint) {
    try {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const chainlinkTokenContract = new Contract(chainlinkTokenAddress, chainlinkTokenAbi, signer);

        const abiCoder = new AbiCoder();
        const calldata = abiCoder.encode(["uint256"], [lotteryId]);

        const tx = await chainlinkTokenContract.transferAndCall(pglAddress, 1000000000000000000n, calldata);
    } catch (error) {
        console.log(error);
    }
}

export async function fulfillEndLottery(provider: IProvider, lotteryId: bigint, ticketIds: bigint[]) {
    try {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const pglContract = new Contract(pglAddress, pglAbi, signer);

        const tx = await pglContract.fulfillEndLottery(lotteryId, ticketIds);
    } catch (error) {
        console.log(error);
    }
}