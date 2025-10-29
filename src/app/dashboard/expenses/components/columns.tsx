
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Expense } from "@/types/expense";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PaymentTypeBadge = ({ type }: { type: string }) => {
  return (
    <Badge
      className={cn(
        "capitalize",
        type === "CASH"
          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
          : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
      )}
    >
      {type.toLowerCase()}
    </Badge>
  );
};


export const columns = (onEdit: (expense: Expense) => void, onDelete: (expense: Expense) => void): ColumnDef<Expense>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "paymentType",
    header: "Payment Type",
    cell: ({ row }) => <PaymentTypeBadge type={row.getValue("paymentType")} />,
  },
  {
    accessorKey: "amount",
    header: "Amount (NPR)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "NPR",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const expense = row.original;
      return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(expense)}>
                <Edit className="mr-2 h-4 w-4"/>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(expense)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4"/>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      );
    },
  },
];

    