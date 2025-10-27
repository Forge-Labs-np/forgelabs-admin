
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
import { Switch } from "@/components/ui/switch"
import type { Domain } from "@/types/domain"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { type UpcomingProject, type OnDevelopmentProject } from "@/lib/data"
import { collection } from "firebase/firestore"


const formSchema = z.object({
  domainName: z.string().min(1, "Domain name is required"),
  associatedProject: z.string().optional(),
  registrar: z.string().min(1, "Registrar is required"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  autoRenew: z.enum(["On", "Off"]),
  sslExpiry: z.string().min(1, "SSL expiry date is required"),
});

type DomainFormValues = Omit<Domain, 'id' | 'daysRemaining'>

type DomainFormProps = {
  initialData?: Domain;
  onSubmit: (data: DomainFormValues) => void;
  setSheetOpen: (open: boolean) => void;
};

export function DomainForm({ initialData, onSubmit, setSheetOpen }: DomainFormProps) {
  const firestore = useFirestore();
  const upcomingProjectsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'upcomingProjects') : null, [firestore]);
  const { data: upcomingProjects, isLoading: isLoadingUpcoming } = useCollection<UpcomingProject>(upcomingProjectsCollection);

  const onDevelopmentProjectsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'onDevelopmentProjects') : null, [firestore]);
  const { data: onDevelopmentProjects, isLoading: isLoadingOngoing } = useCollection<OnDevelopmentProject>(onDevelopmentProjectsCollection);
  
  const [isOtherProject, setIsOtherProject] = React.useState(false);

  const allProjects = React.useMemo(() => {
    if (!upcomingProjects || !onDevelopmentProjects) return [];
    const upcoming = upcomingProjects.map(p => p.name);
    const ongoing = onDevelopmentProjects.map(p => p.name);
    return [...new Set([...upcoming, ...ongoing])].sort();
  }, [upcomingProjects, onDevelopmentProjects]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        expirationDate: format(new Date(initialData.expirationDate), "yyyy-MM-dd"),
        sslExpiry: format(new Date(initialData.sslExpiry), "yyyy-MM-dd"),
    } : {
      domainName: "",
      associatedProject: "",
      registrar: "",
      expirationDate: "",
      autoRenew: "Off",
      sslExpiry: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      const isProjectInList = allProjects.includes(initialData.associatedProject);
      if (!isProjectInList && initialData.associatedProject) {
        setIsOtherProject(true);
      } else {
        setIsOtherProject(false);
      }
      form.reset({
        ...initialData,
        expirationDate: format(new Date(initialData.expirationDate), "yyyy-MM-dd"),
        sslExpiry: format(new Date(initialData.sslExpiry), "yyyy-MM-dd"),
      });
    }
  }, [initialData, allProjects, form]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="domainName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain Name</FormLabel>
              <FormControl>
                <Input placeholder="example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="associatedProject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Associated Project</FormLabel>
              <Select 
                onValueChange={(value) => {
                    if (value === 'other') {
                        setIsOtherProject(true);
                        field.onChange('');
                    } else {
                        setIsOtherProject(false);
                        field.onChange(value);
                    }
                }} 
                defaultValue={field.value && !allProjects.includes(field.value) ? 'other' : field.value}
                disabled={isLoadingUpcoming || isLoadingOngoing}
              >
                  <FormControl>
                      <SelectTrigger>
                          <SelectValue placeholder="Select a project..." />
                      </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      {allProjects.map(projectName => (
                          <SelectItem key={projectName} value={projectName}>{projectName}</SelectItem>
                      ))}
                      <SelectItem value="other">Other (Specify)</SelectItem>
                  </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {isOtherProject && (
             <FormField
                control={form.control}
                name="associatedProject"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Custom Project Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter custom project name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )}
         <FormField
          control={form.control}
          name="registrar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registrar</FormLabel>
              <FormControl>
                <Input placeholder="GoDaddy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sslExpiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSL Certificate Expiry</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="autoRenew"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <FormLabel>Auto-Renew</FormLabel>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value === "On"}
                    onCheckedChange={(checked) => field.onChange(checked ? "On" : "Off")}
                    />
                </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
          <Button type="submit">{initialData ? 'Save Changes' : 'Add Domain'}</Button>
        </div>
      </form>
    </Form>
  )
}
