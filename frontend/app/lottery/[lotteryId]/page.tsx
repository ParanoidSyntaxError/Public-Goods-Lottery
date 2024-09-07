import BuyCard from "@/components/buy-card";
import DurationTag from "@/components/duration-text-";
import TicketTable from "@/components/ticket-table";
import UserLink from "@/components/user-link";
import { getLottery, getTicketHolders } from "@/lib/lottery-indexer";
import { shortenAddress } from "@/lib/utils";
import { web3Auth, web3AuthOptions } from "@/lib/web3AuthProviderProps";
import { Web3AuthProvider } from "@web3auth/modal-react-hooks";
import { formatUnits } from "ethers";

export default async function LotteryPage({
    params: { lotteryId }
}: { params: { lotteryId: string } }) {
    const lottery = await getLottery(lotteryId);
    const ticketHolders = await getTicketHolders(lotteryId);

    if (!lottery) {
        return (
            <div>
                Lottery not found
            </div>
        )
    }

    const shortReceiver = shortenAddress(lottery.receiver);
    const ethValue = formatUnits(lottery.value);

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
                        label={shortReceiver}
                        slug={lottery.receiver}
                        className="text-xl"
                    />
                    <div
                        className="flex flex-row items-center space-x-6"
                    >
                        <div
                            className="text-4xl"
                        >
                            {ethValue} ETH
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
                <TicketTable
                    className="w-full"
                    lottery={lottery}
                    tickets={ticketHolders}
                />
                <BuyCard
                    className="min-w-72 h-fit"
                    lotteryId={lottery.id}
                    totalTickets={lottery.totalTickets}
                />
            </div>
        </div>
    );
}