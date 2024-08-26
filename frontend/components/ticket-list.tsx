export interface Ticket {
    timestamp: Date;
    holder: string;
    network: string;
    amount: number;
}

export interface TicketListProps {
    tickets: Ticket[];
}

export default function TicketList({
    tickets
}: TicketListProps) {
    return (
        <div>

        </div>
    );
}