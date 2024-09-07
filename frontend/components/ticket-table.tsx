"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAddress } from "@/lib/lottery-crypto";
import { getTicketHolder } from "@/lib/lottery-indexer";
import { Lottery, percentageLabel, shortenAddress, TicketHolder } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";

export interface TicketTableProps extends React.HTMLAttributes<HTMLElement> {
    lottery: Lottery;
    tickets: TicketHolder[];
}

export default function TicketTable({
    lottery,
    tickets,
    ...props
}: TicketTableProps) {
    const [connectedHolder, setConnectedHolder] = useState<TicketHolder | undefined>(undefined);

    const { isInitialized, isConnected, provider } = useWeb3Auth();

    useEffect(() => {
        const updateConnectedHolder = async () => {
            if (provider) {
                const connectedAddress = await getAddress(provider);
                if (connectedAddress) {
                    const holder = await getTicketHolder(lottery.id, connectedAddress);
                    setConnectedHolder(holder);
                }
            } else {
                setConnectedHolder(undefined);
            }
        };

        updateConnectedHolder();
    }, []);

    tickets = tickets.filter((ticket) => ticket.address !== connectedHolder?.address);
    tickets.sort((a, b) => {
        if (a.amount > b.amount) return -1;
        if (a.amount < b.amount) return 1;
        return 0;
    });

    return (
        <div
            {...props}
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Holder
                        </TableHead>
                        <TableHead>
                            Tickets
                        </TableHead>
                        <TableHead>
                            Chance
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {connectedHolder &&
                        <TableRow
                            className="bg-blue-600 bg-opacity-10"
                        >
                            <TableCell>
                                You ({shortenAddress(connectedHolder.address)})
                            </TableCell>
                            <TableCell>
                                {connectedHolder.amount.toString()}
                            </TableCell>
                            <TableCell>
                                {percentageLabel(Number(connectedHolder.amount), Number(lottery.totalTickets))}
                            </TableCell>
                        </TableRow>
                    }
                    {tickets.map((ticket, index) => (
                        <TableRow
                            key={index}
                        >
                            <TableCell>
                                {shortenAddress(ticket.address)}
                            </TableCell>
                            <TableCell>
                                {ticket.amount.toString()}
                            </TableCell>
                            <TableCell>
                                {percentageLabel(Number(ticket.amount), Number(lottery.totalTickets))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}