"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getBudgetSuggestions } from "@/ai/flows/ai-powered-budget-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Loader2 } from "lucide-react";

const formSchema = z.object({
  income: z.coerce.number().min(1, "Please enter your monthly income."),
  financialGoals: z.string().min(10, "Please describe your financial goals.").max(500),
  spendingHistory: z.string().min(20, "Please provide a summary of your spending.").max(1000),
});

type BudgetSuggestionsOutput = {
  suggestedBudget: string;
  savingsTips: string;
};

export default function AiInsightsPage() {
  const [suggestions, setSuggestions] = useState<BudgetSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 85000,
      financialGoals: "Save for a down payment on a house and build an emergency fund.",
      spendingHistory: "High spending on dining out and online shopping. Monthly expenses are around 40k, with 12k on food, 10k on shopping, 5k on transport and 13k on bills and rent.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getBudgetSuggestions(values);
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to get suggestions",
        description: "An error occurred while fetching AI-powered insights.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 auto-rows-max">
      <Card>
        <CardHeader>
          <CardTitle>Personalized Budget Suggestions</CardTitle>
          <CardDescription>Let our AI analyze your finances and suggest a budget for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="85000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="financialGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Save for a down payment..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spendingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spending History Summary</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="e.g., High spending on dining out..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                Generate Suggestions
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Here's what our AI suggests based on your information.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading && <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {suggestions ? (
                <div className="space-y-6 text-sm">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Suggested Budget</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{suggestions.suggestedBudget}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Savings Tips</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{suggestions.savingsTips}</p>
                    </div>
                </div>
            ) : !isLoading && (
                <div className="text-center text-muted-foreground py-16">
                    <BrainCircuit className="mx-auto h-12 w-12" />
                    <p className="mt-4">Your personalized insights will appear here.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
