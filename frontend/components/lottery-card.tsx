import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export interface LotteryCardProps {
    title: string;
    author: string;
    description: string;
    value: number;
    tickets: number;
    expiration: Date;
}

export default function LotteryCard({
    title,
    author,
    description,
    value,
    tickets,
    expiration
}: LotteryCardProps) {
    return (
        <Card
            className="max-w-80 p-6 space-y-8"
        >
            <div
                className="space-y-2"
            >
                <div
                    className="text-2xl font-semibold"
                >
                    {title}
                </div>
                <Button
                    variant="link"
                    className="w-fit h-fit p-0"
                >
                    <Link
                        href="org"
                        className="text-base text-blue-600"
                    >
                        {author}
                    </Link>
                </Button>
                <div
                    className="text-sm text-muted-foreground pt-2"
                >
                    {description}
                </div>
            </div>
            <div
                className="space-y-2"
            >
                <div
                    className="text-sm bg-muted px-2 py-1 rounded-lg w-fit"
                >
                    Ends in 5 hours
                </div>
                <div
                    className="text-3xl font-bold"
                >
                    {value.toFixed(4)} ETH
                </div>
                <div
                    className="text-sm text-muted-foreground"
                >
                    Raised from {tickets.toLocaleString("en-US", { maximumFractionDigits: 0 })} tickets
                </div>
                <Separator />
            </div>
            <div
                className=""
            >
                <Button
                    className="w-full rounded-full"
                >
                    <Link
                        href="view"
                    >
                        View
                    </Link>
                </Button>
            </div>
        </Card >
    );
}