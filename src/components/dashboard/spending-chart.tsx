
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent, ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";
import { useUserData } from "@/context/user-data-context";
import { format, subMonths, startOfMonth } from "date-fns";
import { useCurrency } from "@/context/currency-context";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SpendingChart() {
    const { transactions, loading } = useUserData();
    const { formatCompact } = useCurrency();

    const chartData = useMemo(() => {
        const now = new Date();
        const data = Array.from({ length: 6 }).map((_, i) => {
            const d = subMonths(now, 5 - i);
            const month = format(d, "MMM");
            const monthStart = startOfMonth(d);

            const spending = transactions
                .filter(t => new Date(t.date) >= monthStart && new Date(t.date) < startOfMonth(subMonths(now, 4 - i)))
                .reduce((sum, t) => sum + t.amount, 0);

            return { month, spending };
        });
        return data;
    }, [transactions]);
    
    const renderContent = () => {
        if (loading.transactions) {
            return (
                <div className="h-[250px] w-full flex items-end gap-4 px-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-full w-full" style={{ height: `${Math.random() * 80 + 10}%`}}/>
                    ))}
                </div>
            )
        }
        return (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCompact(Number(value))}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
        )
    }


  return (
    <Card>
        <CardHeader>
            <CardTitle>Spending Summary</CardTitle>
            <CardDescription>Your spending over the last 6 months.</CardDescription>
        </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily" disabled>Daily</TabsTrigger>
            <TabsTrigger value="weekly" disabled>Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            {renderContent()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
