import LotteryGrid from "@/components/lottery-grid";
import { getReceiversLotteries } from "@/lib/lottery-indexer";

export default async function UserPage({
    params: { userAddress }
}: { params: { userAddress: string }}) {
    const lotteries = await getReceiversLotteries(userAddress);

    return (
        <div>
            <LotteryGrid
                lotteries={lotteries}
            />
        </div>
    );
}