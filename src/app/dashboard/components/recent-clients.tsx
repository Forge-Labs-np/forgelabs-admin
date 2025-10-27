
'use client';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { type Client } from "@/types/client";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentClients() {
  const firestore = useFirestore();
  const clientsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'clients') : null, [firestore]);
  const { data: clients, isLoading } = useCollection<Client>(clientsCollection);

  const recentClients = clients?.slice(0, 5) || [];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
        <CardDescription>Your newest clients.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
          {!isLoading && recentClients.map((client) => {
            return (
              <div key={client.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
              </div>
            );
          })}
           {!isLoading && recentClients.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">No clients found.</p>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
