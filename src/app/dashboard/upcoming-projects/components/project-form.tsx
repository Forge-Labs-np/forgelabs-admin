
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useEffect } from "react"
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
import type { UpcomingProject } from "@/lib/data"
import { teamMembers } from "@/lib/data"
import { MultiSelect } from "@/components/ui/multi-select"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"
import type { Client } from "@/types/client"

const allSkills = [...new Set(teamMembers.flatMap(member => member.role))];

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  client: z.string().min(1, "Client/Stakeholder is required"),
  businessValue: z.string().min(1, "Business value/goal is required"),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  startDate: z.string().min(1, "Proposed start date is required"),
  duration: z.string().min(1, "Estimated duration is required"),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
  requiredTeam: z.array(z.string()).min(1, "At least one role/skill is required"),
  status: z.enum(["Idea/Intake", "Discovery In Progress", "Proposal Sent", "Awaiting Funding/Approval"]),
  proposalLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});


type ProjectFormValues = Omit<UpcomingProject, 'id'>;


type ProjectFormProps = {
  initialData?: UpcomingProject;
  onSubmit: (data: ProjectFormValues) => void;
  setSheetOpen: (open: boolean) => void;
};

export function UpcomingProjectForm({ initialData, onSubmit, setSheetOpen }: ProjectFormProps) {
  const firestore = useFirestore();
  const clientsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'clients') : null, [firestore]);
  const { data: clients } = useCollection<Client>(clientsCollection);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        budget: initialData.budget || 0,
        requiredTeam: Array.isArray(initialData.requiredTeam) ? initialData.requiredTeam : (initialData.requiredTeam ? [initialData.requiredTeam] : []),
    } : {
      name: "",
      client: "",
      businessValue: "",
      priority: "Medium",
      startDate: "",
      duration: "",
      budget: 0,
      requiredTeam: [],
      status: "Idea/Intake",
      proposalLink: "",
    },
  });

  useEffect(() => {
    if (initialData) {
       form.reset({
        ...initialData,
        budget: initialData.budget || 0,
        requiredTeam: Array.isArray(initialData.requiredTeam) ? initialData.requiredTeam : (initialData.requiredTeam ? [initialData.requiredTeam] : []),
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };
  
  const durationOptions = [
    ...Array.from({ length: 12 }, (_, i) => `${i + 1} Month${i > 0 ? 's' : ''}`),
    "More than a year"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., AI Chatbot Integration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Client/Stakeholder</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a client or stakeholder" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {(clients || []).map(client => (
                            <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                        ))}
                        <SelectItem value="Internal">Internal</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="businessValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Value/Goal</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the 'why' - e.g., Increase conversion by 15%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Priority Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Current Planning Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Idea/Intake">Idea/Intake</SelectItem>
                            <SelectItem value="Discovery In Progress">Discovery In Progress</SelectItem>
                            <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                            <SelectItem value="Awaiting Funding/Approval">Awaiting Funding/Approval</SelectItem>
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
                name="startDate"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Proposed Start Date</FormLabel>
                    <FormControl>
                    <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Estimated Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a duration" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {durationOptions.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
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
                name="budget"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Estimated Budget (NPR)</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="requiredTeam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Roles/Skills</FormLabel>
                  <FormControl>
                     <MultiSelect
                        options={allSkills.map(skill => ({ value: skill, label: skill }))}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select skills..."
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <FormField
            control={form.control}
            name="proposalLink"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Link to Proposal/SOW</FormLabel>
                <FormControl>
                    <Input type="url" placeholder="https://example.com/proposal.pdf" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
          <Button type="submit">{initialData ? 'Save Changes' : 'Add Project'}</Button>
        </div>
      </form>
    </Form>
  )
}
