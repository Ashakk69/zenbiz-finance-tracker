"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";

const spendingTrendData = [
  { month: "Jan", spending: 28600 },
  { month: "Feb", spending: 30500 },
  { month: "Mar", spending: 23700 },
  { month: "Apr", spending: 27800 },
  { month: "May", spending: 18900 },
  { month: "Jun", spending: 34120 },
];
const trendConfig = {
  spending: { label: "Spending", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const categoryData = [
  { category: "Food", amount: 12000, fill: "var(--color-food)" },
  { category: "Shopping", amount: 10000, fill: "var(--color-shopping)" },
  { category: "Transport", amount: 5000, fill: "var(--color-transport)" },
  { category: "Bills", amount: 15000, fill: "var(--color-bills)" },
  { category: "Entertainment", amount: 4000, fill: "var(--color-entertainment)" },
];
const categoryConfig = {
  amount: { label: "Amount" },
  food: { label: "Food", color: "hsl(var(--chart-1))" },
  shopping: { label: "Shopping", color: "hsl(var(--chart-2))" },
  transport: { label: "Transport", color: "hsl(var(--chart-3))" },
  bills: { label: "Bills", color: "hsl(var(--chart-4))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

export default function ReportsPage() {
  return (
    <div className="grid gap-6 auto-rows-max lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Your spending over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={trendConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={spendingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>How you spent your money this month.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ChartContainer config={categoryConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="category" hideLabel />}
                />
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                />
                 <ChartLegend
                  content={<ChartLegendContent nameKey="category" />}
                  className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
