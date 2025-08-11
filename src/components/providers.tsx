
"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { FirebaseProvider } from "@/contexts/firebase-context";
import { PushNotificationsProvider } from "./push-notifications-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <AuthProvider>
        {children}
        <PushNotificationsProvider />
      </AuthProvider>
    </FirebaseProvider>
  );
}
