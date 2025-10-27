
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { month: "Jan", newClients: 2 },
  { month: "Feb", newClients: 3 },
  { month: "Mar", newClients: 1 },
  { month: "Apr", newClients: 4 },
  { month: "May", newClients: 5 },
  { month: "Jun", newClients: 2 },
];

export function ClientGrowthChart() {
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
