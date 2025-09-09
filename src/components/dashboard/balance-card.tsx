
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import { useUserData } from "@/context/user-data-context";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function BalanceCard() {
  const { formatCurrency } = useCurrency();
  const { transactions, settings, loading } = useUserData();

  const { income, expenses, balance, lastMonthPercentage } = useMemo(() => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthExpenses = transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            // Ensure we only look at transactions within the current month
            return transactionDate.getFullYear() === now.getFullYear() && transactionDate.getMonth() === now.getMonth();
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    
    const income = settings?.income ?? 0;
    const balance = income - currentMonthExpenses;

    const percentageChange = lastMonthExpenses === 0 
        ? currentMonthExpenses > 0 ? 100 : 0
        : ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

    return {
        income,
        expenses: currentMonthExpenses,
        balance,
        lastMonthPercentage: percentageChange
    }
  }, [transactions, settings]);
  
  if (loading.transactions || loading.settings) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-10 w-1/2 mb-6" />
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="h-5 w-1/2 mb-2"/>
                            <Skeleton className="h-6 w-3/4"/>
                        </div>
                        <div>
                            <Skeleton className="h-5 w-1/2 mb-2"/>
                            <Skeleton className="h-6 w-3/4"/>
                        </div>
                   </div>
              </CardContent>
          </Card>
      )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Balance</CardTitle>
        <CardDescription>
            {lastMonthPercentage >= 0 ? `+${lastMonthPercentage.toFixed(1)}%` : `${lastMonthPercentage.toFixed(1)}%`} from last month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{formatCurrency(balance)}</div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="p-1 bg-primary/10 rounded-full">
                <ArrowDownLeft className="size-4 text-primary" />
              </div>
              Income
            </div>
            <div className="text-xl font-semibold mt-1">{formatCurrency(income)}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="p-1 bg-destructive/10 rounded-full">
                <ArrowUpRight className="size-4 text-destructive" />
              </div>
              Expenses
            </div>
            <div className="text-xl font-semibold mt-1">{formatCurrency(expenses)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
