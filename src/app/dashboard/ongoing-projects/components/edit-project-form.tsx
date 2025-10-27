
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { type OnDevelopmentProject } from "@/lib/data"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Edit } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import type { Technician } from "@/types/team"
import { collection } from "firebase/firestore"


const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Project name must be at least 2 characters." }),
  manager: z.string().min(1, { message: "Please select a manager." }),
  deadline: z.string(),
  priority: z.enum(["High", "Medium", "Low"]),
  details: z.object({
    currentPhase: z.string(),
    timeSpent: z.coerce.number(),
    timeBudgeted: z.coerce.number(),
    statusNotes: z.string().optional(),
    assignedTeam: z.array(z.string()),
    milestoneStatus: z.string(),
    blockers: z.number(),
  }),
  health: z.enum(["Green", "Yellow", "Red"]),
  progress: z.number(),
});

const EditValueDialog = ({
    project,
    field,
    title,
    description,
    inputType = "text",
    onUpdate,
    children,
}: {
    project: OnDevelopmentProject;
    field: keyof OnDevelopmentProject | `details.${keyof OnDevelopmentProject['details']}`;
    title: string;
    description: string;
    inputType?: string;
    onUpdate: (id: string, value: any) => void;
    children: React.ReactNode;
}) => {
    const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => (o && o[k] != null) ? o[k] : '', obj);
    const initialValue = getNestedValue(project, field);
    const [value, setValue] = React.useState(initialValue);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSave = () => {
        onUpdate(project.id, value);
        setIsOpen(false);
    };
    
    useEffect(() => {
        if(isOpen) {
            setValue(initialValue)
        }
    }, [isOpen, initialValue])
    
    const transformedLabel = (label: string) => {
        const withSpaces = label.replace(/([A-Z])/g, ' $1').trim();
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="editValue" className="text-right">
                        {transformedLabel(field.split('.').pop() || '')}
                    </Label>
                    <Input
                        id="editValue"
                        type={inputType}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="mt-2"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


type EditProjectFormProps = {
  initialData?: OnDevelopmentProject;
  onSubmit: (data: OnDevelopmentProject) => void;
  onNameChange: (id: string, newName: string) => void;
  onDeadlineChange: (id: string, newDeadline: string) => void;
  onTimeBudgetedChange: (id: string, newTimeBudgeted: number) => void;
  onMarkAsCompleted: (id: string) => void;
  setSheetOpen: (open: boolean) => void;
};

export function EditProjectForm({ 
    initialData, 
    onSubmit, 
    onNameChange,
    onDeadlineChange,
    onTimeBudgetedChange,
    onMarkAsCompleted,
    setSheetOpen 
}: EditProjectFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const techniciansCollection = useMemoFirebase(() => firestore ? collection(firestore, 'technicians') : null, [firestore]);
  const { data: teamMembers } = useCollection<Technician>(techniciansCollection);

  const form = useForm<OnDevelopmentProject>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: OnDevelopmentProject) => {
    onSubmit(values);
    toast({
      title: "Project Updated",
      description: `Project "${values.name}" has been successfully updated.`,
    });
  };
  
  if (!initialData) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
                <div className="flex items-center gap-2">
                    <FormControl>
                        <Input {...field} disabled/>
                    </FormControl>
                    <EditValueDialog 
                        project={initialData}
                        field="name"
                        title="Edit Project Name"
                        description={`Please enter the new name for the project "${initialData.name}".`}
                        onUpdate={onNameChange}
                    >
                         <Button variant="ghost" size="icon" type="button">
                            <Edit className="h-4 w-4" />
                         </Button>
                    </EditValueDialog>
                </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="manager"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Project Manager</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {(teamMembers || []).map(member => (
                        <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Deadline</FormLabel>
                <div className="flex items-center gap-2">
                    <FormControl>
                        <Input {...field} disabled />
                    </FormControl>
                    <EditValueDialog 
                        project={initialData}
                        field="deadline"
                        title="Edit Deadline"
                        description="Please enter the new deadline for the project."
                        inputType="date"
                        onUpdate={onDeadlineChange}
                    >
                         <Button variant="ghost" size="icon" type="button">
                            <Edit className="h-4 w-4" />
                         </Button>
                    </EditValueDialog>
                </div>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className={cn(
                        field.value === "High" && "bg-red-100 border-red-500 text-red-700",
                        field.value === "Medium" && "bg-yellow-100 border-yellow-500 text-yellow-700",
                    )}>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="High">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"/>High</div>
                        </SelectItem>
                        <SelectItem value="Medium">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"/>Medium</div>
                        </SelectItem>
                        <SelectItem value="Low">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400"/>Low</div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="details.timeSpent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Spent (hours)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.timeBudgeted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Budgeted (hours)</FormLabel>
                 <div className="flex items-center gap-2">
                    <FormControl>
                        <Input type="number" {...field} disabled />
                    </FormControl>
                    <EditValueDialog 
                        project={initialData}
                        field="details.timeBudgeted"
                        title="Edit Time Budgeted"
                        description="Please enter the new budgeted time in hours."
                        inputType="number"
                        onUpdate={(id, value) => onTimeBudgetedChange(id, Number(value))}
                    >
                         <Button variant="ghost" size="icon" type="button">
                            <Edit className="h-4 w-4" />
                         </Button>
                    </EditValueDialog>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
          control={form.control}
          name="details.statusNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internal Status Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  )
}
