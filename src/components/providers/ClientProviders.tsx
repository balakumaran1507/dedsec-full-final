'use client';

import { AuthProvider } from '@/lib/auth/useAuth';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
