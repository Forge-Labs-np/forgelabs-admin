
"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  type ExpandedState,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { renderSubComponent } from "./on-development-columns";
import type { OnDevelopmentProject } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";


interface DataTableProps<TData extends OnDevelopmentProject, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends OnDevelopmentProject, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      expanded,
      columnFilters,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Active Work</CardTitle>
                <p className="text-muted-foreground">
                    This section tracks active, in-progress work. Click the arrow to see details.
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg border-primary/10">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-primary/10 bg-primary/5 hover:bg-primary/10">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                    const project = row.original;
                    const isOverBudget = project.details.timeSpent > project.details.timeBudgeted;
                    return (
                        <React.Fragment key={row.id}>
                            <TableRow
                            data-state={row.getIsSelected() && "selected"}
                            className={cn("border-b border-primary/10", isOverBudget && "border-l-4 border-l-red-500/70")}
                            >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                            </TableRow>
                            {row.getIsExpanded() && (
                                <TableRow className={cn("border-primary/10 hover:bg-muted/50", isOverBudget && "border-l-4 border-l-red-500/70")}>
                                    <TableCell colSpan={columns.length}>
                                        {renderSubComponent({row})}
                                    </TableCell>
                                </TableRow>
                            )}
                    </React.Fragment>
                    )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
