import { calculateWinners, getOnchainLottery } from "./lottery-crypto";

export enum LotteryState {
    InProgress = "inprogress",
    Ending = "ending",
    Ended = "ended"
}

export interface Lottery {
    id: bigint;
    name: string;
    description: string;
    expiration: Date;
    totalTickets: bigint;
    value: bigint;
    receiver: string;
    state: LotteryState;
    vrfRequestId: bigint;
}

export interface TicketHolder {
    envioId: string;
    onchainId: bigint;
    address: string;
    amount: bigint;
}

export interface Winner {
    envioId: string;
    onchainId: bigint;
    address: string;
    value: bigint;
}

export async function getLottery(lotteryId: bigint): Promise<Lottery | undefined> {
    return (await queryLotteries(`limit: 100, where: {id: {_eq: "${lotteryId.toString()}"}}`))?.[0];
}

export async function getLotteries(): Promise<Lottery[]> {
    return await queryLotteries(`limit: 100`);
}

export async function getReceiversLotteries(receiver: string): Promise<Lottery[]> {
    return await queryLotteries(`limit: 100, where: {receiver: {_eq: "${receiver}"}}`);
}

export async function getTicketHolder(lotteryId: bigint, address: string): Promise<TicketHolder | undefined> {
    return (await queryTicketHolders(
        `where: {lottery_id: {_eq: "${lotteryId.toString()}"}, address: {_eq: "${address}"}}`
    ))?.[0];
}

export async function getTicketHolders(lotteryId: bigint): Promise<TicketHolder[]> {
    return await queryTicketHolders(`where: {lottery_id: {_eq: "${lotteryId.toString()}"}}`);
}

export async function getWinners(lottery: Lottery, ticketHolders: TicketHolder[]): Promise<Winner[]> {
    return await queryWinners(lottery, ticketHolders, `where: {lottery_id: {_eq: "${lottery.id}"}}`);
}

async function queryLotteries(query: string): Promise<Lottery[]> {
    try {
        const data = await fetchIndexerData(`{
            Lottery(${query}) {
                id
                name
                receiver
                state
                totalTickets
                value
                description
                expiration
                vrfRequestId
            }
        }`);

        if (!data) {
            return [];
        }

        const lotteries: any[] = data.Lottery;

        return lotteries.map((lottery) => parseLottery(lottery));
    } catch (error) {
        console.log(error);
    }

    return [];
}

async function queryTicketHolders(query: string): Promise<TicketHolder[]> {
    const data = await fetchIndexerData(`{
        TicketHolder(${query}) {
            id
            address
            amount
        }
    }`);

    if (!data) {
        return [];
    }

    try {
        const ticketHolders: any[] = data.TicketHolder;
        return ticketHolders.map((ticketHolder) => parseTicketHolder(ticketHolder));
    } catch (error) {
        console.log(error);
    }

    return [];
}

async function queryWinners(lottery: Lottery, ticketHolders: TicketHolder[], query: string): Promise<Winner[]> {
    if (lottery.state === LotteryState.Ending && lottery.vrfRequestId !== 0n) {
        try {
            return (await calculateWinners(lottery, ticketHolders));
        } catch (error) {
            console.log(error);
        }
    }

    if (lottery.state === LotteryState.Ended) {
        try {
            const data = await fetchIndexerData(`{
                Winner(${query}) {
                    id
                    address
                    value
                }
            }`);
            if(!data) {
                return [];
            }

            const winners: any[] = data.Winner;
            return winners.map((winner) => parseWinner(winner));
        } catch (error) {
            console.log(error);
        }
    }

    return [];
}

async function fetchIndexerData(query: string) {
    try {
        const res = await fetch("https://indexer.bigdevenergy.link/a2afc41/v1/graphql", {
            method: "POST",
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
            }),
        });

        if (!res.ok) {
            return undefined;
        }

        return (await res.json()).data;
    } catch (error) {
        console.log(error);
    }

    return undefined;
}

function parseLottery(lottery: any): Lottery {
    return {
        id: BigInt(lottery.id),
        name: lottery.name,
        description: lottery.description,
        expiration: new Date(Number(lottery.expiration) * 1000),
        totalTickets: BigInt(lottery.totalTickets),
        value: BigInt(lottery.value),
        receiver: lottery.receiver,
        state: lottery.state as LotteryState,
        vrfRequestId: BigInt(lottery.vrfRequestId)
    };
}

function parseTicketHolder(ticketHolder: any): TicketHolder {
    return {
        envioId: ticketHolder.id,
        onchainId: parseOnchainId(ticketHolder.id),
        address: ticketHolder.address,
        amount: BigInt(ticketHolder.amount)
    };
}

function parseWinner(winner: any): Winner {
    return {
        envioId: winner.id,
        onchainId: parseOnchainId(winner.id),
        address: winner.address,
        value: BigInt(winner.value)
    };
}

function parseOnchainId(envioId: string): bigint {
    return BigInt(envioId.split("0x")[0]);
}