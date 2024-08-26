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

export interface BuyFormProps extends React.HTMLAttributes<HTMLElement> { 
}

const formSchema = z.object({
    chainId: z.string(),
    amount: z.number()
})

export default function BuyForm({
    ...props
}: BuyFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            chainId: "",
            amount: 0,
        },
        mode: "all"
    });
    form.watch();

    const submit = async () => {
        
    };

    return (
        <div
            {...props}
        >
            <Form
                {...form}
            >
                <form
                    className="space-y-6"
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
                                            if(Number.isNaN(amount) || amount < 0) {
                                                amount = 0;
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
                            0.0001 ETH
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
        </div>
    );
} 