'use server';
/**
 * @fileOverview An AI-powered budget suggestion flow.
 *
 * - getBudgetSuggestions - A function that generates personalized budget suggestions.
 * - BudgetSuggestionsInput - The input type for the getBudgetSuggestions function.
 * - BudgetSuggestionsOutput - The return type for the getBudgetSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetSuggestionsInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  spendingHistory: z.string().describe('A summary of the user\'s recent spending habits, including categories and amounts.'),
  financialGoals: z.string().describe('The user\'s financial goals (e.g., saving for retirement, paying off debt).'),
});
export type BudgetSuggestionsInput = z.infer<typeof BudgetSuggestionsInputSchema>;

const BudgetSuggestionsOutputSchema = z.object({
  suggestedBudget: z.string().describe('A detailed breakdown of the suggested monthly budget, including limits for different categories.'),
  savingsTips: z.string().describe('Personalized tips for saving money based on the user\'s spending habits and financial goals.'),
});
export type BudgetSuggestionsOutput = z.infer<typeof BudgetSuggestionsOutputSchema>;

export async function getBudgetSuggestions(input: BudgetSuggestionsInput): Promise<BudgetSuggestionsOutput> {
  return budgetSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetSuggestionsPrompt',
  input: {schema: BudgetSuggestionsInputSchema},
  output: {schema: BudgetSuggestionsOutputSchema},
  prompt: `You are an AI personal finance advisor. Analyze the user's income, spending habits, and financial goals to generate personalized budget suggestions and savings tips.

Income: {{income}}
Spending History: {{spendingHistory}}
Financial Goals: {{financialGoals}}

Provide a detailed suggested budget with limits for categories like Food, Transport, Bills, Shopping, Entertainment, and Others. Also, suggest specific and actionable savings tips tailored to the user's situation.

Format the budget suggestions in a clear and easy-to-understand manner.
`,
});

const budgetSuggestionsFlow = ai.defineFlow(
  {
    name: 'budgetSuggestionsFlow',
    inputSchema: BudgetSuggestionsInputSchema,
    outputSchema: BudgetSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
