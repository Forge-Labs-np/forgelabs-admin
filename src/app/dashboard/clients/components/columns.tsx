
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
import { Badge } from "@/components/ui/badge";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "capitalize border-none";
  let variantClasses = "";
  let dotClasses = "mr-2 h-2 w-2 rounded-full";

  switch (status) {
    case 'ACTIVE':
      variantClasses = "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/40";
      dotClasses += " bg-green-500";
      break;
    case 'FINISHED':
      variantClasses = "bg-gray-100 text-gray-800 hover:bg-gray-100";
      dotClasses += " bg-gray-500";
      break;
    default:
       variantClasses = "bg-gray-100 text-gray-800 hover:bg-gray-100";
       dotClasses += " bg-gray-500";
  }

  return (
    <Badge className={cn(baseClasses, variantClasses)}>
      <div className={dotClasses}></div>
      {status.toLowerCase()}
    </Badge>
  );
};


export const columns = (onEdit: (client: Client) => void, onDelete: (client: Client) => void): ColumnDef<Client>[] => [
    {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => <div className="text-muted-foreground">{String(row.index + 1).padStart(2, '0')}</div>,
    },
  {
    accessorKey: "name",
    header: "Client Name",
    cell: ({ row }) => <div className="font-bold">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
    {
    accessorKey: "phone",
    header: "Phone",
  },
    {
    accessorKey: "status",
    header: "Contract",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const client = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(client)}>
                <Edit className="mr-2 h-4 w-4"/>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(client)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4"/>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      );
    },
  },
];
