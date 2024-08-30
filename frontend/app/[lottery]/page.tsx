import BuyCard from "@/components/buy-card";
import TicketList from "@/components/ticket-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockLottery = {
    title: "The Giveth Community of Makers",
    author: "John B",
    description: "Giveth is a community focused on Building the Future of Giving using blockchain technology. Our intention is to support and reward the funding of public goods by creating open, transparent and free access to the revolutionary funding opportunities available within the Ethereum ecosystem. Read more in our docs!",
    tickets: [
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
        },
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
        },
        {
            holder: "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88",
            network: "ETH",
            amount: 100
        },
        {
            holder: "0xade2770ad5ab78c4cbd306d2b33d475d780e3394",
            network: "ETH",
            amount: 77
        }
    ]
};

export default function Lottery() {
    return (
        <div
            className="space-y-16 mt-16"
        >
            <div
                className="flex flex-col w-[48rem] mx-auto space-y-8"
            >
                <div
                    className="space-y-4"
                >
                    <div
                        className="text-4xl font-bold"
                    >
                        {mockLottery.title}
                    </div>
                    <Button
                        variant="link"
                        className="w-fit h-fit p-0"
                    >
                        <Link
                            href="org"
                            className="text-xl text-blue-600"
                        >
                            {mockLottery.author}
                        </Link>
                    </Button>
                </div>
                <div
                    className="text-lg"
                >
                    {mockLottery.description}
                </div>
            </div>
            <div
                className="flex flex-row justify-between max-w-[48rem] mx-auto space-x-8"
            >
                <TicketList
                    className="w-full"
                    tickets={mockLottery.tickets}
                    connectedHolder={mockLottery.tickets[9]}
                />
                <BuyCard
                    className="min-w-72 h-fit p-6"
                />
            </div>
        </div>
    );
}