import LotteryCard from "@/components/lottery-card";
import { Lottery } from "@/lib/lottery-indexer";

export interface LotteryGridProps extends React.HTMLAttributes<HTMLElement> { 
    lotteries: Lottery[]
}

export default function LotteryGrid({
    lotteries,
    ...props
}: LotteryGridProps) {
    return (
        <div
            {...props}
        >
            <div
                className="grid justify-left gap-x-12 gap-y-8"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, 20rem)"
                }}
            >
                {lotteries.map((lottery, index) => (
                    <LotteryCard
                        key={index}
                        id={lottery.id}
                        name={lottery.name}
                        description={lottery.description}
                        receiver={lottery.receiver}
                        value={lottery.value}
                        totalTickets={lottery.totalTickets}
                        expiration={lottery.expiration}
                    />
                ))}
            </div>
        </div>
    );
}