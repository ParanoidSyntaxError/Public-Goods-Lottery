/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
    PublicGoodsLottery,
    Lottery,
} from "generated";

function ticketHolderId(lotteryId: string, address: string): string {
    return lotteryId + address + "ticketHolder";
}

function winnerId(lotteryId: string, address: string, index: string): string {
    return lotteryId + address + "winner" + index;
}

PublicGoodsLottery.LotteryCreated.handler(async ({ event, context }) => {
    const lottery: Lottery = {
        id: event.params.lotteryId.toString(),
        expiration: event.params.expiration,
        receiver: event.params.receiver,
        totalTickets: 0n,
        complete: false
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

    context.TicketHolder.set({
        id: holderId,
        lottery_id: lottery.id,
        address: event.params.receiver,
        amount: ticketHolderAmount
    });

    context.Lottery.set({
        id: lottery.id,
        expiration: lottery.expiration,
        receiver: lottery.receiver,
        totalTickets: lottery.totalTickets + event.params.amount,
        complete: false,
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
        expiration: lottery.expiration,
        receiver: lottery.receiver,
        totalTickets: lottery.totalTickets,
        complete: true,
    });
});