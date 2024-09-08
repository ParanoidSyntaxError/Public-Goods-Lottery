import { Button } from "@/components/ui/button";
import Link from "next/link";
import Web3AuthConnector from "@/components/web3auth-connector";
import ToggleTheme from "@/components/toggle-theme";

export default function TopNav() {
    return (
        <div
            className="flex flex-row justify-between items-center h-20"
        >
            <Link
                href={"/"}
                className="flex flex-row items-center space-x-2"
            >
                <div
                    className="flex flex-row"
                >
                    <div
                        className="text-6xl"
                    >
                        🎫
                    </div>
                    <div
                        className="text-4xl font-semibold my-auto"
                    >
                        PGL
                    </div>
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
                <ToggleTheme />
                <div>
                    <Web3AuthConnector />
                </div>
            </div>
        </div>
    );
}