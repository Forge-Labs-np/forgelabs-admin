
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type CompletedProject } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type ProjectReportDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project?: CompletedProject;
};

const DetailItem = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base">{value}</div>
    </div>
);


export function ProjectReportDialog({ isOpen, onOpenChange, project }: ProjectReportDialogProps) {
  if (!project) return null;
  
  const getBillingBadge = (status: string) => {
    return <Badge 
        variant={status === "Paid" ? "default" : status === "Invoice Sent" ? "secondary" : "outline"}
        className={cn(status === 'Paid' && "bg-green-500")}
        >{status}</Badge>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Project Completion Report</DialogTitle>
          <DialogDescription>A summary of the project "{project.name}".</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Project Name" value={project.name} />
                <DetailItem label="Project Manager" value={project.manager} />
            </div>
             <Separator />
            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Completion Date" value={project.completionDate} />
                <DetailItem label="Final Delivery Date" value={project.finalDeliveryDate} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Billing Status" value={getBillingBadge(project.billingStatus)} />
                <DetailItem label="Deployment Status" value={project.deploymentStatus} />
            </div>
            <Separator />
            <DetailItem label="Post-Delivery Review Status" value={project.reviewStatus} />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
