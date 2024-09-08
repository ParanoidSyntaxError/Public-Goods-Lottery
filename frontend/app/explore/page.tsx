import LotteryGrid from "@/components/lottery-grid";
import { getLotteries } from "@/lib/lottery-indexer";

export default async function ExplorePage() {
    const lotteries = await getLotteries();
    lotteries.sort((a, b) => {
        if (a.onchainId > b.onchainId) return -1;
        if (a.onchainId < b.onchainId) return 1;
        return 0;
    });

    return (
        <div>
            <LotteryGrid
                lotteries={lotteries}
            />
        </div>
    );
}