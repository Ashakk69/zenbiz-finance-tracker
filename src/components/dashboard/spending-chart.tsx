
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent, ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";
import { useUserData } from "@/context/user-data-context";
import { format, subMonths, startOfMonth } from "date-fns";

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SpendingChart() {
    const { transactions } = useUserData();

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


  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
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
                    tickFormatter={(value) => `₹${Number(value) / 1000}k`}
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
          </TabsContent>
          <TabsContent value="daily"><div className="flex justify-center items-center h-[250px] text-muted-foreground">Daily data not available</div></TabsContent>
          <TabsContent value="weekly"><div className="flex justify-center items-center h-[250px] text-muted-foreground">Weekly data not available</div></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
