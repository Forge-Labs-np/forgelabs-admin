
"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "../components/data-table";
import { columns } from "./components/columns";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { Server } from "@/types/server";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const ServerForm = dynamic(() => import('./components/server-form').then(mod => mod.ServerForm), { ssr: false });

export default function ServersPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const serversCollection = useMemoFirebase(() => firestore ? collection(firestore, 'servers') : null, [firestore]);
  const { data: servers, isLoading } = useCollection<Server>(serversCollection);

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingServer, setEditingServer] = React.useState<Server | undefined>(undefined);

  const handleAdd = () => {
    setEditingServer(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (server: Server) => {
    setEditingServer(server);
    setDialogOpen(true);
  };

  const handleDelete = (server: Server) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'servers', server.id);
    deleteDocumentNonBlocking(docRef);
    toast({
        title: "Server Deleted",
        description: `Server "${server.name}" has been successfully deleted.`,
    });
  };

  const handleSubmit = (values: Omit<Server, 'id'>) => {
    if (!firestore) return;
    const isEditing = !!editingServer;

    if (isEditing) {
        const docRef = doc(firestore, 'servers', editingServer.id);
        setDocumentNonBlocking(docRef, values, { merge: true });
        toast({
            title: "Server Updated",
            description: `Server "${values.name}" has been successfully updated.`,
        });
    } else {
        addDocumentNonBlocking(collection(firestore, 'servers'), values);
        toast({
            title: "Server Added",
            description: `Server "${values.name}" has been successfully added.`,
        });
    }
    setDialogOpen(false);
  };

  const serverColumns = columns(handleEdit, handleDelete);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold">Server Inventory</h1>
            <p className="text-muted-foreground">A record of all provisioned servers and their assignments.</p>
        </div>
        <Button onClick={handleAdd}>Add New Server</Button>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Server Records</CardTitle>
            <CardDescription>This table provides a documented history of your server assets.</CardDescription>
        </CardHeader>
        <CardContent>
            <DataTable columns={serverColumns} data={servers || []} />
        </CardContent>
      </Card>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingServer ? 'Edit Server' : 'Add New Server'}</DialogTitle>
                    <DialogDescription>
                        {editingServer ? 'Update the details for this server.' : 'Enter the details for the new server.'}
                    </DialogDescription>
                </DialogHeader>
                <ServerForm
                    initialData={editingServer}
                    onSubmit={handleSubmit}
                    setSheetOpen={setDialogOpen}
                />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
