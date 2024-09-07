"use client";

import { web3Auth, web3AuthOptions } from "@/lib/web3AuthProviderProps";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";

export default function Web3AuthConnector() {
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            try {
                const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
                adapters.forEach((adapter) => web3Auth.configureAdapter(adapter));

                await web3Auth.initModal();

                if (web3Auth.connected) {
                    setConnected(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const connect = async () => {
        try {
            await web3Auth.connect();

            if (web3Auth.connected) {
                setConnected(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const disconnect = async () => {
        try {
            await web3Auth.logout();

            if (!web3Auth.connected) {
                setConnected(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (connected) {
        return (
            <Button
                onClick={disconnect}
                className="text-xl rounded-full p-6"
            >
                Disconnect
            </Button>
        );
    }

    return (
        <Button
            onClick={connect}
            className="text-xl rounded-full p-6"
        >
            Connect
        </Button>
    );
}