'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'success';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      default:
        return <AlertTriangleIcon className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'success':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}