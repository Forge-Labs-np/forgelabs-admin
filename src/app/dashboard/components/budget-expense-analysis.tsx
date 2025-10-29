
"use client";

import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { UpcomingProject } from "@/lib/data";
import type { OperationalBudget } from "@/types/budget";
import type { Expense } from "@/types/expense";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function BudgetExpenseAnalysis() {
    const firestore = useFirestore();
    const upcomingProjectsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'upcomingProjects') : null, [firestore]);
    const { data: upcomingProjects, isLoading: isLoadingProjects } = useCollection<UpcomingProject>(upcomingProjectsCollection);
    
    const operationalBudgetsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'operationalBudgets') : null, [firestore]);
    const { data: operationalBudgets, isLoading: isLoadingBudgets } = useCollection<OperationalBudget>(operationalBudgetsCollection);
    
    const expensesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'expenses') : null, [firestore]);
    const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(expensesCollection);

    const { totalBudget, totalExpenses, percentage, remaining } = React.useMemo(() => {
        const budgetFromProjects = upcomingProjects?.reduce((acc, p) => acc + p.budget, 0) || 0;
        const budgetFromOps = operationalBudgets?.reduce((acc, b) => acc + b.amount, 0) || 0;
        const totalBudget = budgetFromProjects + budgetFromOps;

        const totalExpenses = expenses?.reduce((acc, e) => acc + e.amount, 0) || 0;
        
        const percentage = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;

        return {
            totalBudget,
            totalExpenses,
            percentage,
            remaining: totalBudget - totalExpenses,
        };
    }, [upcomingProjects, operationalBudgets, expenses]);

    const chartData = [{ name: "Usage", value: percentage > 100 ? 100 : percentage }];
    
    const formatCurrency = (amount: number) => `NPR ${amount.toLocaleString('en-IN')}`;

    if (isLoadingProjects || isLoadingBudgets || isLoadingExpenses) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[250px]">
                    <Skeleton className="h-[200px] w-[200px] rounded-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget vs. Expense</CardTitle>
                <CardDescription>An analysis of your budget utilization.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <div className="h-[160px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="75%"
                            outerRadius="100%"
                            data={chartData}
                            startAngle={180}
                            endAngle={0}
                        >
                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                angleAxisId={0}
                                tick={false}
                            />
                            <RadialBar
                                background
                                clockWise
                                dataKey="value"
                                cornerRadius={10}
                                className={cn(
                                    percentage > 85 ? "fill-destructive" :
                                    percentage > 60 ? "fill-yellow-500" :
                                    "fill-primary"
                                )}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-3xl font-bold">{percentage}%</p>
                        <p className="text-xs text-muted-foreground">Spent</p>
                    </div>
                </div>

                <div className="w-full text-center mt-4 space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="font-semibold">{formatCurrency(totalBudget)}</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="font-semibold">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <Separator/>
                     <div>
                        <p className="text-sm text-muted-foreground">Remaining Budget</p>
                        <p className={cn(
                            "font-bold text-lg",
                            remaining < 0 ? "text-destructive" : "text-green-600"
                            )}>{formatCurrency(remaining)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
