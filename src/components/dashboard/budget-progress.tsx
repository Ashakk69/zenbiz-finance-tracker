import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function BudgetProgress() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Budget</CardTitle>
                <CardDescription>You have ₹15,879.50 remaining this month.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold">₹34,120.50</span>
                        <span className="text-sm text-muted-foreground">of ₹50,000 spent</span>
                    </div>
                    <Progress value={68} className="h-3" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
                        <div>
                            <div className="flex justify-between text-muted-foreground"><span>Food</span><span>₹8k / ₹12k</span></div>
                            <Progress value={66} className="h-1.5" />
                        </div>
                        <div>
                            <div className="flex justify-between text-muted-foreground"><span>Shopping</span><span>₹6k / ₹10k</span></div>
                            <Progress value={60} className="h-1.5" />
                        </div>
                        <div>
                            <div className="flex justify-between text-muted-foreground"><span>Transport</span><span>₹3k / ₹5k</span></div>
                            <Progress value={60} className="h-1.5" />
                        </div>
                        <div>
                            <div className="flex justify-between text-muted-foreground"><span>Bills</span><span>₹10k / ₹15k</span></div>
                            <Progress value={67} className="h-1.5" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
