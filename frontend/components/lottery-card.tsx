import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn, shortenAddress } from "@/lib/utils";
import DurationTag from "@/components/duration-text-";
import { formatUnits } from "ethers";
import UserLink from "@/components/user-link";

export interface LotteryCardProps extends React.HTMLAttributes<HTMLElement> {
    id: string;
    name: string;
    description: string;
    receiver: string;
    value: bigint;
    totalTickets: bigint;
    expiration: Date;
}

export default function LotteryCard({
    id,
    name,
    description,
    receiver,
    value,
    totalTickets,
    expiration,
    ...props
}: LotteryCardProps) {
    const shortReceiver = shortenAddress(receiver);
    const ethValue = formatUnits(value);

    return (
        <Card
            {...props}
            className={cn(
                "p-6",
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
                        className="text-2xl font-semibold"
                    >
                        {name}
                    </div>
                    <UserLink
                        label={shortReceiver}
                        slug={receiver}
                    />
                    <div
                        className="text-sm text-muted-foreground pt-2"
                    >
                        {description}
                    </div>
                </div>
                <div
                    className="space-y-2"
                >
                    <DurationTag
                        expiration={expiration}
                    />
                    <div
                        className="text-3xl font-bold"
                    >
                        {ethValue} ETH
                    </div>
                    <div
                        className="text-sm text-muted-foreground"
                    >
                        Raised from {totalTickets.toLocaleString("en-US", { maximumFractionDigits: 0 })} tickets
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
                            href={`/lottery/${id}`}
                        >
                            View
                        </Link>
                    </Button>
                </div>
            </div>
        </Card >
    );
}