
'use client';

import { useState, useEffect } from 'react';
import { Bot, User, Send, Loader2, LayoutDashboard, Settings, CarFront, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { chat, type ChatHistory } from '@/ai/flows/chat';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SettingsDialog } from '@/app/components/dashboard/settings-dialog';
import type { Settings as AppSettings } from '@/app/lib/data';
import { Header } from '../components/dashboard/header';

type Message = {
  role: 'user' | 'model';
  content: string;
};

function FormattedMessage({ content }: { content: string }) {
  const formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\* (.*?)(?=\n\* |$)/g, '<li>$1</li>')
    .replace(
      /(\d)\. (.*?)(?=\n\d\. |$)/g,
      '<li style="list-style-type: decimal; margin-left: 20px;">$2</li>'
    );

  const createMarkup = () => {
    return { __html: formattedContent.replace(/\n/g, '<br />') };
  };

  return <div dangerouslySetInnerHTML={createMarkup()} />;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    name: 'Karen',
    currency: '€',
    country: 'Netherlands',
    city: '3',
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      setMessages([{ role: 'model', content: prompt }]);
    }
  }, [searchParams]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory: ChatHistory = newMessages.slice(0, -1).map((msg) => ({
        role: msg.role,
        content: [{ text: msg.content }],
      }));

      const response = await chat({
        history: chatHistory,
        message: currentInput,
      });

      const modelMessage: Message = { role: 'model', content: response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error calling chat flow:', error);
      const errorMessage: Message = {
        role: 'model',
        content:
          "Sorry, I'm having trouble connecting. Please check your API key and try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
           <div className="p-4 sm:hidden">
              <Header />
            </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton
                  tooltip="Dashboard"
                  isActive={pathname === '/'}
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/driving">
                <SidebarMenuButton tooltip="Driving" isActive={pathname === '/driving'}>
                  <CarFront />
                  <span>Driving</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/chatbot">
                <SidebarMenuButton
                  tooltip="AI Chatbot"
                  isActive={pathname === '/chatbot'}
                >
                  <Bot />
                  <span>AI Chatbot</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" onClick={() => setIsSettingsOpen(true)}>
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background">
          <div className="hidden sm:block">
            <Header />
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl">
              <Card className="h-[80vh] flex flex-col">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Bot className="h-6 w-6 text-accent" />
                  <CardTitle>AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            'flex items-start gap-3',
                            message.role === 'user' ? 'justify-end' : ''
                          )}
                        >
                          {message.role === 'model' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <Bot />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              'rounded-lg px-4 py-2 text-sm max-w-[80%]',
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                          >
                            {message.role === 'user' ? (
                              <p>{message.content}</p>
                            ) : (
                              <FormattedMessage content={message.content} />
                            )}
                          </div>
                          {message.role === 'user' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <User />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <Bot />
                            </AvatarFallback>
                          </Avatar>
                          <div className="rounded-lg px-4 py-2 text-sm bg-muted flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 border-t pt-4"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask for driving tips..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
      <SettingsDialog settings={settings} onSettingsChange={setSettings} open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  );
}
