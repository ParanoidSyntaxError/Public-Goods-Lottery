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
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { web3Auth } from "@/lib/web3AuthProviderProps";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { createLottery, getAddress } from "@/lib/lottery-crypto";

export interface CreateCardProps extends React.HTMLAttributes<HTMLElement> {
}

const formSchema = z.object({
    name: z.string().min(1, ""),
    description: z.string().min(1, ""),
    expiration: z.date(),
    receiver: z.string().min(42, "").max(43, ""),
})

export default function CreateCard({
    ...props
}: CreateCardProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            expiration: new Date(Date.now() + 604800000), // 7 days from now
            receiver: "",
        },
        mode: "all"
    });
    form.watch();

    const submit = async () => {
        if (!web3Auth.provider) {
            return;
        }

        await createLottery(
            web3Auth.provider,
            form.getValues("name"),
            form.getValues("description"),
            form.getValues("expiration"),
            form.getValues("receiver")
        );
    };

    const fiveMinutes = () => {
        form.setValue("expiration", new Date(Date.now() + 300000));
    };

    const useConnectedAddress = async () => {
        if (web3Auth.provider) {
            const connectedAddress = await getAddress(web3Auth.provider);
            if (connectedAddress) {
                form.setValue("receiver", connectedAddress);
            }
        }
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
                    className="space-y-12"
                    onSubmit={form.handleSubmit(submit)}
                    action=""
                >
                    <div
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <Input
                                        placeholder=""
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <FormField
                                control={form.control}
                                name="expiration"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Expiration</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                variant="link"
                                className="h-fit p-1 text-muted-foreground"
                                type="button"
                                onClick={fiveMinutes}
                            >
                                Five minutes
                            </Button>
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="receiver"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Receiver
                                        </FormLabel>
                                        <Input
                                            placeholder=""
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                variant="link"
                                className="h-fit p-1 text-muted-foreground"
                                type="button"
                                onClick={useConnectedAddress}
                            >
                                Connected address
                            </Button>
                        </div>
                    </div>
                    <Button
                        className="rounded-full w-full"
                    >
                        Create
                    </Button>
                </form>
            </Form>
        </Card>
    );
} 