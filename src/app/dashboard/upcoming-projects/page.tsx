
"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./components/upcoming-projects-table";
import { type UpcomingProject, type OnDevelopmentProject } from "@/lib/data";
import { columns as upcomingColumns } from "./components/columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";

const UpcomingProjectForm = dynamic(() => import('./components/project-form').then(mod => mod.UpcomingProjectForm), { ssr: false });

export default function UpcomingProjectsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const upcomingProjectsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'upcomingProjects') : null, [firestore]);
  const { data: projects, isLoading } = useCollection<UpcomingProject>(upcomingProjectsCollection);

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<UpcomingProject | undefined>(undefined);
  
  const [isMoveConfirmOpen, setMoveConfirmOpen] = React.useState(false);
  const [projectToMove, setProjectToMove] = React.useState<string | null>(null);

  const handleAdd = () => {
    setEditingProject(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (project: UpcomingProject) => {
    setEditingProject(project);
    setDialogOpen(true);
  };
  
  const handleSubmit = async (values: Omit<UpcomingProject, 'id'>) => {
    if (!firestore) return;

    const isEditing = !!editingProject;

    if (isEditing) {
        const { onMove, ...projectData } = { ...editingProject, ...values };
        const docRef = doc(firestore, 'upcomingProjects', editingProject.id);
        setDocumentNonBlocking(docRef, projectData, { merge: true });
        
        toast({
            title: "Project Updated",
            description: `Project "${values.name}" has been successfully updated.`,
        });

    } else {
        addDocumentNonBlocking(collection(firestore, 'upcomingProjects'), values);

        toast({
            title: "Project Added",
            description: `Project "${values.name}" has been successfully added to the pipeline.`,
        });
    }
    setDialogOpen(false);
  };

  const handleMoveToOngoing = (projectId: string) => {
    setProjectToMove(projectId);
    setMoveConfirmOpen(true);
  }

  const confirmMoveToOngoing = async () => {
    if (!projectToMove || !firestore || !projects) return;

    const project = projects.find(p => p.id === projectToMove);
    if (!project) return;
    
    const newOnDevelopmentProject: OnDevelopmentProject = {
      id: project.id,
      name: project.name,
      manager: 'Unassigned',
      deadline: project.startDate, 
      health: "Green",
      progress: 0,
      priority: project.priority,
      details: {
        currentPhase: "Kick-off",
        timeSpent: 0,
        timeBudgeted: project.budget, 
        milestoneStatus: "Project Initialized",
        blockers: 0,
        assignedTeam: Array.isArray(project.requiredTeam) ? project.requiredTeam : [project.requiredTeam],
        statusNotes: "Project moved from upcoming to ongoing."
      }
    };
    
    const newDocRef = doc(firestore, 'onDevelopmentProjects', project.id);
    setDocumentNonBlocking(newDocRef, newOnDevelopmentProject, { merge: false });
    
    const oldDocRef = doc(firestore, 'upcomingProjects', project.id);
    deleteDocumentNonBlocking(oldDocRef);

    setMoveConfirmOpen(false);
    setProjectToMove(null);
    toast({
      title: "Project Moved",
      description: `"${project.name}" has been moved to Ongoing Projects.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Upcoming Projects</h1>
          <p className="text-muted-foreground">This section focuses on projects in the planning, discovery, or proposal phase.</p>
        </div>
        <Button onClick={handleAdd}>Add Project</Button>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Project Pipeline</CardTitle>
           <p className="text-muted-foreground">
            This section focuses on projects in the planning, discovery, or proposal phase.
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={upcomingColumns(handleEdit, handleMoveToOngoing)} data={(projects || []).map(p => ({...p, onMove: handleMoveToOngoing}))} />
        </CardContent>
      </Card>

      {isDialogOpen && (
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Upcoming Project' : 'Add New Upcoming Project'}</DialogTitle>
                <DialogDescription>
                    {editingProject ? 'Update the details for this project.' : 'Fill in the details for the new project to add it to the pipeline.'}
                </DialogDescription>
            </DialogHeader>
            <UpcomingProjectForm
                initialData={editingProject}
                onSubmit={handleSubmit}
                setSheetOpen={setDialogOpen}
            />
        </DialogContent>
      </Dialog>
      )}
      {isMoveConfirmOpen && (
      <AlertDialog open={isMoveConfirmOpen} onOpenChange={setMoveConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Move Project to Ongoing?</AlertDialogTitle>
            <AlertDialogDescription>
                This will move the project from the pipeline to active development. Are you sure?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToMove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMoveToOngoing}>Proceed</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
      )}
    </div>
  );
}
