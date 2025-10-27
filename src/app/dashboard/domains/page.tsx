
"use client";
import React from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "../components/data-table";
import { type Domain } from "@/types/domain";
import { columns as domainColumns } from "./components/columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const DomainForm = dynamic(() => import('./components/domain-form').then(mod => mod.DomainForm), { ssr: false });

export default function DomainsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const domainsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'domains') : null, [firestore]);
  const { data: domains } = useCollection<Domain>(domainsCollection);

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingDomain, setEditingDomain] = React.useState<Domain | undefined>(undefined);

  const handleAdd = () => {
    setEditingDomain(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain);
    setDialogOpen(true);
  };

  const handleSubmit = (values: Omit<Domain, 'id' | 'daysRemaining'>) => {
    if (!firestore) return;
    const isEditing = !!editingDomain;

    const newDomainData = {
        ...values,
        daysRemaining: Math.ceil((new Date(values.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    };

    if (isEditing) {
        const docRef = doc(firestore, 'domains', editingDomain.id);
        setDocumentNonBlocking(docRef, newDomainData, { merge: true });
        toast({
            title: "Domain Updated",
            description: `Domain "${values.domainName}" has been successfully updated.`,
        });
    } else {
        addDocumentNonBlocking(collection(firestore, 'domains'), newDomainData);
        toast({
            title: "Domain Added",
            description: `Domain "${values.domainName}" has been successfully added.`,
        });
    }
    setDialogOpen(false);
  };
  
  const handleExportCSV = () => {
    if (!domains) return;
    const headers = [
      "ID",
      "Domain Name",
      "Associated Project",
      "Registrar",
      "Expiration Date",
      "Days Remaining",
      "Auto-Renew",
      "SSL Expiry",
    ];

    const csvRows = [
      headers.join(","),
      ...domains.map((domain) =>
        [
          domain.id,
          domain.domainName,
          domain.associatedProject,
          domain.registrar,
          domain.expirationDate,
          domain.daysRemaining,
          domain.autoRenew,
          domain.sslExpiry,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "domains.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = domainColumns(handleEdit);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-start md:items-center">
            <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold">Domain Management</h1>
                <p className="text-muted-foreground text-sm">
                    Track your domain and SSL certificate expirations to prevent service interruptions.
                </p>
            </div>
            <Button onClick={handleAdd} className="shadow-sm">Add New Domain</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Registered Domains</CardTitle>
                <CardDescription>A list of all domains registered for your projects.</CardDescription>
            </div>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <DataTable columns={columns} data={domains || []} />
        </CardContent>
      </Card>
      {isDialogOpen && (
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{editingDomain ? 'Edit Domain' : 'Add New Domain'}</DialogTitle>
                <DialogDescription>
                    {editingDomain ? 'Update the details for this domain.' : 'Enter the details for the new domain.'}
                </DialogDescription>
            </DialogHeader>
            <DomainForm
                initialData={editingDomain}
                onSubmit={handleSubmit}
                setSheetOpen={setDialogOpen}
            />
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
}
