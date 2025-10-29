
"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, ChevronDown, ChevronRight, Minus, Rocket, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UpcomingProject } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RenderSubComponentProps = {
    row: any;
};

export const columns = (onEdit: (project: UpcomingProject) => void, onMove: (projectId: string) => void): ColumnDef<UpcomingProject & { onMove: (id: string) => void }>[] => [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
          className="flex items-center"
        >
          {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      ) : (
        <Minus className="h-4 w-4 text-muted-foreground/50"/>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Project Name",
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return <Badge variant={priority === "Critical" || priority === "High" ? "destructive" : priority === "Medium" ? "secondary" : "outline"}
        className={cn(priority === 'Critical' && 'bg-red-700 text-white')}
      >{priority}</Badge>
    }
  },
  {
    accessorKey: "startDate",
    header: "Proposed Start Date",
  },
  {
    accessorKey: "status",
    header: "Current Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
                <Edit className="h-4 w-4" />
            </Button>
        </div>
      );
    },
  },
];


export const renderSubComponent = ({ row }: RenderSubComponentProps) => {
    const project = row.original as UpcomingProject & { onMove: (id: string) => void };
    const onMoveClick = () => {
        project.onMove(project.id);
    }
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "NPR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card className="bg-muted/50 border-none rounded-none">
            <CardContent className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                 <div className="space-y-1 col-span-2 lg:col-span-4">
                    <p className="text-xs font-semibold text-muted-foreground">BUSINESS VALUE/GOAL</p>
                    <p className="text-sm italic text-muted-foreground">{project.businessValue}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">CLIENT/STAKEHOLDER</p>
                    <p className="text-sm">{project.client}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">ESTIMATED BUDGET</p>
                    <p className="text-sm">{formatCurrency(project.budget)}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">ESTIMATED DURATION/EFFORT</p>
                    <p className="text-sm">{project.duration}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">REQUIRED TEAM/SKILLS</p>
                    <div className="flex flex-wrap gap-1">
                        {Array.isArray(project.requiredTeam) ? (
                            project.requiredTeam.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)
                        ) : (
                            <Badge variant="secondary">{project.requiredTeam}</Badge>
                        )}
                    </div>
                </div>
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">PROPOSAL/SOW</p>
                    <div>
                        <Link href={project.proposalLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">View Document</Link>
                    </div>
                </div>
                 <div className="col-span-full flex justify-end pt-2">
                    <Button onClick={onMoveClick}>
                        Move to Ongoing
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
