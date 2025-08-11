
'use client';

import { AuthProvider } from "@/contexts/auth-context";
import { PushNotificationsProvider } from "./push-notifications-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        {children}
        <PushNotificationsProvider />
    </AuthProvider>
  )
}
