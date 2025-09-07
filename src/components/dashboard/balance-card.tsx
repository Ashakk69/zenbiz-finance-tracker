
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export function BalanceCard() {
  const { formatCurrency } = useCurrency();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Balance</CardTitle>
        <CardDescription>+20.1% from last month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{formatCurrency(124530.60)}</div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="p-1 bg-primary/10 rounded-full">
                <ArrowDownLeft className="size-4 text-primary" />
              </div>
              Income
            </div>
            <div className="text-xl font-semibold mt-1">{formatCurrency(85000.00)}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="p-1 bg-destructive/10 rounded-full">
                <ArrowUpRight className="size-4 text-destructive" />
              </div>
              Expenses
            </div>
            <div className="text-xl font-semibold mt-1">{formatCurrency(34120.50)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
