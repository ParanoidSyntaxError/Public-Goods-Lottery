"use client";

import { Lottery, LotteryState } from "@/lib/lottery-indexer";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import TotalTicketsLabel from "./total-tickets-label";
import { requestEndLottery } from "@/lib/lottery-crypto";
import { web3Auth } from "@/lib/web3AuthProviderProps";

export interface EndCardProps extends React.HTMLAttributes<HTMLElement> {
    lottery: Lottery;
}

export default function EndCard({
    lottery,
    ...props
}: EndCardProps) {
    const requestEnd = async () => {
        if (web3Auth.provider) {
            await requestEndLottery(web3Auth.provider, lottery.id);
        }
    };

    const payWinners = async () => {

    };

    if (lottery.expiration.getTime() <= Date.now() && lottery.state === LotteryState.InProgress) {
        return (
            <Card
                {...props}
                className={cn(
                    "p-6",
                    props.className
                )}
            >
                <div
                    className="space-y-6"
                >
                    <TotalTicketsLabel
                        totalTickets={lottery.totalTickets}
                    />
                    <Button
                        className="rounded-full w-full"
                        onClick={requestEnd}
                    >
                        Request End
                    </Button>
                </div>
            </Card>
        );
    }

    if (lottery.state === LotteryState.Ending) {
        return (
            <Card
                {...props}
                className={cn(
                    "p-6",
                    props.className
                )}
            >
                <div
                    className="space-y-6"
                >
                    <TotalTicketsLabel
                        totalTickets={lottery.totalTickets}
                    />
                    <Button
                        className="rounded-full w-full"
                        disabled
                    >
                        Payout Winners
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card
            {...props}
            className={cn(
                "p-6",
                props.className
            )}
        >
            <div
                className="space-y-6"
            >
                <TotalTicketsLabel
                    totalTickets={lottery.totalTickets}
                />
                <Button
                    className="rounded-full w-full"
                    disabled
                >
                    Lottery In Progress
                </Button>
            </div>
        </Card>
    );
}