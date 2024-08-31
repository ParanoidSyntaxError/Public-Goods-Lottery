"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ToggleTheme() {
    const { resolvedTheme, setTheme } = useTheme();

    const handleSetTheme = () => {
        if (resolvedTheme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    return (
        <Button
            variant="outline"
            className="px-2 py-2 rounded-full border-2"
            onClick={handleSetTheme}
        >
            <Sun
                className="hidden dark:flex"
            />
            <Moon
                className="flex dark:hidden"
            />
        </Button>
    );
}