import { findWinners, getOnchainLottery, winnersPercentage, winnersPercentages } from "./lottery-crypto";

export enum LotteryState {
    InProgress = "inprogress",
    Ending = "ending",
    Ended = "ended"
}

export interface Lottery {
    envioId: string;
    onchainId: bigint;
    name: string;
    description: string;
    expiration: Date;
    totalTickets: bigint;
    value: bigint;
    receiver: string;
    state: LotteryState;
    vrfRequestId: bigint;
}

export interface Ticket {
    envioId: string;
    onchainId: bigint;
    address: string;
    amount: bigint;
}

export interface TicketHolder {
    envioId: string;
    address: string;
    amount: bigint;
}

export interface Winner {
    envioId: string;
    address: string;
    value: bigint;
}

export async function getLottery(onchainId: bigint): Promise<Lottery | undefined> {
    return (await queryLotteries(`limit: 100, where: {onchainId: {_eq: "${onchainId}"}}`))?.[0];
}

export async function getLotteries(): Promise<Lottery[]> {
    return await queryLotteries(`limit: 100`);
}

export async function getReceiversLotteries(receiver: string): Promise<Lottery[]> {
    return await queryLotteries(`limit: 100, where: {receiver: {_eq: "${receiver}"}}`);
}

export async function getTicketHolder(envioId: string, address: string): Promise<TicketHolder | undefined> {
    return (await queryTicketHolders(
        `where: {lottery_id: {_eq: "${envioId}"}, address: {_eq: "${address}"}}`
    ))?.[0];
}

export async function getTickets(envioId: string): Promise<Ticket[]> {
    return await queryTickets(`where: {lottery_id: {_eq: "${envioId}"}}`);
}

export async function getTicketHolders(envioId: string): Promise<TicketHolder[]> {
    return await queryTicketHolders(`where: {lottery_id: {_eq: "${envioId}"}}`);
}

export async function getWinners(lottery: Lottery, tickets: Ticket[]): Promise<Winner[]> {
    return await queryWinners(lottery, tickets, `where: {lottery_id: {_eq: "${lottery.envioId}"}}`);
}

async function queryLotteries(query: string): Promise<Lottery[]> {
    try {
        const data = await fetchIndexerData(`{
            Lottery(${query}) {
                id
                onchainId
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

async function queryTickets(query: string): Promise<Ticket[]> {
    const data = await fetchIndexerData(`{
        Ticket(${query}) {
            id
            onchainId
            address
            amount
        }
    }`);

    if (!data) {
        return [];
    }

    try {
        const tickets: any[] = data.Ticket;
        return tickets.map((ticket) => parseTicket(ticket));
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

async function queryWinners(lottery: Lottery, tickets: Ticket[], query: string): Promise<Winner[]> {
    if (lottery.state === LotteryState.Ending && lottery.vrfRequestId !== 0n) {
        try {
            const winningTickets = await findWinners(lottery, tickets);
            const winnersValue = (Number(lottery.value) / 100) * winnersPercentage;

            return winningTickets.map((ticket, index) => { return {
                envioId: "",
                address: ticket.address,
                value: BigInt(Math.trunc((winnersValue / 100) * winnersPercentages[index]))
            }});
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
        envioId: lottery.id,
        onchainId: BigInt(lottery.onchainId),
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

function parseTicket(ticket: any): Ticket {
    return {
        envioId: ticket.id,
        onchainId: BigInt(ticket.onchainId),
        address: ticket.address,
        amount: BigInt(ticket.amount)
    };
}

function parseTicketHolder(ticketHolder: any): TicketHolder {
    return {
        envioId: ticketHolder.id,
        address: ticketHolder.address,
        amount: BigInt(ticketHolder.amount)
    };
}

function parseWinner(winner: any): Winner {
    return {
        envioId: winner.id,
        address: winner.address,
        value: BigInt(winner.value)
    };
}