import { Button } from "@/components/ui/button";
import Link from "next/link";
import Web3AuthConnector from "@/components/web3auth-connector";

export default function TopNav() {
    return (
        <div
            className="flex flex-row justify-between items-center h-20 px-8"
        >
            <Link
                href={"/"}
                className="flex flex-row items-center space-x-2"
            >
                <div
                    className="text-2xl font-semibold"
                >
                    Public Goods Lottery
                </div>
            </Link>
            <div
                className="flex flex-row items-center space-x-6"
            >
                <Link
                    href="/explore"
                >
                    <Button
                        variant="link"
                        className="h-fit p-0 text-lg"
                    >
                        Explore
                    </Button>
                </Link>
                <Link
                    href="/create"
                >
                    <Button
                        variant="link"
                        className="h-fit p-0 text-lg"
                    >
                        Create
                    </Button>
                </Link>
                <div>
                    <Web3AuthConnector/>
                </div>
            </div>
        </div>
    );
}