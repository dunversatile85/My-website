
import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster"
import { PushNotificationsProvider } from '@/components/push-notifications-provider';

export const metadata: Metadata = {
  title: 'Don’s PlayWorld',
  description: 'Welcome to Don’s PlayWorld!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <AuthProvider>
          {children}
          <Toaster />
          <PushNotificationsProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
