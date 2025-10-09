
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CarFront, BarChart, BrainCircuit, Sparkles, Trophy, Globe, Target, ShieldCheck, TrendingUp, Bot } from 'lucide-react';
import Link from 'next/link';

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0 mt-1">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{children}</p>
        </div>
    </div>
);


export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-12">
        <header className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <CarFront className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold font-headline tracking-tight">DriveWise</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A personal digital co-pilot designed to help Uber earners maximize income, reduce stress, and stay safe.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
                <Globe className="h-8 w-8 text-accent" />
                <div>
                    <CardTitle className="text-2xl">The Hackathon Challenge: Smart Earner Assistant</CardTitle>
                    <CardDescription>Transforming the earner experience with generative AI and predictive analytics.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90 border-t pt-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg"><BrainCircuit className="h-5 w-5 text-accent"/>The Core Problem</h3>
              <p className="text-muted-foreground">
                Millions of people rely on Uber to earn, but it's a dynamic and demanding job. Earners constantly face complex decisions: Where is the demand highest? When is the best time to drive? How can I hit my bonus goals without burning out? The mental load of optimizing every moment while navigating traffic and prioritizing safety is a significant challenge.
              </p>
            </div>
             <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5 text-accent"/>Our Vision: DriveWise</h3>
              <p className="text-muted-foreground">
                We envisioned "DriveWise," a proactive, AI-powered assistant integrated directly into the earner's workflow. It's more than a tool; it's a partner that balances efficiency, earnings, and safety. By providing concrete, data-driven recommendations and timely wellness nudges, we empower earners to make smarter real-time choices, tangibly improving their daily lives and maximizing their success on the platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                 <div className="flex items-center gap-4">
                    <Trophy className="h-8 w-8 text-accent" />
                    <div>
                        <CardTitle className="text-2xl">What We Built: Core Features</CardTitle>
                        <CardDescription>A suite of intelligent tools to create a balanced, optimal, and efficient journey.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 border-t pt-6">
                <FeatureCard icon={<BarChart className="h-5 w-5"/>} title="Performance Dashboards">
                    The <strong>Weekly Summary</strong> and <strong>Daily Highlights</strong> provide a clear, at-a-glance view of key metrics like earnings, trips, and online time. This allows earners to track progress, understand their performance patterns, and identify their most profitable days.
                </FeatureCard>

                 <FeatureCard icon={<Target className="h-5 w-5"/>} title="Incentive & Bonus Tracking">
                    The <strong>Incentive Tracker</strong> gamifies goals like the "Weekend Quest." It visualizes progress, calculates the remaining trips needed, and provides a daily target to make hitting bonuses feel achievable and less stressful.
                </FeatureCard>
                
                 <FeatureCard icon={<TrendingUp className="h-5 w-5"/>} title="Predictive 'Busiest Time Finder'">
                    To reduce idle time, our <strong>Busiest Time Finder</strong> uses a predictive model. Earners input their availability, and the tool analyzes historical data to recommend the single most profitable hour to start driving, along with a suggested hotspot location.
                </FeatureCard>

                <FeatureCard icon={<Bot className="h-5 w-5"/>} title="AI-Powered Wellness Nudge">
                    Safety and well-being are paramount. After 4.5 hours of continuous driving, DriveWise automatically navigates the user to the <strong>AI Assistant</strong> with a proactive message, encouraging a break and offering tips for recharging. This directly addresses the challenge of promoting driver wellness.
                </AFeatureCard>
            </CardContent>
             <CardFooter className="text-center flex-col items-center justify-center">
                 <p className="text-sm text-muted-foreground mb-4">Explore the prototype and see these features in action.</p>
                <Link href="/dashboard" passHref>
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Launch DriveWise
                    </Button>
                </Link>
            </CardFooter>
        </Card>

        <footer className="text-center text-muted-foreground text-sm space-y-1">
          <p>A creative solution for the Uber Hackathon, built with Next.js, Genkit, and a user-centric design.</p>
          <p>&copy; 2024</p>
        </footer>
      </div>
    </div>
  );
}
