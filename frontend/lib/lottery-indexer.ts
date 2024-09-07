export enum LotteryState {
    InProgress = "inprogress",
    Ending = "ending",
    Ended = "ended"
}

export interface Lottery {
    id: string;
    name: string;
    description: string;
    expiration: Date;
    totalTickets: bigint;
    value: bigint;
    receiver: string;
    state: LotteryState;
}

export interface TicketHolder {
    id: string;
    address: string;
    amount: bigint;
}

export async function getLottery(id: string): Promise<Lottery | undefined> {
    return (await queryLotteries(`{
        Lottery(limit: 100, where: {id: {_eq: "${id}"}}) {
            id
            name
            receiver
            state
            totalTickets
            value
            description
            expiration
        }
    }`))?.[0];
}

export async function getLotteries(): Promise<Lottery[]> {
    return await queryLotteries(`{
        Lottery(limit: 100) {
            id
            name
            receiver
            state
            totalTickets
            value
            description
            expiration
        }
    }`);
}

export async function getReceiversLotteries(receiver: string): Promise<Lottery[]> {
    return await queryLotteries(`{
        Lottery(limit: 100, where: {receiver: {_eq: "${receiver}"}}) {
            id
            name
            receiver
            state
            totalTickets
            value
            description
            expiration
        }
    }`);
}

export async function getTicketHolder(lotteryId: string, address: string): Promise<TicketHolder | undefined> {
    return (await queryTicketHolders(`{
        TicketHolder(where: {lottery_id: {_eq: "${lotteryId}"}, address: {_eq: "${address}"}}) {
            id    
            address
            amount
        }
    }`))?.[0];
}

export async function getTicketHolders(lotteryId: string): Promise<TicketHolder[]> {
    return await queryTicketHolders(`{
        TicketHolder(where: {lottery_id: {_eq: "${lotteryId}"}}) {
            id    
            address
            amount
        }
    }`);
}

async function queryLotteries(query: string): Promise<Lottery[]> {
    const data = await fetchIndexerData(query);

    if (!data) {
        return [];
    }

    try {
        const lotteries: any[] = data.Lottery;

        return lotteries.map((lottery) => parseLottery(lottery));
    } catch (error) {
        console.log(error);
    }

    return [];
}

async function queryTicketHolders(query: string): Promise<TicketHolder[]> {
    const data = await fetchIndexerData(query);

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

async function fetchIndexerData(query: string) {
    try {
        const res = await fetch("https://indexer.bigdevenergy.link/a2afc41/v1/graphql", {
            method: "POST",
            cache: "no-store",
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
        id: lottery.id,
        name: lottery.name,
        description: lottery.description,
        expiration: new Date(Number(lottery.expiration)),
        totalTickets: BigInt(lottery.totalTickets),
        value: BigInt(lottery.value),
        receiver: lottery.receiver,
        state: lottery.state as LotteryState
    };
}

function parseTicketHolder(ticketHolder: any): TicketHolder {
    return {
        id: ticketHolder.id,
        address: ticketHolder.address,
        amount: BigInt(ticketHolder.amount)
    };
}