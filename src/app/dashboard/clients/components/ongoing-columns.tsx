
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OngoingProject } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HealthIndicator = ({ status }: { status: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full", 
        status === 'Green' ? 'bg-green-500' :
        status === 'Yellow' ? 'bg-yellow-500' :
        'bg-red-500'
      )}></div>
      <span>{status}</span>
    </div>
  );
};


export const columns = (onEdit: (project: OngoingProject) => void): ColumnDef<OngoingProject>[] => [
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => <Link href="#" className="font-medium text-primary hover:underline">{row.getValue("name")}</Link>
  },
  {
    accessorKey: "manager",
    header: "Project Manager",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("status")}</Badge>
  },
  {
    accessorKey: "health",
    header: "Health",
    cell: ({ row }) => <HealthIndicator status={row.getValue("health")} />
  },
  {
    accessorKey: "progress",
    header: "Progress %",
    cell: ({ row }) => <div className="flex items-center gap-2"><Progress value={row.getValue("progress")} className="w-24 h-2" /> <span>{row.getValue("progress")}%</span></div>
  },
  {
    accessorKey: "timeRemaining",
    header: "Time Remaining",
  },
  {
    accessorKey: "budgetBurn",
    header: "Budget Burn Rate",
    cell: ({ row }) => <span>{row.getValue("budgetBurn")}%</span>,
  },
  {
    accessorKey: "openBugs",
    header: "Open Bugs",
    cell: ({ row }) => {
        const bugs = row.getValue("openBugs") as number;
        return <span className={cn(bugs > 5 && 'text-red-500 font-bold')}>{bugs}</span>
    }
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
