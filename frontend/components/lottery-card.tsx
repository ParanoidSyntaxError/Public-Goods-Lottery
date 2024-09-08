import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn, shortenAddress } from "@/lib/utils";
import DurationTag from "@/components/duration-text-";
import { formatUnits } from "ethers";
import UserLink from "@/components/user-link";
import { Lottery } from "@/lib/lottery-indexer";

export interface LotteryCardProps extends React.HTMLAttributes<HTMLElement> {
    lottery: Lottery;
}

export default function LotteryCard({
    lottery,
    ...props
}: LotteryCardProps) {
    return (
        <Card
            {...props}
            className={cn(
                "h-fit p-6",
                props.className
            )}
        >
            <div
                className="space-y-8"
            >
                <div
                    className="space-y-2"
                >
                    <div
                        className="text-2xl font-semibold w-64 max-h-16 text-ellipsis line-clamp-2 overflow-hidden"
                    >
                        {lottery.name}
                    </div>
                    <UserLink
                        label={shortenAddress(lottery.receiver)}
                        slug={lottery.receiver}
                    />
                    <div
                        className="text-sm text-muted-foreground pt-2 w-64 max-h-12 text-ellipsis line-clamp-2 overflow-hidden"
                    >
                        {lottery.description}
                    </div>
                </div>
                <div
                    className="space-y-2"
                >
                    <DurationTag
                        expiration={lottery.expiration}
                    />
                    <div
                        className="text-3xl font-bold"
                    >
                        {formatUnits(lottery.value)} ETH
                    </div>
                    <div
                        className="text-sm text-muted-foreground"
                    >
                        Raised from {lottery.totalTickets.toLocaleString("en-US", { maximumFractionDigits: 0 })} tickets
                    </div>
                    <Separator />
                </div>
                <div
                    className=""
                >
                    <Button
                        className="w-full rounded-full"
                        asChild
                    >
                        <Link
                            href={`/lottery/${lottery.id}`}
                        >
                            View
                        </Link>
                    </Button>
                </div>
            </div>
        </Card >
    );
}