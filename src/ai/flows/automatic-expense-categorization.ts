'use server';
/**
 * @fileOverview Automatically categorizes expenses by parsing SMS/UPI notifications using NLP.
 *
 * - automaticExpenseCategorization - A function that handles the expense categorization process.
 * - AutomaticExpenseCategorizationInput - The input type for the automaticExpenseCategorization function.
 * - AutomaticExpenseCategorizationOutput - The return type for the automaticExpenseCategorization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticExpenseCategorizationInputSchema = z.object({
  notificationText: z
    .string()
    .describe('The text content of the SMS or UPI notification.'),
});
export type AutomaticExpenseCategorizationInput = z.infer<typeof AutomaticExpenseCategorizationInputSchema>;

const AutomaticExpenseCategorizationOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The predicted category of the expense (Food, Transport, Bills, Shopping, Entertainment, Health, Others).'n    ),
  amount: z.number().optional().describe('The extracted amount from the notification, if available.'),
  merchant: z.string().optional().describe('The extracted merchant name from the notification, if available.'),
});
export type AutomaticExpenseCategorizationOutput = z.infer<typeof AutomaticExpenseCategorizationOutputSchema>;

export async function automaticExpenseCategorization(
  input: AutomaticExpenseCategorizationInput
): Promise<AutomaticExpenseCategorizationOutput> {
  return automaticExpenseCategorizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automaticExpenseCategorizationPrompt',
  input: {schema: AutomaticExpenseCategorizationInputSchema},
  output: {schema: AutomaticExpenseCategorizationOutputSchema},
  prompt: `You are a personal finance assistant that automatically categorizes expenses based on SMS or UPI notifications.

  Analyze the following notification text and determine the most appropriate expense category, extract the expense amount (if present), and the merchant name (if present). Return the results as a JSON object.

  Notification Text: {{{notificationText}}}

  Expense Categories: Food, Transport, Bills, Shopping, Entertainment, Health, Others`,
});

const automaticExpenseCategorizationFlow = ai.defineFlow(
  {
    name: 'automaticExpenseCategorizationFlow',
    inputSchema: AutomaticExpenseCategorizationInputSchema,
    outputSchema: AutomaticExpenseCategorizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
