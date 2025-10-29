
"use client";

import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Client } from "@/types/client";
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

export function ClientGrowthChart() {
  const firestore = useFirestore();
  const clientsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'clients') : null, [firestore]);
  const { data: clients, isLoading } = useCollection<Client>(clientsCollection);

  const chartData = React.useMemo(() => {
    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const newClients = clients?.filter(client => {
        if (!client.createdAt) return false;
        const createdAtDate = new Date(client.createdAt);
        return createdAtDate >= monthStart && createdAtDate <= monthEnd;
      }).length || 0;

      data.push({
        month: format(monthDate, "MMM"),
        newClients,
      });
    }
    return data;
  }, [clients]);

  if (isLoading) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="h-[250px] w-full">
                <Skeleton className="h-full w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>New Client Growth</CardTitle>
        <CardDescription>A chart showing new clients added per month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
            newClients: {
                label: "New Clients",
                color: "hsl(var(--primary))",
            }
        }} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))', radius: '0.25rem' }}
                    content={<ChartTooltipContent />}
                />
                <Bar dataKey="newClients" fill="var(--color-newClients)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
