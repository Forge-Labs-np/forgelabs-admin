
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Server } from "@/types/server";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export const columns = (onEdit: (server: Server) => void, onDelete: (server: Server) => void): ColumnDef<Server>[] => [
  {
    accessorKey: "name",
    header: "Server Name",
    cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("name")}</span>
    }
  },
  {
    accessorKey: "host",
    header: "Host",
  },
  {
    accessorKey: "cpu",
    header: "Allocated CPU",
  },
  {
    accessorKey: "ram",
    header: "Allocated RAM",
  },
  {
    accessorKey: "clientId",
    header: "Client ID",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const server = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(server)}>
                <Edit className="mr-2 h-4 w-4"/>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(server)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4"/>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      );
    },
  },
];

    