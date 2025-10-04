// This is a placeholder for the chatbot page.
// The chatbot functionality will be implemented in the next step.

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Bot className="h-6 w-6 text-accent" />
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[60vh] justify-center items-center text-center">
                <p className="text-lg text-muted-foreground">
                  The AI chatbot is coming soon!
                </p>
                <p className="text-sm text-muted-foreground/80 mt-2">
                  I'm ready to build the chat interface and wire it up to a Genkit flow. Just let me know what you'd like it to do.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
