
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { type Client } from "@/types/client"
import { useEffect } from "react"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z.string().min(1, "Phone number is required."),
})

type ClientFormValues = Omit<Client, 'id' | 'status'>;

type ClientFormProps = {
  setSheetOpen: (open: boolean) => void;
  initialData?: Client;
  onSubmit: (values: ClientFormValues) => void;
}

export function ClientForm({ setSheetOpen, initialData, onSubmit }: ClientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    if (initialData) {
        form.reset(initialData);
    } else {
        form.reset({
            name: "",
            email: "",
            phone: "",
        })
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="Innovate Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@innovate.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="(123) 456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button type="submit">{initialData ? "Save Changes" : "Add Client"}</Button>
        </div>
      </form>
    </Form>
  )
}
