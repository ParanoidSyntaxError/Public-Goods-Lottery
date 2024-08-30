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

export interface NewCardProps extends React.HTMLAttributes<HTMLElement> { 
}

const formSchema = z.object({
    chainId: z.string(),
    title: z.string(),
    description: z.string()
})

export default function NewCard({
    ...props
}: NewCardProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            chainId: "",
            title: "",
            description: ""
        },
        mode: "all"
    });
    form.watch();

    const submit = async () => {
        
    };

    return (
        <Card
            {...props}
        >
            <Form
                {...form}
            >
                <form
                    className=""
                >

                </form>
            </Form>
        </Card>
    );
} 