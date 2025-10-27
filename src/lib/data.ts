
import { type LucideIcon, User, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

// --- DASHBOARD ---
// (Already in dashboard page)

// --- PROJECTS ---
export type UpcomingProject = {
  id: string;
  name: string;
  client: string;
  businessValue: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  startDate: string;
  duration: string;
  budget: number;
  requiredTeam: string[];
  status: "Idea/Intake" | "Discovery In Progress" | "Proposal Sent" | "Awaiting Funding/Approval";
  proposalLink: string;
};

export type OnDevelopmentProject = {
    id: string;
    name: string;
    manager: string;
    deadline: string;
    health: "Green" | "Yellow" | "Red";
    progress: number;
    priority: "High" | "Medium" | "Low";
    details: {
        currentPhase: string;
        timeSpent: number;
        timeBudgeted: number;
        milestoneStatus: string;
        blockers: number;
        assignedTeam: string[];
        statusNotes: string;
    }
};


export type CompletedProject = {
    id: string;
    name: string;
    manager: string;
    completionDate: string;
    finalDeliveryDate: string;
    billingStatus: "Paid" | "Invoice Sent" | "Pending";
    deploymentStatus: "Live" | "Staging";
    reviewStatus: "Completed" | "Pending" | "Scheduled";
}

// --- TEAM ---
// This is now fetched from Firestore, but the skills list is still useful for the form.
export const teamMembers: {id: string, name: string, role: string}[] = [
    { id: "TM-001", name: "Alice Johnson", role: "Backend Developer" },
    { id: "TM-002", name: "Bob Williams", role: "Project Manager" },
    { id: "TM-003", name: "Charlie Brown", role: "UI/UX Designer" },
    { id: "TM-004", name: "Diana Prince", role: "QA Engineer" },
    { id: "TM-005", name: "Ethan Hunt", role: "DevOps Engineer" },
    { id: "TM-006", name: "Frank Miller", role: "Frontend Developer" },
];
