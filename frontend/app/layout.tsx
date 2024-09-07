import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import TopNav from "@/components/top-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3AuthProvider } from "@web3auth/modal-react-hooks";
import { web3AuthOptions } from "@/lib/web3AuthProviderProps";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Public Goods Lottery",
    description: "Raise funds for public goods projects",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <head />
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                        <div
                            className="px-6"
                        >
                            <TopNav />
                        </div>
                        <div
                            className="max-w-[72rem] w-full mx-auto my-16 px-8"
                        >
                            {children}
                        </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
