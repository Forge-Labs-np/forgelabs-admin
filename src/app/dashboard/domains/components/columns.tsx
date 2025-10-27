
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Domain } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const columns = (onEdit: (domain: Domain) => void): ColumnDef<Domain>[] => [
  {
    accessorKey: "domainName",
    header: "Domain Name",
    cell: ({ row }) => {
        const domainName = row.getValue("domainName") as string;
        return (
            <Link href={`https://${domainName}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {domainName}
            </Link>
        )
    }
  },
  {
    accessorKey: "associatedProject",
    header: "Associated Project",
  },
  {
    accessorKey: "registrar",
    header: "Registrar",
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expiration Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "daysRemaining",
    header: "Days Remaining",
     cell: ({ row }) => {
        const days = row.original.daysRemaining;
        return <span className={cn(
            days < 30 && 'text-red-500 font-bold', 
            days >= 30 && days <= 90 && 'text-yellow-500 font-semibold'
        )}>{days}</span>
    }
  },
  {
    accessorKey: "autoRenew",
    header: "Auto-Renew",
    cell: ({ row }) => {
        const status:string = row.getValue("autoRenew");
        return <Badge className={cn(
            "text-white",
            status === 'On' ? "bg-green-500 hover:bg-green-500" : "bg-gray-400 hover:bg-gray-400"
        )}>{status}</Badge>
    }
  },
  {
    accessorKey: "sslExpiry",
    header: "SSL Certificate Expiry",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const domain = row.original;
      return (
        <Button variant="ghost" size="icon" onClick={() => onEdit(domain)}>
          <Edit className="h-4 w-4" />
        </Button>
      );
    },
  },
];
