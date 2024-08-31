import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProfileLinkProps extends React.HTMLAttributes<HTMLElement> {
    label: string;
    url: string;
}

export default function ProfileLink({
    label,
    url,
    ...props
}: ProfileLinkProps) {
    return (
        <Button
            variant="link"
            className={cn(
                "w-fit h-fit text-base p-0",
                props.className
            )}
        >
            <Link
                href={url}
                className="text-blue-600"
            >
                {label}
            </Link>
        </Button>
    );
}