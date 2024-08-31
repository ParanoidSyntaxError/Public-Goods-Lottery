import BuyCard from "@/components/buy-card";
import DurationTag from "@/components/duration-text-";
import ProfileLink from "@/components/profile-link";
import TicketTable from "@/components/ticket-table";

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
    ],
    expiration: new Date(Date.now() + 0)
};

export default function Lottery() {
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
                        {mockLottery.title}
                    </div>
                    <div
                        className="flex flex-row space-x-6"
                    >
                        <ProfileLink
                            label={mockLottery.author}
                            url="org"
                            className="text-xl"
                        />
                        <DurationTag
                            expiration={mockLottery.expiration}
                        />
                    </div>
                </div>
                <div
                    className="text-lg"
                >
                    {mockLottery.description}
                </div>
            </div>
            <div
                className="flex flex-row justify-between mx-auto space-x-4"
            >
                <TicketTable
                    className="w-full"
                    tickets={mockLottery.tickets}
                    connectedHolder={mockLottery.tickets[9]}
                />
                <BuyCard
                    className="min-w-72 h-fit"
                />
            </div>
        </div>
    );
}