"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAddress } from "@/lib/lottery-crypto";
import { getTicketHolder } from "@/lib/lottery-indexer";
import { Lottery, percentageLabel, shortenAddress, TicketHolder } from "@/lib/utils";
import { useState } from "react";
import { web3Auth } from "@/lib/web3AuthProviderProps";

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

    web3Auth.on("connected", async () => {
        if (web3Auth.provider) {
            const connectedAddress = await getAddress(web3Auth.provider);
            if (connectedAddress) {
                const holder = await getTicketHolder(lottery.id, connectedAddress);
                setConnectedHolder(holder);
            }
        } else {
            setConnectedHolder(undefined);
        }
    });

    web3Auth.on("disconnected", () => {
        setConnectedHolder(undefined);
    });

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