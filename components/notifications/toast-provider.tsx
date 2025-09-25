'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  XIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  InfoIcon,
  BellIcon
} from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration: duration || 7000 });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration: duration || 6000 });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'info': return <InfoIcon className="w-5 h-5 text-blue-600" />;
      default: return <BellIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info
    }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <Card
            key={toast.id}
            className={`p-4 shadow-lg pointer-events-auto transform transition-all duration-300 animate-in slide-in-from-right-full ${getToastStyles(toast.type)}`}
          >
            <div className="flex items-start gap-3">
              {getToastIcon(toast.type)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{toast.title}</p>
                {toast.message && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {toast.message}
                  </p>
                )}
                {toast.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={toast.action.onClick}
                  >
                    {toast.action.label}
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                onClick={() => removeToast(toast.id)}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook for system notifications (SLA alerts, etc.)
export function useSystemNotifications() {
  const { warning, error, info, success } = useToast();

  const notifySLAAlert = (count: number, hoursRemaining: number) => {
    error(
      'SLA Crítico',
      `${count} faturas com SLA vencendo em ${hoursRemaining}h`,
      0, // Don't auto-dismiss critical alerts
    );
  };

  const notifyPerformanceIssue = (system: string, metric: string, value: string) => {
    warning(
      'Performance Degradada',
      `${system}: ${metric} em ${value}`,
      8000
    );
  };

  const notifyIntegrationIssue = (system: string, status: string) => {
    error(
      'Problema de Integração',
      `${system} está ${status}`,
      0
    );
  };

  const notifyBackupComplete = (size: string, duration: string) => {
    success(
      'Backup Concluído',
      `${size} processados em ${duration}`,
      4000
    );
  };

  const notifySecurityAlert = (event: string, details: string) => {
    error(
      'Alerta de Segurança',
      `${event}: ${details}`,
      0
    );
  };

  const notifyGoalAchieved = (metric: string, current: number, target: number) => {
    success(
      'Meta Atingida!',
      `${metric}: ${current}% (meta: ${target}%)`,
      6000
    );
  };

  return {
    notifySLAAlert,
    notifyPerformanceIssue,
    notifyIntegrationIssue,
    notifyBackupComplete,
    notifySecurityAlert,
    notifyGoalAchieved
  };
}