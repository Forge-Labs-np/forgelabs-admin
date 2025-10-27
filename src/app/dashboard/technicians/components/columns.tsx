"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Technician } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const columns: ColumnDef<Technician>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const technician = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{technician.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "ticketsOpen",
    header: "Open Tickets",
  },
  {
    accessorKey: "ticketsClosed",
    header: "Closed Tickets",
  },
  {
    accessorKey: "id",
    header: "Technician ID",
  },
];
