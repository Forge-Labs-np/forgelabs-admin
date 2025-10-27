
"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable as OnDevelopmentTable } from "./components/on-development-table";
import { DataTable as CompletedTable } from "../components/data-table";
import { columns as onDevelopmentColumns } from "./components/on-development-columns";
import { columns as completedColumns } from "./components/completed-columns";
import { type OnDevelopmentProject, type CompletedProject } from "@/lib/data";
import { format } from "date-fns";
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

const EditProjectForm = dynamic(() => import('./components/edit-project-form').then(mod => mod.EditProjectForm), { ssr: false });
const ProjectReportDialog = dynamic(() => import('./components/project-report-dialog').then(mod => mod.ProjectReportDialog), { ssr: false });
const EditCompletedProjectForm = dynamic(() => import('./components/edit-completed-project-form').then(mod => mod.EditCompletedProjectForm), { ssr: false });


export default function OngoingProjectsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const onDevCollection = useMemoFirebase(() => firestore ? collection(firestore, 'onDevelopmentProjects') : null, [firestore]);
  const { data: onDevelopment } = useCollection<OnDevelopmentProject>(onDevCollection);

  const completedCollection = useMemoFirebase(() => firestore ? collection(firestore, 'completedProjects') : null, [firestore]);
  const { data: completed } = useCollection<CompletedProject>(completedCollection);


  const [isDevDialogOpen, setDevDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<OnDevelopmentProject | undefined>(undefined);
  
  const [isConfirmCompleteOpen, setConfirmCompleteOpen] = React.useState(false);
  const [projectToComplete, setProjectToComplete] = React.useState<string | null>(null);

  const [isReportDialogOpen, setReportDialogOpen] = React.useState(false);
  const [selectedCompletedProject, setSelectedCompletedProject] = React.useState<CompletedProject | undefined>(undefined);

  const [isCompletedDialogOpen, setCompletedDialogOpen] = React.useState(false);
  const [editingCompletedProject, setEditingCompletedProject] = React.useState<CompletedProject | undefined>(undefined);


  const handleEdit = (project: OnDevelopmentProject) => {
    setEditingProject(project);
    setDevDialogOpen(true);
  };
  
  const handleUpdateProject = (updatedProject: OnDevelopmentProject) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'onDevelopmentProjects', updatedProject.id);
    setDocumentNonBlocking(docRef, updatedProject, { merge: true });
    setDevDialogOpen(false);
    toast({
      title: "Project Updated",
      description: `Project "${updatedProject.name}" has been successfully updated.`,
    });
  };

  const handleUpdateProjectName = (projectId: string, newName: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'onDevelopmentProjects', projectId);
    setDocumentNonBlocking(docRef, { name: newName }, { merge: true });
    
    if (editingProject?.id === projectId) {
      setEditingProject(p => p ? { ...p, name: newName } : undefined);
    }
    toast({
      title: "Project Name Updated",
      description: `The project name has been successfully changed to "${newName}".`,
    });
  };

  const handleUpdateDeadline = (projectId: string, newDeadline: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'onDevelopmentProjects', projectId);
    setDocumentNonBlocking(docRef, { deadline: newDeadline }, { merge: true });

    if (editingProject?.id === projectId) {
      setEditingProject(p => p ? { ...p, deadline: newDeadline } : undefined);
    }
    toast({
      title: "Deadline Updated",
      description: `The project deadline has been successfully changed.`,
    });
  }

  const handleUpdateTimeBudgeted = (projectId: string, newTimeBudgeted: number) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'onDevelopmentProjects', projectId);
    setDocumentNonBlocking(docRef, { "details.timeBudgeted": newTimeBudgeted }, { merge: true });
    
    if (editingProject?.id === projectId) {
      setEditingProject(p => p ? { ...p, details: { ...p.details, timeBudgeted: newTimeBudgeted } } : undefined);
    }
     toast({
      title: "Time Budget Updated",
      description: `The budgeted time has been successfully changed.`,
    });
  }

  const confirmCompleteProject = async () => {
    if (!firestore || !projectToComplete || !onDevelopment) return;

    const projectToMove = onDevelopment.find(p => p.id === projectToComplete);
    if (!projectToMove) return;

    const completedData: CompletedProject = {
        id: projectToMove.id,
        name: projectToMove.name,
        manager: projectToMove.manager,
        completionDate: format(new Date(), "yyyy-MM-dd"),
        finalDeliveryDate: format(new Date(), "yyyy-MM-dd"),
        billingStatus: "Pending",
        deploymentStatus: "Staging",
        reviewStatus: "Scheduled",
    };

    const newCompletedDocRef = doc(firestore, 'completedProjects', projectToMove.id);
    setDocumentNonBlocking(newCompletedDocRef, completedData, { merge: false });

    const oldDocRef = doc(firestore, 'onDevelopmentProjects', projectToMove.id);
    deleteDocumentNonBlocking(oldDocRef);

    setConfirmCompleteOpen(false);
    setProjectToComplete(null);
    setDevDialogOpen(false);
  };

  const handleMarkAsCompleted = (projectId: string) => {
      setProjectToComplete(projectId);
      setConfirmCompleteOpen(true);
  }

  const handleViewReport = (project: CompletedProject) => {
    setSelectedCompletedProject(project);
    setReportDialogOpen(true);
  }
  
  const handleEditCompleted = (project: CompletedProject) => {
    setEditingCompletedProject(project);
    setCompletedDialogOpen(true);
  }

  const handleUpdateCompletedProject = (updatedProject: CompletedProject) => {
    if(!firestore) return;
    const docRef = doc(firestore, 'completedProjects', updatedProject.id);
    setDocumentNonBlocking(docRef, updatedProject, { merge: true });
    setCompletedDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Ongoing Projects</h1>
          <p className="text-muted-foreground">The central hub for detailed project tracking.</p>
        </div>
      </div>

      <Tabs defaultValue="active-work">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="active-work">Active Work</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active-work" className="mt-4">
            <OnDevelopmentTable columns={onDevelopmentColumns(handleEdit)} data={(onDevelopment || []).map(p => ({...p, onMarkAsCompleted: handleMarkAsCompleted}))} />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
            <CompletedTable columns={completedColumns(handleViewReport, handleEditCompleted)} data={completed || []} />
        </TabsContent>
      </Tabs>
      {isDevDialogOpen && (
      <Dialog open={isDevDialogOpen} onOpenChange={setDevDialogOpen}>
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Project Details</DialogTitle>
            <DialogDescription>Make changes to an active project. Select a field to modify its value.</DialogDescription>
          </DialogHeader>
          <EditProjectForm
            initialData={editingProject}
            onNameChange={handleUpdateProjectName}
            onDeadlineChange={handleUpdateDeadline}
            onTimeBudgetedChange={handleUpdateTimeBudgeted}
            onSubmit={handleUpdateProject}
            onMarkAsCompleted={handleMarkAsCompleted}
            setSheetOpen={setDevDialogOpen}
          />
        </DialogContent>
      </Dialog>
      )}
      {isConfirmCompleteOpen && (
      <AlertDialog open={isConfirmCompleteOpen} onOpenChange={setConfirmCompleteOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Congratulations on Completing the Project!</AlertDialogTitle>
            <AlertDialogDescription>
                Moving this project to the "Completed" section will finalize its active status. Are you sure you want to proceed?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToComplete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompleteProject}>Proceed</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )}
    {isReportDialogOpen && (
    <ProjectReportDialog 
        isOpen={isReportDialogOpen}
        onOpenChange={setReportDialogOpen}
        project={selectedCompletedProject}
    />
    )}
    {isCompletedDialogOpen && (
     <Dialog open={isCompletedDialogOpen} onOpenChange={setCompletedDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Completed Project</DialogTitle>
            <DialogDescription>Update the details of a completed project.</DialogDescription>
          </DialogHeader>
          <EditCompletedProjectForm
            initialData={editingCompletedProject}
            onSubmit={handleUpdateCompletedProject}
            setSheetOpen={setCompletedDialogOpen}
          />
        </DialogContent>
      </Dialog>
    )}
    </div>
  );
}
