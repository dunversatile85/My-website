
"use client";

import AppHeader from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 overflow-hidden p-8">
        <div className="flex h-full w-full items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome to Don's PlayWorld!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Explore and earn rewards!</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
