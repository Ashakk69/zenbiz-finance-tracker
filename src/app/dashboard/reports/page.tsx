
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
import { useCurrency } from "@/context/currency-context";
import { useUserData } from "@/context/user-data-context";
import { useMemo } from "react";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
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
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categoryConfig = {
  amount: { label: "Amount" },
  Food: { label: "Food", color: "hsl(var(--chart-1))" },
  Shopping: { label: "Shopping", color: "hsl(var(--chart-2))" },
  Transport: { label: "Transport", color: "hsl(var(--chart-3))" },
  Bills: { label: "Bills", color: "hsl(var(--chart-4))" },
  Entertainment: { label: "Entertainment", color: "hsl(var(--chart-5))" },
  Health: { label: "Health", color: "hsl(var(--chart-1))" },
  Others: { label: "Others", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const trendConfig = {
  spending: { label: "Spending", color: "hsl(var(--primary))" },
} satisfies ChartConfig;


export default function ReportsPage() {
  const { formatCompact, formatCurrency } = useCurrency();
  const { transactions, loading } = useUserData();

  const { spendingTrendData, categoryData } = useMemo(() => {
    const now = new Date();
    // Spending Trend Data (Last 6 months)
    const trendData = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(now, 5 - i);
        const month = format(d, "MMM");
        const monthStart = startOfMonth(d);
        const monthEnd = endOfMonth(d);

        const spending = transactions
            .filter(t => {
                const tDate = new Date(t.date);
                return tDate >= monthStart && tDate <= monthEnd;
            })
            .reduce((sum, t) => sum + t.amount, 0);
        
        return { month, spending };
    });

    // Category Breakdown (Current month)
    const currentMonthStart = startOfMonth(now);
    const catData = transactions
        .filter(t => new Date(t.date) >= currentMonthStart)
        .reduce((acc, t) => {
            const categoryKey = t.category as keyof typeof categoryConfig;
            if (!acc[categoryKey]) {
                acc[categoryKey] = { 
                    category: categoryKey, 
                    amount: 0, 
                    fill: `var(--color-${categoryKey})` 
                };
            }
            acc[categoryKey].amount += t.amount;
            return acc;
        }, {} as Record<string, { category: string; amount: number; fill: string }>);

    return { 
        spendingTrendData: trendData,
        categoryData: Object.values(catData) 
    };

  }, [transactions]);
  
  if (loading.transactions) {
    return (
      <div className="grid gap-6 auto-rows-max lg:grid-cols-2">
         <Card className="lg:col-span-2">
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
         </Card>
         <Card className="lg:col-span-2">
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <Skeleton className="h-[250px] w-[250px] rounded-full" />
            </CardContent>
         </Card>
      </div>
    );
  }

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
                  tickFormatter={(value) => formatCompact(Number(value))}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" formatter={(value) => formatCurrency(Number(value))} />}
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
                  content={<ChartTooltipContent nameKey="category" hideLabel formatter={(value) => formatCurrency(Number(value))} />}
                />
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {categoryData.map((entry) => (
                    <RechartsPrimitive.Cell key={`cell-${entry.category}`} fill={entry.fill} />
                  ))}
                </Pie>
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
