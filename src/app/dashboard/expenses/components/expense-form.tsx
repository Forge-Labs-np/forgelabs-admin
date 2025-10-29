
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
import { Textarea } from "@/components/ui/textarea"
import { type Expense } from "@/types/expense"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
  date: z.string().min(1, "Date is required."),
  category: z.string().min(1, "Category is required."),
  description: z.string().min(1, "Description is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  paymentType: z.enum(["CASH", "ONLINE"]),
});

type ExpenseFormValues = Omit<Expense, 'id'>;

type ExpenseFormProps = {
  setSheetOpen: (open: boolean) => void;
  initialData?: Expense;
  onSubmit: (values: ExpenseFormValues) => void;
}

const expenseCategories = [
  "FOOD AND DRINKS",
  "DEVICES",
  "MARKETING",
  "HOSTING",
  "SOFTWARE SUBSCRIPTIONS",
  "TRAVEL AND TRANSPORTATION",
  "OFFICE SUPPLIES",
  "TRAINING AND EDUCATION",
  "EMPLOYEE BENEFITS",
  "UTILITIES (Internet, Electricity)",
  "LEGAL AND PROFESSIONAL SERVICES",
  "CONSULTING FEES",
  "RENT AND LEASES",
  "MAINTENANCE AND REPAIRS",
  "COMMUNICATIONS (Phone, VOIP)",
  "INSURANCE",
  "TAXES",
];

export function ExpenseForm({ setSheetOpen, initialData, onSubmit }: ExpenseFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        date: format(new Date(initialData.date), "yyyy-MM-dd"),
    } : {
      date: format(new Date(), "yyyy-MM-dd"),
      category: "",
      description: "",
      amount: 0,
      paymentType: "ONLINE",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={!!initialData} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an expense category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {expenseCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
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
                <Textarea placeholder="e.g., Lunch with client" {...field} />
              </FormControl>
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
                        <Input type="number" placeholder="1500" {...field} disabled={!!initialData} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-4 pt-2"
                            disabled={!!initialData}
                            >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="CASH" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Cash</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="ONLINE" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Online</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button type="submit">{initialData ? "Save Changes" : "Add Expense"}</Button>
        </div>
      </form>
    </Form>
  )
}
