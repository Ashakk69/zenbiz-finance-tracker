import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export function BalanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Balance</CardTitle>
        <CardDescription>+20.1% from last month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">₹1,24,530.60</div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="p-1 bg-primary/10 rounded-full">
                <ArrowDownLeft className="size-4 text-primary" />
              </div>
              Income
            </div>
            <div className="text-xl font-semibold mt-1">₹85,000.00</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="p-1 bg-destructive/10 rounded-full">
                <ArrowUpRight className="size-4 text-destructive" />
              </div>
              Expenses
            </div>
            <div className="text-xl font-semibold mt-1">₹34,120.50</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
