
"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { Users, FolderKanban, Briefcase, Banknote } from "lucide-react";
import { StatCard } from "./components/stat-card";
import { RecentClients } from "./components/recent-clients";
import { type UpcomingProject } from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Client } from "@/types/client";
import { OnDevelopmentProject } from "@/lib/data";
import { Technician } from "@/types/team";

const ClientGrowthChart = dynamic(() => import('./components/client-growth-chart').then(mod => mod.ClientGrowthChart), { ssr: false });

export default function DashboardPage() {
    const firestore = useFirestore();

    const clientsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'clients') : null, [firestore]);
    const { data: clients } = useCollection<Client>(clientsCollection);

    const upcomingProjectsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'upcomingProjects') : null, [firestore]);
    const { data: upcomingProjects } = useCollection<UpcomingProject>(upcomingProjectsCollection);

    const onDevelopmentProjectsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'onDevelopmentProjects') : null, [firestore]);
    const { data: onDevelopmentProjects } = useCollection<OnDevelopmentProject>(onDevelopmentProjectsCollection);
    
    const techniciansCollection = useMemoFirebase(() => firestore ? collection(firestore, 'technicians') : null, [firestore]);
    const { data: teamMembers } = useCollection<Technician>(techniciansCollection);


    const totalClients = clients?.length || 0;
    const activeProjects = onDevelopmentProjects?.length || 0;
    const totalTeamMembers = teamMembers?.length || 0;
    
    const upcomingBudgetNPR = upcomingProjects?.reduce((acc, project) => acc + project.budget, 0) || 0;

    const budgetDisplay = `NPR. ${upcomingBudgetNPR.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">A high-level summary of critical metrics across projects and infrastructure.</p>
            </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total Clients"
                value={totalClients.toString()}
                icon={Users}
                description="The total number of clients managed."
            />
            <StatCard 
                title="Active Projects"
                value={activeProjects.toString()}
                icon={FolderKanban}
                description="Number of projects currently in development."
            />
            <StatCard 
                title="Team Members"
                value={totalTeamMembers.toString()}
                icon={Briefcase}
                description="Total number of team members."
            />
             <StatCard 
                title="BUDGET"
                value={budgetDisplay}
                icon={Banknote}
                description="Total budget for upcoming projects"
            />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
           <ClientGrowthChart />
           <RecentClients />
        </div>
    </div>
  );
}
