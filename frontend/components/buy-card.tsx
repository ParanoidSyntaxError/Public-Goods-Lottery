"use client";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { web3Auth } from "@/lib/web3AuthProviderProps";
import { buyTickets, ticketPrice } from "@/lib/lottery-crypto";

export interface BuyCardProps extends React.HTMLAttributes<HTMLElement> {
    lotteryId: string;
    totalTickets?: bigint;
}

const formSchema = z.object({
    amount: z.number().min(1, "Must buy at least one ticket")
})

export default function BuyCard({
    lotteryId,
    totalTickets,
    ...props
}: BuyCardProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 1,
        },
        mode: "all"
    });
    form.watch();

    const submit = async () => {
        if (!web3Auth.provider) {
            return;
        }

        await buyTickets(
            web3Auth.provider,
            lotteryId,
            BigInt(form.getValues("amount")) * ticketPrice
        );
    };

    return (
        <Card
            {...props}
            className={cn(
                "p-6",
                props.className
            )}
        >
            <Form
                {...form}
            >
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(submit)}
                    action=""
                >
                    {(totalTickets !== undefined) &&
                        <div
                            className="space-x-1"
                        >
                            <span
                                className="text-4xl"
                            >
                                {totalTickets.toString()}
                            </span>
                            <span
                                className="text-sm"
                            >
                                TOTAL
                            </span>
                        </div>
                    }
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Tickets
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        value={field.value}
                                        onChange={(value) => {
                                            let amount = Number(value.currentTarget.value);
                                            if (Number.isNaN(amount) || amount < 1) {
                                                amount = 1;
                                            }
                                            form.setValue("amount", amount);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div
                        className="space-y-1"
                    >
                        <div
                            className="text-2xl font-semibold text-left"
                        >
                            {(form.getValues("amount") * 0.001).toFixed(3)} ETH
                        </div>
                        <Separator />
                    </div>
                    <Button
                        className="rounded-full w-full"
                    >
                        Buy
                    </Button>
                </form>
            </Form>
        </Card>
    );
} 