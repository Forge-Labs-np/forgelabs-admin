
"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "../components/data-table";
import { type UpcomingProject } from "@/lib/data";
import { type OperationalBudget } from "@/types/budget";
import { columns as budgetTableColumns, type BudgetItem } from "./components/columns";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { StatCard } from "../components/stat-card";
import { Banknote, ListTodo, Plus, ChevronDown, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const OperationalBudgetForm = dynamic(() => import('./components/operational-budget-form').then(mod => mod.OperationalBudgetForm), { ssr: false });

export default function BudgetPage() {
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const upcomingProjectsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'upcomingProjects') : null, [firestore]);
    const { data: upcomingProjects } = useCollection<UpcomingProject>(upcomingProjectsCollection);

    const operationalBudgetsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'operationalBudgets') : null, [firestore]);
    const { data: operationalBudgets } = useCollection<OperationalBudget>(operationalBudgetsCollection);

    const [isDialogOpen, setDialogOpen] = React.useState(false);

    const upcomingProjectsBudget = upcomingProjects?.reduce((acc, project) => acc + project.budget, 0) || 0;
    const operationalBudget = operationalBudgets?.reduce((acc, budget) => acc + budget.amount, 0) || 0;
    const totalBudget = upcomingProjectsBudget + operationalBudget;

    const formatCurrency = (amount: number) => `NPR. ${amount.toLocaleString('en-IN')}`;

    const handleAddUpcoming = () => {
        router.push('/dashboard/upcoming-projects');
    };
    
    const handleAddOperational = () => {
        setDialogOpen(true);
    };

    const handleOperationalSubmit = (values: Omit<OperationalBudget, 'id'>) => {
        if (!firestore) return;
        addDocumentNonBlocking(collection(firestore, 'operationalBudgets'), values);
        toast({
            title: "Operational Budget Added",
            description: `Budget for "${values.name}" has been successfully added.`,
        });
        setDialogOpen(false);
    }
    
    const combinedBudgets = React.useMemo((): BudgetItem[] => {
        const projectBudgets: BudgetItem[] = (upcomingProjects || []).map(p => ({
            id: p.id,
            name: p.name,
            type: 'Project',
            amount: p.budget,
            details: p.client,
            date: p.startDate,
        }));

        const opBudgets: BudgetItem[] = (operationalBudgets || []).map(b => ({
            id: b.id,
            name: b.name,
            type: 'Operational',
            amount: b.amount,
            details: b.category,
            date: b.date,
        }));
        
        return [...projectBudgets, ...opBudgets];
    }, [upcomingProjects, operationalBudgets]);

  const handleExportCSV = () => {
    if (!combinedBudgets) return;
    const headers = [
      "ID",
      "Budget Name",
      "Budget Type",
      "Amount (NPR)",
      "Client / Category",
      "Date",
    ];

    const csvRows = [
      headers.join(","),
      ...combinedBudgets.map((item) =>
        [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`,
          item.type,
          item.amount,
          `"${item.details.replace(/"/g, '""')}"`,
          item.date,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "budgets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-start md:items-center">
            <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold">Budget</h1>
                <p className="text-muted-foreground text-sm">
                    Monitor and manage your project and operational budgets.
                </p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Budget
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleAddUpcoming}>
                        Upcoming Project Budget
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleAddOperational}>
                        Operational Budget
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
             <StatCard
                title="Total Budget"
                value={formatCurrency(totalBudget)}
                description="Upcoming project budgets plus operational costs."
            />
             <StatCard
                title="Upcoming Projects Budget"
                value={formatCurrency(upcomingProjectsBudget)}
                icon={ListTodo}
                description="Total budget allocated for all upcoming projects."
            />
            <StatCard
                title="Operational Budget"
                value={formatCurrency(operationalBudget)}
                icon={Banknote}
                description="Budget for non-project related expenses."
            />
        </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Project Budget Table</CardTitle>
                        <CardDescription>
                            A unified list of all project and operational budgets.
                        </CardDescription>
                    </div>
                     <Button variant="outline" onClick={handleExportCSV} disabled={!combinedBudgets || combinedBudgets.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable columns={budgetTableColumns} data={combinedBudgets} />
            </CardContent>
        </Card>
        {isDialogOpen && (
         <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Operational Budget</DialogTitle>
                    <DialogDescription>
                        Enter the details for a non-project related budget item.
                    </DialogDescription>
                </DialogHeader>
                <OperationalBudgetForm
                    onSubmit={handleOperationalSubmit}
                    setSheetOpen={setDialogOpen}
                />
            </DialogContent>
         </Dialog>
        )}
    </div>
  );
}
