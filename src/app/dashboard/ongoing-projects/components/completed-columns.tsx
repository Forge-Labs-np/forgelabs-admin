
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { CompletedProject } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const columns = (
  onViewReport: (project: CompletedProject) => void,
  onEdit: (project: CompletedProject) => void
): ColumnDef<CompletedProject>[] => [
  {
    accessorKey: "name",
    header: "Project Name",
  },
  {
    accessorKey: "manager",
    header: "Project Manager",
  },
  {
    accessorKey: "completionDate",
    header: "Completion Date",
  },
  {
    accessorKey: "finalDeliveryDate",
    header: "Final Delivery Date",
  },
  {
    accessorKey: "billingStatus",
    header: "Billing Status",
    cell: ({ row }) => {
      const status = row.getValue("billingStatus") as string;
      return <Badge 
        variant={status === "Paid" ? "default" : status === "Invoice Sent" ? "secondary" : "outline"}
        className={cn(status === 'Paid' && "bg-green-500")}
        >{status}</Badge>
    }
  },
  {
    accessorKey: "deploymentStatus",
    header: "Deployment Status",
    cell: ({ row }) => {
      const status = row.getValue("deploymentStatus") as string;
      return <Badge 
        variant={status === "Live" ? "default" : "secondary"}
        className={cn(
            status === 'Live' && "bg-green-500 hover:bg-green-500/80",
            status === 'Staging' && "bg-yellow-500 hover:bg-yellow-500/80"
        )}
        >{status}</Badge>
    }
  },
  {
    accessorKey: "reviewStatus",
    header: "Post-Delivery Review",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
        const project = row.original;
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
              <DropdownMenuItem onClick={() => onViewReport(project)}>
                View Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project)}>
                Edit Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
    },
  },
];
