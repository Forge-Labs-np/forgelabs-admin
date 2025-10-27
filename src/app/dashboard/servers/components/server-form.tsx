
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Server } from "@/types/server"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import type { Client } from "@/types/client"
import { collection } from "firebase/firestore"

const formSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  clientId: z.string().min(1, "A client must be assigned"),
  host: z.string().min(1, "Host is required"),
  cpu: z.string().min(1, "CPU allocation is required."),
  ram: z.string().min(1, "RAM allocation is required."),
});

type ServerFormValues = Omit<Server, 'id'>;

type ServerFormProps = {
  initialData?: Server;
  onSubmit: (data: ServerFormValues) => void;
  setSheetOpen: (open: boolean) => void;
};

export function ServerForm({ initialData, onSubmit, setSheetOpen }: ServerFormProps) {
  const firestore = useFirestore();
  const clientsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'clients') : null, [firestore]);
  const { data: clients, isLoading } = useCollection<Client>(clientsCollection);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      clientId: "",
      host: "",
      cpu: "",
      ram: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: "",
        clientId: "",
        host: "",
        cpu: "",
        ram: "",
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Production Web Server" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Assigned Client</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a client..." />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {(clients || []).map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AWS, Azure" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="cpu"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Allocated CPU</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="e.g., 4 vCPU" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="ram"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Allocated RAM</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="e.g., 16 GB" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
          <Button type="submit">{initialData ? 'Save Changes' : 'Add Server'}</Button>
        </div>
      </form>
    </Form>
  )
}

    