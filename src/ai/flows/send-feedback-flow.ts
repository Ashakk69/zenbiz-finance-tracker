
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
import { Resend } from 'resend';

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
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not found, skipping email sending.');
      // Simulating a successful submission for UI purposes
      return {
        success: true,
        message: 'Thank you for your feedback! (Dev mode: email not sent).',
      };
    }
    
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'onboarding@resend.dev', // Using Resend's free test domain
        to: 'yoursabhishek46@gmail.com',
        subject: `New Feedback: ${input.feedbackType}`,
        html: `<p><strong>From:</strong> ${input.email || 'Anonymous'}</p><p><strong>Message:</strong></p><p>${input.message}</p>`,
      });

      return {
        success: true,
        message: 'Thank you for your feedback! We have received your message.',
      };
    } catch (error) {
      console.error('Failed to send feedback email:', error);
      // In a real app, you might want more sophisticated error handling
      return {
        success: false,
        message: 'Sorry, we were unable to send your feedback at this time. Please try again later.',
      };
    }
  }
);

