
'use server';
/**
 * @fileOverview A flow to handle sending feedback from users.
 * 
 * - sendFeedback - A function that processes and "sends" user feedback.
 * - FeedbackInput - The input type for the sendFeedback function.
 * - FeedbackOutput - The return type for the sendFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FeedbackInputSchema = z.object({
  feedbackType: z.string().describe('The type of feedback (e.g., Bug, Feature Request, General).'),
  message: z.string().min(10, 'Feedback message must be at least 10 characters.').describe('The user\'s feedback message.'),
  email: z.string().email().optional().describe('The user\'s email address (optional).'),
});
export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

const FeedbackOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type FeedbackOutput = z.infer<typeof FeedbackOutputSchema>;

export async function sendFeedback(input: FeedbackInput): Promise<FeedbackOutput> {
  return sendFeedbackFlow(input);
}

const sendFeedbackFlow = ai.defineFlow(
  {
    name: 'sendFeedbackFlow',
    inputSchema: FeedbackInputSchema,
    outputSchema: FeedbackOutputSchema,
  },
  async (input) => {
    console.log('--- New Feedback Received ---');
    console.log('Type:', input.feedbackType);
    console.log('Message:', input.message);
    if (input.email) {
      console.log('From:', input.email);
    }
    console.log('-----------------------------');

    // In a real application, you would integrate an email service here.
    // For example, using a service like Resend, Nodemailer, or SendGrid.
    // 
    // Example with Resend (you would need to install the 'resend' package):
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: 'feedback@zenbiz.app',
    //   to: 'yoursabhishek46@gmail.com',
    //   subject: `New Feedback: ${input.feedbackType}`,
    //   html: `<p><strong>From:</strong> ${input.email || 'Anonymous'}</p><p><strong>Message:</strong></p><p>${input.message}</p>`,
    // });

    return {
      success: true,
      message: 'Thank you for your feedback! We have received your message.',
    };
  }
);
