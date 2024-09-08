import BuyCard from "@/components/buy-card";
import DurationTag from "@/components/duration-text-";
import EndCard from "@/components/end-card";
import TicketTable from "@/components/ticket-table";
import UserLink from "@/components/user-link";
import WinnersTable from "@/components/winners-table";
import { findWinners } from "@/lib/lottery-crypto";
import { getLottery, getTicketHolders, getTickets, getWinners } from "@/lib/lottery-indexer";
import { shortenAddress } from "@/lib/utils";
import { formatUnits } from "ethers";

export default async function LotteryPage({
    params: { lotteryId }
}: { params: { lotteryId: string } }) {
    const lottery = await getLottery(BigInt(lotteryId));

    if (!lottery) {
        return (
            <div
                className="text-3xl text-center"
            >
                Lottery not found
            </div>
        )
    }

    const ticketHolders = await getTicketHolders(lottery.envioId);
    const tickets = await getTickets(lottery.envioId);
    const winningTickets = await findWinners(lottery, tickets);
    const winners = await getWinners(lottery, tickets);

    return (
        <div
            className="space-y-16"
        >
            <div
                className="flex flex-col mx-auto space-y-8"
            >
                <div
                    className="space-y-4"
                >
                    <div
                        className="text-4xl font-bold"
                    >
                        {lottery.name}
                    </div>
                    <UserLink
                        label={shortenAddress(lottery.receiver)}
                        slug={lottery.receiver}
                        className="text-xl"
                    />
                    <div
                        className="flex flex-row items-center space-x-6"
                    >
                        <div
                            className="text-4xl"
                        >
                            {formatUnits(lottery.value)} ETH
                        </div>
                        <DurationTag
                            className="h-fit"
                            expiration={lottery.expiration}
                        />
                    </div>
                </div>
                <div
                    className="text-lg"
                >
                    {lottery.description}
                </div>
            </div>
            <div
                className="flex flex-row justify-between mx-auto space-x-4"
            >
                <div
                    className="w-full space-y-8"
                >
                    {winners.length > 0 &&
                        <WinnersTable
                            className="w-full"
                            lottery={lottery}
                            winners={winners}
                        />
                    }
                    <TicketTable
                        className="w-full"
                        lottery={lottery}
                        ticketHolders={ticketHolders}
                    />
                </div>
                {lottery.expiration.getTime() > Date.now() ?
                    <BuyCard
                        className="min-w-72 h-fit"
                        lottery={lottery}
                    /> :
                    <EndCard
                        className="min-w-72 h-fit"
                        lottery={lottery}
                        winningTickets={winningTickets}
                    />
                }
            </div>
        </div>
    );
}