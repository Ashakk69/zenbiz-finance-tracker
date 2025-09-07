
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import { useUserData } from "@/context/user-data-context";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useMemo } from "react";

export function BalanceCard() {
  const { formatCurrency } = useCurrency();
  const { transactions } = useUserData();

  const { income, expenses, balance, lastMonthPercentage } = useMemo(() => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthExpenses = transactions
        .filter(t => new Date(t.date) >= currentMonthStart && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = transactions
        .filter(t => new Date(t.date) >= lastMonthStart && new Date(t.date) <= lastMonthEnd && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Assuming "income" transactions have negative amounts, let's filter for that
    // Or we could add a type to transactions. For now we assume all positive are expenses.
    // We will simulate income for now.
    const income = 85000;
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
  }, [transactions]);


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
