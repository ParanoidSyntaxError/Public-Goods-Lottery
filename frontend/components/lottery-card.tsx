import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import DurationTag from "@/components/duration-text-";
import ProfileLink from "@/components/profile-link";

export interface LotteryCardProps extends React.HTMLAttributes<HTMLElement> {
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
    expiration,
    ...props
}: LotteryCardProps) {
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
                        {title}
                    </div>
                    <ProfileLink
                        label={author}
                        url="org"
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
                        {value.toFixed(3)} ETH
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
            </div>
        </Card >
    );
}