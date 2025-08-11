'use client';

import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('@/components/providers'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-current" />
    </div>
  ),
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
