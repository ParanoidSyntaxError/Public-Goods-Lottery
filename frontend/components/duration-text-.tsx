import { cn, msToMhd } from "@/lib/utils";

export interface DurationTagProps extends React.HTMLAttributes<HTMLElement> {
    expiration: Date;
}

export default function DurationTag({
    expiration,
    ...props
}: DurationTagProps) {
    const expirationText = () => {
        const duration = expiration.getTime() - Date.now();

        if (duration <= 0) {
            return "Ended";
        }

        const { minutes, hours, days } = msToMhd(duration);

        if (days > 0) {
            return `Ends in ${days} day${days > 1 ? "s" : ""}`;
        }

        if (hours > 0) {
            return `Ends in ${hours} hour${hours > 1 ? "s" : ""}`;
        }

        if (minutes > 1) {
            return `Ends in ${minutes} minutes`;
        }

        return "Ends in 1 minute";
    };

    return (
        <div
            {...props}
            className={cn(
                "text-sm bg-muted px-2 py-1 rounded-lg w-fit",
                props.className
            )}
        >
            {expirationText()}
        </div>
    );
}