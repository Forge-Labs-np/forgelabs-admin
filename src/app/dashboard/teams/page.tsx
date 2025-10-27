
"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "../components/data-table";
import { columns } from "./components/columns";
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
import { collection, doc } from "firebase/firestore";
import type { Technician } from "@/types/team";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const TeamMemberForm = dynamic(() => import('./components/team-member-form').then(mod => mod.TeamMemberForm), { ssr: false });

export default function TeamsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const techniciansCollection = useMemoFirebase(() => firestore ? collection(firestore, 'technicians') : null, [firestore]);
  const { data: teamMembers } = useCollection<Technician>(techniciansCollection);

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<Technician | undefined>(undefined);

  const handleAdd = () => {
    setEditingMember(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (member: Technician) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDelete = (member: Technician) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'technicians', member.id);
    deleteDocumentNonBlocking(docRef);
    toast({
        title: "Team Member Deleted",
        description: `Details for ${member.name} have been successfully deleted.`,
    });
  }

  const handleSubmit = (values: Omit<Technician, 'id'>) => {
    if (!firestore) return;
    const isEditing = !!editingMember;

    if (isEditing) {
        const docRef = doc(firestore, 'technicians', editingMember.id);
        setDocumentNonBlocking(docRef, values, { merge: true });
        toast({
            title: "Team Member Updated",
            description: `Details for ${values.name} have been successfully updated.`,
        });
    } else {
        addDocumentNonBlocking(collection(firestore, 'technicians'), values);
        toast({
            title: "Team Member Added",
            description: `${values.name} has been successfully added to the team.`,
        });
    }
    setDialogOpen(false);
  };

  const teamColumns = columns(handleEdit, handleDelete);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start md:items-center">
        <div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold">Team</h1>
            <p className="text-muted-foreground">
            A directory of team members and their primary contact information.
            </p>
        </div>
        <Button onClick={handleAdd}>Add New Team Member</Button>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>A list of all team members in your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
            <DataTable columns={teamColumns} data={teamMembers || []} />
        </CardContent>
      </Card>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                    <DialogDescription>
                        {editingMember ? 'Update the details for this team member.' : 'Enter the details for the new team member.'}
                    </DialogDescription>
                </DialogHeader>
                <TeamMemberForm
                    initialData={editingMember}
                    onSubmit={handleSubmit}
                    setSheetOpen={setDialogOpen}
                />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
