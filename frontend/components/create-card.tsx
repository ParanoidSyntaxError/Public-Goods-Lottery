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
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface CreateCardProps extends React.HTMLAttributes<HTMLElement> {
}

const formSchema = z.object({
    title: z.string().min(1, ""),
    shortDescription: z.string().min(1, ""),
    description: z.string().min(1, ""),
    chainId: z.string().min(1, "Network not selected"),
})

export default function CreateCard({
    ...props
}: CreateCardProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            shortDescription: "",
            description: "",
            chainId: "",
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
                    className="space-y-12"
                    onSubmit={form.handleSubmit(submit)}
                    action=""
                >
                    <div
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Title
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
                            name="shortDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Short Description
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