
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/context/currency-context";
import { useUserData } from "@/context/user-data-context";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

// Mock category budgets
const categoryBudgets: { [key: string]: number } = {
    Food: 12000,
    Shopping: 10000,
    Transport: 5000,
    Bills: 15000,
    Entertainment: 4000,
    Health: 3000,
    Others: 1000
};

export function BudgetProgress() {
    const { formatCurrency, formatCompact } = useCurrency();
    const { settings, transactions, loading } = useUserData();

    const { totalSpent, budget, remaining, progressValue, categoryProgress } = useMemo(() => {
        const monthlyBudget = settings?.monthlyBudget ?? 0;
        
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalSpent = transactions
            .filter(t => new Date(t.date) >= currentMonthStart)
            .reduce((sum, t) => sum + t.amount, 0);

        const remaining = monthlyBudget - totalSpent;
        const progressValue = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
        
        const categorySpending = transactions
            .filter(t => new Date(t.date) >= currentMonthStart)
            .reduce((acc, t) => {
                if(!acc[t.category]) acc[t.category] = 0;
                acc[t.category] += t.amount;
                return acc;
            }, {} as {[key: string]: number});

        const categoryProgress = Object.keys(categoryBudgets).map(cat => ({
            name: cat,
            spent: categorySpending[cat] ?? 0,
            budget: categoryBudgets[cat],
            progress: categoryBudgets[cat] > 0 ? ((categorySpending[cat] ?? 0) / categoryBudgets[cat]) * 100 : 0
        })).slice(0, 4);

        return { totalSpent, budget: monthlyBudget, remaining, progressValue, categoryProgress };
    }, [settings, transactions]);
    
    if (loading.settings || loading.transactions) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                             <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <Skeleton className="h-1.5 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Monthly Budget</CardTitle>
                    <CardDescription>
                        You have {formatCurrency(remaining)} remaining this month.
                    </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/settings">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold">{formatCurrency(totalSpent)}</span>
                        <span className="text-sm text-muted-foreground">of {formatCurrency(budget)} spent</span>
                    </div>
                    <Progress value={progressValue} className="h-3" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
                        {categoryProgress.map(cat => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>{cat.name}</span>
                                    <span>{formatCompact(cat.spent)} / {formatCompact(cat.budget)}</span>
                                </div>
                                <Progress value={cat.progress} className="h-1.5" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
