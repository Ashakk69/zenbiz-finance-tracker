
'use server';
/**
 * @fileOverview An AI-powered receipt scanning flow.
 *
 * - scanReceipt - A function that scans a receipt image and extracts expense details.
 * - ScanReceiptInput - The input type for the scanReceipt function.
 * - ScanReceiptOutput - The return type for the scanReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanReceiptInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanReceiptInput = z.infer<typeof ScanReceiptInputSchema>;

const ScanReceiptOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The predicted category of the expense (Food, Transport, Bills, Shopping, Entertainment, Health, Others).'
    ),
  amount: z.number().describe('The extracted total amount from the receipt.'),
  merchant: z.string().describe('The extracted merchant name from the receipt.'),
});
export type ScanReceiptOutput = z.infer<typeof ScanReceiptOutputSchema>;

export async function scanReceipt(input: ScanReceiptInput): Promise<ScanReceiptOutput> {
  return scanReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanReceiptPrompt',
  input: {schema: ScanReceiptInputSchema},
  output: {schema: ScanReceiptOutputSchema},
  prompt: `You are an expert at reading receipts and extracting key information. Analyze the following receipt image.

  Your task is to identify the merchant's name, the total amount of the transaction, and categorize the expense into one of the following categories: Food, Transport, Bills, Shopping, Entertainment, Health, Others.

  Prioritize finding the final total amount, which often includes taxes or tips.

  Receipt Image: {{media url=photoDataUri}}

  Return the extracted information as a JSON object.`,
});

const scanReceiptFlow = ai.defineFlow(
  {
    name: 'scanReceiptFlow',
    inputSchema: ScanReceiptInputSchema,
    outputSchema: ScanReceiptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
