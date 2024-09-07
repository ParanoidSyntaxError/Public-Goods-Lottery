import LotteryGrid from "@/components/lottery-grid";
import { getLotteries } from "@/lib/lottery-indexer";

export default async function ExplorePage() {
    const lotteries = await getLotteries();

    return (
        <div>
            <LotteryGrid
                lotteries={lotteries}
            />
        </div>
    );
}