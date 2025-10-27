
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
  requiredTeam: string[] | string;
  status: "Idea/Intake" | "Discovery In Progress" | "Proposal Sent" | "Awaiting Funding/Approval";
  proposalLink: string;
};

export const upcomingProjects: UpcomingProject[] = [
  { id: "PROJ-011", name: "AI Chatbot Integration", client: "Innovate Inc.", businessValue: "Improve customer support efficiency by 30%", priority: "High", startDate: "2024-09-01", duration: "3 Months", budget: 75000, requiredTeam: ["AI/ML Team", "Backend"], status: "Proposal Sent", proposalLink: "#" },
  { id: "PROJ-012", name: "Mobile App Refactor", client: "QuantumLeap Corp.", businessValue: "Enhance performance and user retention on the mobile platform.", priority: "High", startDate: "2024-09-15", duration: "5 Months", budget: 120000, requiredTeam: ["Mobile", "UX"], status: "Awaiting Funding/Approval", proposalLink: "#" },
  { id: "PROJ-013", name: "E-commerce Analytics", client: "Internal", businessValue: "Gain deeper insights into customer purchasing behavior.", priority: "Medium", startDate: "2024-10-01", duration: "4 Months", budget: 60000, requiredTeam: ["Data Science", "Frontend"], status: "Discovery In Progress", proposalLink: "#" },
];

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

export const onDevelopmentProjects: OnDevelopmentProject[] = [
    { 
        id: "PROJ-001", name: "Project Phoenix", manager: "Alice Johnson", deadline: "2024-09-30", health: "Green", progress: 65, priority: "High",
        details: { currentPhase: "Development", timeSpent: 400, timeBudgeted: 600, milestoneStatus: "API Integration: 90% Complete", blockers: 2, assignedTeam: ["Alice J.", "Ethan H.", "Frank M."], statusNotes: "Backend logic is solid. Minor UI tweaks remain."}
    },
    { 
        id: "PROJ-002", name: "Project Titan", manager: "Bob Williams", deadline: "2024-08-15", health: "Yellow", progress: 90, priority: "High",
        details: { currentPhase: "Client Review", timeSpent: 750, timeBudgeted: 800, milestoneStatus: "Final Sign-off Pending", blockers: 5, assignedTeam: ["Bob W.", "Diana P.", "Grace L."], statusNotes: "Client has requested several last-minute design changes."}
    },
    { 
        id: "PROJ-003", name: "Internal CRM", manager: "Charlie Brown", deadline: "2024-08-28", health: "Green", progress: 80, priority: "Medium",
        details: { currentPhase: "Testing", timeSpent: 250, timeBudgeted: 350, milestoneStatus: "QA Cycle 2: In Progress", blockers: 1, assignedTeam: ["Charlie B.", "Heidi K."], statusNotes: "Performance testing is underway. One edge case bug found."}
    },
    { 
        id: "PROJ-004", name: "Website Overhaul", manager: "Diana Prince", deadline: "2024-10-15", health: "Red", progress: 40, priority: "Medium",
        details: { currentPhase: "Development", timeSpent: 300, timeBudgeted: 500, milestoneStatus: "Homepage Redesign: 50% Complete", blockers: 12, assignedTeam: ["Diana P.", "Ivy O."], statusNotes: "Blocked by delayed content delivery from the client's marketing team."}
    },
];

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

export const completedProjects: CompletedProject[] = [
    { id: "PROJ-005", name: "Marketing Microsite", manager: "Alice Johnson", completionDate: "2024-07-01", finalDeliveryDate: "2024-07-05", billingStatus: "Paid", deploymentStatus: "Live", reviewStatus: "Completed" },
    { id: "PROJ-006", name: "API Gateway V1", manager: "Ethan Hunt", completionDate: "2024-06-15", finalDeliveryDate: "2024-06-15", billingStatus: "Paid", deploymentStatus: "Live", reviewStatus: "Completed" },
    { id: "PROJ-007", name: "Client Dashboard POC", manager: "Charlie Brown", completionDate: "2024-05-20", finalDeliveryDate: "2024-05-22", billingStatus: "Invoice Sent", deploymentStatus: "Staging", reviewStatus: "Scheduled" },
];


// --- SERVERS ---
export type ServerHealth = {
  id: string;
  name: string;
  location: string;
  status: "Up" | "Down";
  cpu: number;
  memory: number;
  disk: number;
  projectsHosted: string;
  lastPatch: string;
};

export const serverHealth: ServerHealth[] = [
    { id: "SRV-001", name: "Prod-Web", location: "AWS (us-east-1)", status: "Up", cpu: 35, memory: 70, disk: 60, projectsHosted: "Phoenix, Titan", lastPatch: "2024-07-15" },
    { id: "SRV-002", name: "Staging-DB", location: "Azure (westus)", status: "Up", cpu: 55, memory: 80, disk: 45, projectsHosted: "CRM, Website", lastPatch: "2024-07-10" },
    { id: "SRV-003", name: "Dev-API", location: "On-Premise", status: "Up", cpu: 20, memory: 40, disk: 80, projectsHosted: "All (Dev)", lastPatch: "2024-07-18" },
    { id: "SRV-004", name: "Prod-DB", location: "AWS (us-east-1)", status: "Down", cpu: 0, memory: 0, disk: 75, projectsHosted: "Phoenix, Titan", lastPatch: "2024-07-15" },
];

export const servers = serverHealth.map(({id, name}) => ({id, name}));


// --- DOMAINS ---
export type DomainInfo = {
    id: string;
    domainName: string;
    associatedProject: string;
    registrar: string;
    expirationDate: string;
    daysRemaining: number;
    autoRenew: "On" | "Off";
    sslExpiry: string;
};

export const domains: DomainInfo[] = [
    { id: "DOM-001", domainName: "project-phoenix.com", associatedProject: "Project Phoenix", registrar: "GoDaddy", expirationDate: "2024-12-10", daysRemaining: 150, autoRenew: "On", sslExpiry: "2024-11-20" },
    { id: "DOM-002", domainName: "titan-corp.net", associatedProject: "Project Titan", registrar: "Namecheap", expirationDate: "2024-09-25", daysRemaining: 83, autoRenew: "Off", sslExpiry: "2024-09-01" },
    { id: "DOM-003", domainName: "internal-crm.io", associatedProject: "Internal CRM", registrar: "Google Domains", expirationDate: "2025-05-30", daysRemaining: 320, autoRenew: "On", sslExpiry: "2025-04-15" },
    { id: "DOM-004", domainName: "acme-website.dev", associatedProject: "Website Overhaul", registrar: "GoDaddy", expirationDate: "2024-08-15", daysRemaining: 32, autoRenew: "Off", sslExpiry: "2024-08-01" },
];


// --- TEAM ---
export type TeamMember = {
    id: string;
    name: string;
    role: string;
    currentProjects: string;
    allocation: number;
    availability: "High" | "Medium" | "Low";
    upcomingLeave: string;
};

export const teamMembers: TeamMember[] = [
    { id: "TM-001", name: "Alice Johnson", role: "Backend", currentProjects: "Project Phoenix", allocation: 80, availability: "Low", upcomingLeave: "None" },
    { id: "TM-002", name: "Bob Williams", role: "Project Manager", currentProjects: "Project Titan, Website Overhaul", allocation: 100, availability: "Low", upcomingLeave: "Aug 5-9" },
    { id: "TM-003", name: "Charlie Brown", role: "UI/UX", currentProjects: "Internal CRM", allocation: 50, availability: "High", upcomingLeave: "None" },
    { id: "TM-004", name: "Diana Prince", role: "QA", currentProjects: "Project Titan", allocation: 100, availability: "Low", upcomingLeave: "None" },
    { id: "TM-005", name: "Ethan Hunt", role: "DevOps", currentProjects: "All Projects", allocation: 75, availability: "Medium", upcomingLeave: "Sep 2-6" },
    { id: "TM-006", name: "Frank Miller", role: "Frontend", currentProjects: "Project Phoenix", allocation: 100, availability: "Low", upcomingLeave: "None" },
];


// Legacy data below, can be removed if not used elsewhere
export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  server: string;
  status: "active" | "suspended" | "new";
};

export const clients: Client[] = [
  { id: "01", name: "Darrell Steward", email: "darrell@hostteam.com", phone: "(406) 555-0120", server: "SRV-001", status: "active" },
  { id: "02", name: "Jenny Wilson", email: "jenny@racks.com", phone: "(225) 555-0118", server: "SRV-002", status: "suspended" },
  { id: "03", name: "Kathryn Murphy", email: "kathryn@hostdev.com", phone: "(303) 555-0105", server: "SRV-001", status: "new" },
  { id: "04", name: "Robert Fox", email: "robert@gmail.com", phone: "(219) 555-0114", server: "SRV-003", status: "active" },
];

// --- Old Projects data ---
// This is now split into onDevelopmentProjects and completedProjects
export type OngoingProject = {
    id: string;
    name: string;
    manager: string;
    status: "In Development" | "Testing" | "Client Review" | "Blocked";
    health: "Green" | "Yellow" | "Red";
    progress: number;
    timeRemaining: string;
    budgetBurn: number;
    openBugs: number;
};

export const ongoingProjects: OngoingProject[] = [
    { id: "PROJ-001", name: "Project Phoenix", manager: "Alice Johnson", status: "In Development", health: "Green", progress: 65, timeRemaining: "28 days", budgetBurn: 60, openBugs: 2 },
    { id: "PROJ-002", name: "Project Titan", manager: "Bob Williams", status: "Client Review", health: "Yellow", progress: 90, timeRemaining: "7 days", budgetBurn: 85, openBugs: 5 },
    { id: "PROJ-003", name: "Internal CRM", manager: "Charlie Brown", status: "Testing", health: "Green", progress: 80, timeRemaining: "15 days", budgetBurn: 70, openBugs: 1 },
    { id: "PROJ-004", name: "Website Overhaul", manager: "Diana Prince", status: "Blocked", health: "Red", progress: 40, timeRemaining: "45 days", budgetBurn: 50, openBugs: 12 },
];
