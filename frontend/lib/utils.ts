import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function msToMhd(ms: number): { minutes: number, hours: number, days: number } {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));

    return {
        minutes,
        hours,
        days
    };
}

export function shortenAddress(address: string, start: number = 6, end: number = 4): string {
    return `${address.slice(0, start)}...${address.slice(address.length - end)}`
}

export function percentageLabel(amount: number, total: number): string {
    return `${((amount / total) * 100).toFixed(2)}%`;
}