import BuyForm from "@/components/buy-form";
import LotteryCard from "@/components/lottery-card";
import { Card } from "@/components/ui/card";

export default function Explore() {
    return (
        <div
            className="space-y-8"
        >
            <LotteryCard
                title="PG Lottery"
                author="John Bojtor"
                description="A lottery for rasing funds for public goods"
                value={10}
                tickets={1000}
                expiration={new Date()}
            />
            <Card
                className="max-w-96 p-6"
            >
                <BuyForm />
            </Card>
        </div>
    );
}