
'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/spinner';

const Providers = dynamic(() => import('@/components/providers').then(m => m.Providers), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Spinner size="lg" />
    </div>
  ),
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
