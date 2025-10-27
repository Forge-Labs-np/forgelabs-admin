
"use client";
import React from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "../components/data-table";
import { type Client } from "@/types/client";
import { columns as clientColumns } from "./components/columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const ClientForm = dynamic(() => import('../components/client-form').then(mod => mod.ClientForm), { ssr: false });

export default function ClientsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const clientsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'clients') : null, [firestore]);
  const { data: clients, isLoading } = useCollection<Client>(clientsCollection);

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | undefined>(undefined);

  const handleAdd = () => {
    setEditingClient(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };
  
  const handleDelete = (client: Client) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'clients', client.id);
    deleteDocumentNonBlocking(docRef);
    toast({
        title: "Client Deleted",
        description: `Client "${client.name}" has been successfully deleted.`,
    });
  }

  const handleSubmit = (values: Omit<Client, 'id' | 'status'>) => {
    if (!firestore) return;
    const isEditing = !!editingClient;

    if (isEditing) {
        const docRef = doc(firestore, 'clients', editingClient.id);
        setDocumentNonBlocking(docRef, values, { merge: true });
        toast({
            title: "Client Updated",
            description: `Client "${values.name}" has been successfully updated.`,
        });
    } else {
        const newClient = {
            status: "ACTIVE",
            ...values,
        };
        addDocumentNonBlocking(collection(firestore, 'clients'), newClient);
        toast({
            title: "Client Added",
            description: `Client "${values.name}" has been successfully added.`,
        });
    }
    setDialogOpen(false);
  };
  
  const columns = clientColumns(handleEdit, handleDelete);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-start md:items-center">
            <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold">Client Management</h1>
                <p className="text-muted-foreground text-sm">
                    View, add, and manage your client information.
                </p>
            </div>
            <Button onClick={handleAdd} className="shadow-sm">Add New Client</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Clients</CardTitle>
          <CardDescription>A list of all clients in your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
            <DataTable columns={columns} data={clients || []} />
        </CardContent>
      </Card>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                  <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
                  <DialogDescription>
                      {editingClient ? 'Update the details for this client.' : 'Enter the details for the new client.'}
                  </DialogDescription>
              </DialogHeader>
              <ClientForm
                  initialData={editingClient}
                  onSubmit={handleSubmit}
                  setSheetOpen={setDialogOpen}
              />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
