'use server';

import {ai} from '@/ai/genkit';
import { Message } from 'genkit';
import {z} from 'zod';

const ChatHistorySchema = z.array(
  z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({text: z.string()})),
  })
);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;

export const chat = ai.defineFlow(
  {
    name: 'chat',
    inputSchema: z.object({
      history: ChatHistorySchema,
      message: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({history, message}) => {
    const systemPrompt = `You are a helpful AI assistant for a ride-sharing driver using the DriveWise app. Your goal is to provide concise, actionable advice to help them maximize their earnings, improve their ratings, and manage their well-being.

Keep your responses short and to the point. The driver is likely busy and needs quick answers.

Available tools: None

Example topics:
- Best times/locations to drive
- Strategies for getting more tips
- Dealing with difficult passengers
- Vehicle maintenance reminders
- Promoting driver safety and wellness (e.g., taking breaks)
`;

    const geminiHistory = history.map(h => ({
      role: h.role,
      content: h.content,
    }));

    const response = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: message,
      history: geminiHistory as Message[],
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text;
  }
);
