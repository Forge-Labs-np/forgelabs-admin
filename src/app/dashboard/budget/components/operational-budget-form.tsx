
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
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
import { type OperationalBudget } from "@/types/budget"

const formSchema = z.object({
  date: z.string().min(1, "Date is required."),
  name: z.string().min(1, "Budget name is required."),
  category: z.string().min(1, "Category is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
});

type BudgetFormValues = Omit<OperationalBudget, 'id'>;

type BudgetFormProps = {
  setSheetOpen: (open: boolean) => void;
  initialData?: OperationalBudget;
  onSubmit: (values: BudgetFormValues) => void;
}

const budgetCategories = [
  "Marketing & Advertising",
  "Office & Facilities",
  "Salaries & Benefits",
  "Software & Subscriptions",
  "Hardware & Equipment",
  "Travel & Entertainment",
  "Professional Services",
  "Utilities",
  "Other",
];

export function OperationalBudgetForm({ setSheetOpen, initialData, onSubmit }: BudgetFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        date: format(new Date(initialData.date), "yyyy-MM-dd"),
    } : {
      date: format(new Date(), "yyyy-MM-dd"),
      name: "",
      category: "",
      amount: 0,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Q4 Marketing Campaign" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a budget category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {budgetCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Amount (NPR)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button type="submit">{initialData ? "Save Changes" : "Add Budget"}</Button>
        </div>
      </form>
    </Form>
  )
}
