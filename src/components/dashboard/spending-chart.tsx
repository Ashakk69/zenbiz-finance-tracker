"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent, ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartData = [
  { month: "January", spending: 18600 },
  { month: "February", spending: 30500 },
  { month: "March", spending: 23700 },
  { month: "April", spending: 27800 },
  { month: "May", spending: 18900 },
  { month: "June", spending: 34120 },
];

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SpendingChart() {
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
