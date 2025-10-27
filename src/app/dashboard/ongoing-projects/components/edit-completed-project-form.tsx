
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { CompletedProject } from "@/lib/data"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  manager: z.string(),
  completionDate: z.string(),
  finalDeliveryDate: z.string(),
  billingStatus: z.enum(["Paid", "Invoice Sent", "Pending"]),
  deploymentStatus: z.enum(["Live", "Staging"]),
  reviewStatus: z.enum(["Completed", "Pending", "Scheduled"]),
});

type EditCompletedProjectFormProps = {
  initialData?: CompletedProject;
  onSubmit: (data: CompletedProject) => void;
  setSheetOpen: (open: boolean) => void;
};

export function EditCompletedProjectForm({ 
    initialData, 
    onSubmit, 
    setSheetOpen 
}: EditCompletedProjectFormProps) {
  const { toast } = useToast();

  const form = useForm<CompletedProject>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: CompletedProject) => {
    onSubmit(values);
    toast({
      title: "Project Updated",
      description: `Project "${values.name}" has been successfully updated.`,
    });
  };
  
  if (!initialData) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="completionDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Completion Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="finalDeliveryDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Final Delivery Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="billingStatus"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Billing Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Invoice Sent">Invoice Sent</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="deploymentStatus"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Deployment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className={cn(
                            field.value === "Live" && "bg-green-100 border-green-500 text-green-700",
                            field.value === "Staging" && "bg-yellow-100 border-yellow-500 text-yellow-700",
                        )}>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Live">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"/>Live</div>
                            </SelectItem>
                            <SelectItem value="Staging">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"/>Staging</div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
            control={form.control}
            name="reviewStatus"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Post-Delivery Review</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  )
}
