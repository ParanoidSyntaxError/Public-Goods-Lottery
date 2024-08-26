"use client";

import { web3Auth, web3AuthOptions } from "@/lib/web3AuthProviderProps";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";

export default function Web3AuthConnector() {
    useEffect(() => {
        const init = async () => {
            try {
                const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
                adapters.forEach((adapter) => web3Auth.configureAdapter(adapter));

                await web3Auth.initModal();
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const connect = async () => {
        try {
            await web3Auth.connect();
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <Button
            onClick={connect}
            className="text-xl rounded-full p-6"
        >
            Connect
        </Button>
    );
}