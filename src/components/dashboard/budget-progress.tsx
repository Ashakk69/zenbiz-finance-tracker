
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/context/currency-context";

export function BudgetProgress() {
    const { formatCurrency, formatCompact } = useCurrency();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Budget</CardTitle>
                <CardDescription>You have {formatCurrency(15879.50)} remaining this month.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold">{formatCurrency(34120.50)}</span>
                        <span className="text-sm text-muted-foreground">of {formatCurrency(50000)} spent</span>
                    </div>
                    <Progress value={68} className="h-3" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
                        <div>
                            <div className="flex justify-between text-muted-foreground"><span>Food</span><span>{formatCompact(8000)} / {formatCompact(12000)}</span></div>
                            <Progress value={66} className="h-1.5" />
                        </div>
                        <div>
                            <div className="flex justify-between text-muted-foreground"><span>Shopping</span><span>{formatCompact(6000)} / {formatCompact(10000)}</span></div>
                            <Progress value={60} className="h-1.5" />
                        </div>
                        <div>
                            <div className="flex justify-between text-muted-foreground"><span>Transport</span><span>{formatCompact(3000)} / {formatCompact(5000)}</span></div>
                            <Progress value={60} className="h-1.5" />
                        </div>
                        <div>
                            <div className="flex justify-between text-muted-foreground"><span>Bills</span><span>{formatCompact(10000)} / {formatCompact(15000)}</span></div>
                            <Progress value={67} className="h-1.5" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
