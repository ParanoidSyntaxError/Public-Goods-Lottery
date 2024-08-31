import LotteryCard from "@/components/lottery-card";

const mockLotteries = [
    {
        title: "Test Lottery",
        author: "Owner",
        description: "LFG get in here boys!",
        value: 10,
        tickets: 10000,
        expiration: new Date(Date.now() + 60000000)
    },
    {
        title: "Test Lottery",
        author: "Owner",
        description: "LFG get in here boys!",
        value: 10,
        tickets: 10000,
        expiration: new Date()
    },
    {
        title: "Test Lottery",
        author: "Owner",
        description: "LFG get in here boys!",
        value: 10,
        tickets: 10000,
        expiration: new Date()
    },
    {
        title: "Test Lottery",
        author: "Owner",
        description: "LFG get in here boys!",
        value: 10,
        tickets: 10000,
        expiration: new Date()
    },
    {
        title: "Test Lottery",
        author: "Owner",
        description: "LFG get in here boys!",
        value: 10,
        tickets: 10000,
        expiration: new Date()
    },
    {
        title: "Test Lottery",
        author: "Owner",
        description: "LFG get in here boys!",
        value: 10,
        tickets: 10000,
        expiration: new Date()
    },
    {
        title: "Test Lottery",
        author: "Owner",
        description: "LFG get in here boys!",
        value: 10,
        tickets: 10000,
        expiration: new Date()
    },
    {
        title: "Test Lottery",
        author: "Owner",
        description: "LFG get in here boys!",
        value: 10,
        tickets: 10000,
        expiration: new Date()
    },
];

export interface LotteryGridProps extends React.HTMLAttributes<HTMLElement> { 
}

export default function LotteryGrid({
    ...props
}: LotteryGridProps) {
    return (
        <div
            {...props}
        >
            <div
                className="grid justify-center gap-x-12 gap-y-8"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, 20rem)"
                }}
            >
                {mockLotteries.map((lottery, index) => (
                    <LotteryCard
                        key={index}
                        title={lottery.title}
                        author={lottery.author}
                        description={lottery.description}
                        value={lottery.value}
                        tickets={lottery.tickets}
                        expiration={lottery.expiration}
                    />
                ))}
            </div>
        </div>
    );
}