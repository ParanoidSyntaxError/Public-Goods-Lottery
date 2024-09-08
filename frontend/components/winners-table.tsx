"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lottery, Winner } from "@/lib/lottery-indexer";
import { cn } from "@/lib/utils";
import { formatUnits } from "ethers";

export interface WinnersTableProps extends React.HTMLAttributes<HTMLElement> {
    lottery: Lottery;
    winners: Winner[];
}

export default function WinnersTable({
    lottery,
    winners,
    ...props
}: WinnersTableProps) {
    winners.sort((a, b) => {
        if (a.value > b.value) return -1;
        if (a.value < b.value) return 1;
        return 0;
    });

    return (
        <div
            {...props}
            className={cn(
                "rounded-xl overflow-hidden border-2 h-fit",
                props.className
            )}
        >
            <Table>
                <TableHeader
                    className="bg-muted"
                >
                    <TableRow>
                        <TableHead>
                            Winner
                        </TableHead>
                        <TableHead
                            className="w-40"
                        >
                            Place
                        </TableHead>
                        <TableHead
                            className="w-40"
                        >
                            Value
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {winners.map((winner, index) => (
                        <TableRow
                            key={index}
                        >
                            <TableCell>
                                {winner.address}
                            </TableCell>
                            <TableCell>
                                #{(index + 1).toString()}
                            </TableCell>
                            <TableCell>
                                {formatUnits(winner.value)} ETH
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}