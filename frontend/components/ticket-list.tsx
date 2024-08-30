import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export interface Ticket {
    holder: string;
    network: string;
    amount: number;
}

export interface TicketListProps extends React.HTMLAttributes<HTMLElement> {
    tickets: Ticket[];
}

export default function TicketList({
    tickets,
    ...props
}: TicketListProps) {
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
                            Network
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
                    {tickets.map((ticket, index) => (
                        <TableRow
                            key={index}
                        >
                            <TableCell>
                                {ticket.holder.slice(0, 6)}...{ticket.holder.slice(ticket.holder.length - 4)}
                            </TableCell>
                            <TableCell>
                                {ticket.network}
                            </TableCell>
                            <TableCell>
                                {ticket.amount}
                            </TableCell>
                            <TableCell>
                                X%
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}