import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UserLinkProps extends React.HTMLAttributes<HTMLElement> {
    label: string;
    slug: string;
}

export default function UserLink({
    label,
    slug,
    ...props
}: UserLinkProps) {
    return (
        <Button
            variant="link"
            className={cn(
                "w-fit h-fit text-base p-0",
                props.className
            )}
        >
            <Link
                href={`/user/${slug}`}
                className="text-blue-600"
            >
                {label}
            </Link>
        </Button>
    );
}