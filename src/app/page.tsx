"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppHeader from '@/components/app-header';
import { Spinner } from '@/components/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

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
                    <p>You are successfully logged in.</p>
                    {user?.email && <p className="mt-4">Your email: <strong>{user.email}</strong></p>}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
