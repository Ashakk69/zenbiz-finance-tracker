import { BalanceCard } from "@/components/dashboard/balance-card";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 auto-rows-max md:grid-cols-2 lg:grid-cols-4">
      <div className="lg:col-span-2">
        <BalanceCard />
      </div>
      <div className="lg:col-span-2">
        <BudgetProgress />
      </div>
      <div className="lg:col-span-3">
        <SpendingChart />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="size-5" />
            Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-destructive/10 p-2 rounded-full">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium">Overspending Warning</p>
                <p className="text-sm text-muted-foreground">You've spent 85% of your 'Shopping' budget.</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <div className="bg-accent/10 p-2 rounded-full">
                <AlertTriangle className="size-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Upcoming Bill</p>
                <p className="text-sm text-muted-foreground">Netflix payment of ₹649 is due in 3 days.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="lg:col-span-4">
        <RecentTransactions />
      </div>
    </div>
  );
}
