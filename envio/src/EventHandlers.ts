/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
    PublicGoodsLottery,
    Lottery,
} from "generated";

enum LotteryState {
    InProgress = "inprogress",
    Ending = "ending",
    Ended = "ended"
}

function ticketId(lotteryId: string, ticketId: string): string {
    return lotteryId + "-" + ticketId + "-ticket";
}

function ticketHolderId(lotteryId: string, address: string): string {
    return lotteryId + "-" + address + "-ticketHolder";
}

function winnerId(lotteryId: string, address: string, index: string): string {
    return lotteryId + "-" + address + "-" + index + "-winner";
}

PublicGoodsLottery.LotteryCreated.handler(async ({ event, context }) => {
    const lottery: Lottery = {
        id: event.params.lotteryId.toString(),
        onchainId: event.params.lotteryId,
        name: event.params.name,
        description: event.params.description,
        expiration: event.params.expiration,
        receiver: event.params.receiver,
        totalTickets: 0n,
        value: 0n,
        state: LotteryState.InProgress,
        vrfRequestId: 0n
    };

    context.Lottery.set(lottery);
});

PublicGoodsLottery.TicketPurchased.handler(async ({ event, context }) => {
    const lottery = await context.Lottery.get(event.params.lotteryId.toString());
    if (!lottery) {
        return;
    }

    const holderId = ticketHolderId(event.params.lotteryId.toString(), event.params.receiver);

    let ticketHolder = await context.TicketHolder.get(holderId);

    let ticketHolderAmount = event.params.amount;
    if (ticketHolder) {
        ticketHolderAmount += ticketHolder.amount;
    }

    context.Ticket.set({
        id: ticketId(lottery.id, event.params.ticketId.toString()),
        onchainId: event.params.ticketId,
        lottery_id: lottery.id,
        address: event.params.receiver,
        amount: event.params.amount
    });  

    context.TicketHolder.set({
        id: holderId,
        lottery_id: lottery.id,
        address: event.params.receiver,
        amount: ticketHolderAmount
    });

    context.Lottery.set({
        id: lottery.id,
        onchainId: lottery.onchainId,
        name: lottery.name,
        description: lottery.description,
        expiration: lottery.expiration,
        receiver: lottery.receiver,
        totalTickets: lottery.totalTickets + event.params.amount,
        value: lottery.value + event.params.value,
        state: lottery.state,
        vrfRequestId: 0n
    });
});

PublicGoodsLottery.LotteryEndRequested.handler(async ({ event, context }) => {
    const lottery = await context.Lottery.get(event.params.lotteryId.toString());
    if (!lottery) {
        return;
    }

    context.Lottery.set({
        id: lottery.id,
        onchainId: lottery.onchainId,
        name: lottery.name,
        description: lottery.description,
        expiration: lottery.expiration,
        receiver: lottery.receiver,
        totalTickets: lottery.totalTickets,
        value: lottery.value,
        state: LotteryState.Ending,
        vrfRequestId: event.params.vrfRequestId
    });
});

PublicGoodsLottery.LotteryEnded.handler(async ({ event, context }) => {
    const lottery = await context.Lottery.get(event.params.lotteryId.toString());
    if (!lottery) {
        return;
    }

    event.params.winners.forEach((winnerAddress, index) => context.Winner.set({
        id: winnerId(lottery.id, winnerAddress, index.toString()),
        lottery_id: lottery.id,
        address: winnerAddress,
        value: event.params.winnersValues[index]
    }));

    context.Lottery.set({
        id: lottery.id,
        onchainId: lottery.onchainId,
        name: lottery.name,
        description: lottery.description,
        expiration: lottery.expiration,
        receiver: lottery.receiver,
        totalTickets: lottery.totalTickets,
        value: lottery.value,
        state: LotteryState.Ended,
        vrfRequestId: lottery.vrfRequestId
    });
});