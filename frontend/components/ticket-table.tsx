import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Ticket {
    holder: string;
    network: string;
    amount: number;
}

export interface TicketTableProps extends React.HTMLAttributes<HTMLElement> {
    tickets: Ticket[];
    connectedHolder?: Ticket;
}

export default function TicketTable({
    tickets,
    connectedHolder,
    ...props
}: TicketTableProps) {
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
                    {connectedHolder &&
                        <TableRow
                            className="bg-blue-600 bg-opacity-10"
                        >
                            <TableCell>
                                You
                            </TableCell>
                            <TableCell>
                                {connectedHolder.network}
                            </TableCell>
                            <TableCell>
                                {connectedHolder.amount}
                            </TableCell>
                            <TableCell>
                                X%
                            </TableCell>
                        </TableRow>
                    }
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