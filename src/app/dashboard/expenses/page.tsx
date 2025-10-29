
"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "../components/data-table";
import { type Expense } from "@/types/expense";
import { columns as expenseColumns } from "./components/columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase, useUser, addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const ExpenseForm = dynamic(() => import('./components/expense-form').then(mod => mod.ExpenseForm), { ssr: false });

export default function ExpensesPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const expensesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'expenses') : null, [firestore]);
  const { data: expenses } = useCollection<Expense>(expensesCollection);

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Expense | undefined>(undefined);
  const [expenseToDelete, setExpenseToDelete] = React.useState<Expense | null>(null);

  const handleAdd = () => {
    setEditingExpense(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (expense: Expense) => {
    setExpenseToDelete(expense);
  };

  const confirmDelete = () => {
    if (!firestore || !expenseToDelete || !user) return;
    
    // 1. Create the log entry
    const logData = {
      ...expenseToDelete,
      deletedBy: user.displayName || user.email,
      deletedAt: new Date().toISOString(),
    };
    addDocumentNonBlocking(collection(firestore, 'deletedExpenses'), logData);

    // 2. Delete the original document
    const docRef = doc(firestore, 'expenses', expenseToDelete.id);
    deleteDocumentNonBlocking(docRef);

    toast({
      title: "Expense Deleted",
      description: "The expense has been successfully deleted.",
    });

    setExpenseToDelete(null); // Close the dialog
  };

  const handleSubmit = (values: Omit<Expense, 'id'>) => {
    if (!firestore) return;
    const isEditing = !!editingExpense;

    if (isEditing) {
        const docRef = doc(firestore, 'expenses', editingExpense.id);
        // Only update the description
        setDocumentNonBlocking(docRef, { description: values.description }, { merge: true });
        toast({
            title: "Expense Updated",
            description: "The expense description has been successfully updated.",
        });
    } else {
        addDocumentNonBlocking(collection(firestore, 'expenses'), values);
        toast({
            title: "Expense Added",
            description: "The expense has been successfully added.",
        });
    }
    setDialogOpen(false);
  };
  
  const columns = expenseColumns(handleEdit, handleDeleteRequest);

  const totalExpenses = expenses?.reduce((acc, expense) => acc + expense.amount, 0) || 0;
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "NPR",
  }).format(totalExpenses);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start md:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground text-sm">
            Track and manage your project and operational expenses.
          </p>
        </div>
        <Button onClick={handleAdd}>Add New Expense</Button>
      </div>
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Expense Records</CardTitle>
                    <CardDescription>A list of all your recorded expenses.</CardDescription>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold">{formattedTotal}</p>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={expenses || []} />
        </CardContent>
      </Card>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                  <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
                  <DialogDescription>
                      {editingExpense ? 'Update the description for this expense.' : 'Enter the details for the new expense.'}
                  </DialogDescription>
              </DialogHeader>
              {!editingExpense && (
                <Alert className="bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-300 [&>svg]:text-red-500 dark:[&>svg]:text-red-300">
                  <Info className="h-4 w-4 text-red-500" />
                  <AlertDescription>
                    Once an expense is added, only the description can be edited. Please ensure all other details are correct.
                  </AlertDescription>
                </Alert>
              )}
              <ExpenseForm
                  initialData={editingExpense}
                  onSubmit={handleSubmit}
                  setSheetOpen={setDialogOpen}
              />
          </DialogContent>
        </Dialog>
      )}
       <AlertDialog open={!!expenseToDelete} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
