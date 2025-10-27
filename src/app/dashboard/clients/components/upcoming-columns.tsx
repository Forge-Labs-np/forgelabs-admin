
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UpcomingProject } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const columns = (onEdit: (project: UpcomingProject) => void): ColumnDef<UpcomingProject>[] => [
  {
    accessorKey: "name",
    header: "Project Name",
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return <Badge variant={priority === "High" ? "destructive" : priority === "Medium" ? "secondary" : "outline"}>{priority}</Badge>
    }
  },
  {
    accessorKey: "startDate",
    header: "Proposed Start Date",
  },
  {
    accessorKey: "duration",
    header: "Estimated Duration/Effort",
  },
  {
    accessorKey: "requiredTeam",
    header: "Required Team/Skills",
  },
  {
    accessorKey: "status",
    header: "Current Status in Planning",
  },
  {
    accessorKey: "proposalLink",
    header: "Proposal/SOW",
    cell: () => <Link href="#" className="text-primary underline">View</Link>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
          <Edit className="h-4 w-4" />
        </Button>
      );
    },
  },
];
