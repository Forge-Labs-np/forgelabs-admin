
"use client";

import React from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Expense } from "@/types/expense";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  'hsl(var(--primary))',
  'hsl(20.5 90.2% 48.2%)',
  'hsl(60 9.1% 97.8%)',
  'hsl(142.1 76.2% 36.3%)',
  'hsl(221.2 83.2% 53.3%)',
  'hsl(346.8 77.2% 49.8%)',
  'hsl(262.1 83.3% 57.8%)',
  'hsl(35.8 91.7% 45.9%)',
  'hsl(170 80% 40%)',
  'hsl(310 70% 50%)',
  'hsl(50 90% 50%)',
  'hsl(190 85% 45%)',
  'hsl(280 75% 55%)',
  'hsl(10 80% 50%)',
  'hsl(220 80% 60%)',
  'hsl(0 0% 50%)',
  'hsl(0 0% 75%)',
];


const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-sm font-bold">
        {payload.name}
      </text>
       <text x={cx} y={cy + 10} textAnchor="middle" className="text-xs fill-muted-foreground">
        {`(NPR ${value.toLocaleString()})`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={4}
      />
    </g>
  );
};


export function ExpenseChart() {
    const firestore = useFirestore();
    const expensesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'expenses') : null, [firestore]);
    const { data: expenses, isLoading } = useCollection<Expense>(expensesCollection);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const onPieEnter = (_:any, index: number) => {
        setActiveIndex(index);
    };

    const chartData = React.useMemo(() => {
        if (!expenses) return [];
        const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value,
        }));
    }, [expenses]);

    if (isLoading) {
        return (
            <Card className="col-span-1">
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
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>A pie chart showing expenses by category.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                 {chartData.length > 0 ? (
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                        >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                    </PieChart>
                 ) : (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-muted-foreground">No expense data to display.</p>
                    </div>
                 )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
  );
}
