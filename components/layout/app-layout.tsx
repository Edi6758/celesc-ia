'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/app/_state/auth-store';
import { useUIStore } from '@/app/_state/ui-store';
import { LoginScreen } from '@/components/login-screen';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <Header />

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}