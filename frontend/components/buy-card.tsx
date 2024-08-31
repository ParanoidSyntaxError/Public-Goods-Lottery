"use client";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export interface BuyCardProps extends React.HTMLAttributes<HTMLElement> { 
}

const formSchema = z.object({
    chainId: z.string().min(1, "Network not selected"),
    amount: z.number().min(1, "Must buy at least one ticket")
})

export default function BuyCard({
    ...props
}: BuyCardProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            chainId: "",
            amount: 1,
        },
        mode: "all"
    });
    form.watch();

    const submit = async () => {

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
                    <FormField
                        control={form.control}
                        name="chainId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Network
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder="Select a network"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem
                                            value="1"
                                        >
                                            Ethereum
                                        </SelectItem>
                                        <SelectItem
                                            value="8453"
                                        >
                                            Base
                                        </SelectItem>
                                        <SelectItem
                                            value="10"
                                        >
                                            Optimism
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                            if(Number.isNaN(amount) || amount < 1) {
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