import BuyCard from "@/components/buy-card";
import LotteryCard from "@/components/lottery-card";
import TicketList from "@/components/ticket-list";

export default function Explore() {
    return (
        <div
            className="space-y-8"
        >
            <TicketList
                tickets={[
                    {
                        holder: "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88",
                        network: "ETH",
                        amount: 100
                    },
                    {
                        holder: "0xade2770ad5ab78c4cbd306d2b33d475d780e3394",
                        network: "ETH",
                        amount: 77
                    },
                    {
                        holder: "0x966d35960c00c20c1911bf2692c278267add139d",
                        network: "ETH",
                        amount: 5
                    }
                ]}
            />
            <LotteryCard
                title="PG Lottery"
                author="John Bojtor"
                description="A lottery for rasing funds for public goods"
                value={10}
                tickets={1000}
                expiration={new Date()}
            />
            <BuyCard
                className="max-w-96 p-6"
            />
        </div>
    );
}