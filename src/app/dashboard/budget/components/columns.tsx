
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type BudgetItem = {
  id: string;
  name: string;
  type: 'Project' | 'Operational';
  amount: number;
  details: string; // Client for Project, Category for Operational
  date: string; // Project start date or Operational budget date
};


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "NPR",
        minimumFractionDigits: 0,
    }).format(amount);
};

export const columns: ColumnDef<BudgetItem>[] = [
    {
        accessorKey: "name",
        header: "Budget Name",
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "type",
        header: "Budget Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return <Badge variant="outline" className={cn(
                type === 'Project' ? "border-blue-500 text-blue-500" : "border-green-500 text-green-500"
            )}>{type}</Badge>
        }
    },
    {
        accessorKey: "amount",
        header: "Amount (NPR)",
        cell: ({ row }) => <div className="font-semibold">{formatCurrency(row.getValue("amount"))}</div>,
    },
    {
        accessorKey: "details",
        header: "Client / Category",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date = row.getValue("date") as string;
            if (!date) return null;
            return <span>{format(new Date(date), "MMM dd, yyyy")}</span>;
        },
    }
];
