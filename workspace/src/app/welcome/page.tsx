'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CarFront, BarChart, BrainCircuit, Sparkles, Trophy, Globe } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <CarFront className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold font-headline tracking-tight">DriveWise</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Your Personal Digital Co-Pilot for Smarter Earning.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
                <Globe className="h-8 w-8 text-accent" />
                <div>
                    <CardTitle>Uber Hackathon Challenge: Smart Earner Assistant</CardTitle>
                    <CardDescription>Transforming the way earners work with generative AI and predictive analytics.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent"/>The Vision</h3>
              <p className="text-muted-foreground">
                Millions of people rely on Uber to earn. Yet, navigating cities, optimizing trips, and balancing well-being can be tough. This project is our answer: a personal digital co-pilot to help earners maximize their income, reduce stress, and stay safe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-accent"/>The Problem</h3>
              <p className="text-muted-foreground">
                We're creating an assistant that helps drivers make smarter real-time choices: when to drive, when to rest, or how to maximize bonuses. Our solution balances efficiency, earnings, and safety to tangibly improve earners’ everyday lives.
              </p>
            </div>
             <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><Trophy className="h-5 w-5 text-accent"/>What We Built: DriveWise</h3>
              <p className="text-muted-foreground">
                This prototype demonstrates key features like a weekly summary, daily performance highlights, incentive tracking, and AI-powered wellness nudges. It's a product-facing concept designed to enhance the earner experience.
              </p>
            </div>
            <div className="text-center pt-4">
                <Link href="/dashboard" passHref>
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Get Started
                    </Button>
                </Link>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-muted-foreground text-sm">
          A creative solution for the Uber Hackathon.
        </footer>
      </div>
    </div>
  );
}
