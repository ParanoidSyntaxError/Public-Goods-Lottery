export interface TotalTicketsLabelProps extends React.HTMLAttributes<HTMLElement> {
    totalTickets: bigint;
}

export default function TotalTicketsLabel({
    totalTickets,
    ...props
}: TotalTicketsLabelProps) {
    return (
        <div
            {...props}
        >
            <div
                className="flex flex-row items-end space-x-1"
            >
                <div
                    className="text-5xl"
                >
                    {totalTickets.toString()}
                </div>
                <div>
                    <div
                        className="text-sm"
                    >
                        TOTAL
                    </div>
                    <div
                        className="text-sm"
                    >
                        TICKETS
                    </div>
                </div>
            </div>
        </div>
    );
}