import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Invoice, InvoiceStatus } from '../_types/invoice';
import { mockInvoices } from '../_mocks/invoices';
import { mockApiResponse, maybeThrowError } from './api';

// In-memory store for modifications
let invoiceStore = [...mockInvoices];

export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...invoiceKeys.lists(), filters] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

// Query hooks
export const useInvoices = (filters: {
  status?: InvoiceStatus;
  region?: string;
  riskThreshold?: number;
  slaOnly?: boolean;
} = {}) => {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: async () => {
      maybeThrowError('Erro ao carregar faturas');

      let filtered = [...invoiceStore];

      if (filters.status) {
        filtered = filtered.filter(inv => inv.status === filters.status);
      }

      if (filters.region) {
        filtered = filtered.filter(inv => inv.region === filters.region);
      }

      if (filters.riskThreshold && filters.riskThreshold > 0) {
        filtered = filtered.filter(inv => (inv.riskScore || 0) >= filters.riskThreshold!);
      }

      if (filters.slaOnly) {
        filtered = filtered.filter(inv => (inv.slaHoursLeft || 0) < 12);
      }

      // Sort by SLA (most urgent first)
      filtered.sort((a, b) => (a.slaHoursLeft || 0) - (b.slaHoursLeft || 0));

      return mockApiResponse(filtered);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: async () => {
      maybeThrowError('Erro ao carregar fatura');
      const invoice = invoiceStore.find(inv => inv.id === id);
      if (!invoice) throw new Error('Fatura não encontrada');
      return mockApiResponse(invoice);
    },
    enabled: !!id,
  });
};

// Mutation hooks
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoiceId,
      status,
      justification
    }: {
      invoiceId: string;
      status: InvoiceStatus;
      justification: string;
    }) => {
      maybeThrowError('Erro ao atualizar status da fatura');

      const invoiceIndex = invoiceStore.findIndex(inv => inv.id === invoiceId);
      if (invoiceIndex === -1) throw new Error('Fatura não encontrada');

      invoiceStore[invoiceIndex] = {
        ...invoiceStore[invoiceIndex],
        status
      };

      return mockApiResponse({
        invoice: invoiceStore[invoiceIndex],
        justification
      });
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
      queryClient.setQueryData(
        invoiceKeys.detail(data.invoice.id),
        data.invoice
      );
    },
  });
};

export const useBulkInvoiceAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoiceIds,
      action,
      justification
    }: {
      invoiceIds: string[];
      action: InvoiceStatus;
      justification: string;
    }) => {
      maybeThrowError('Erro na ação em lote');

      const updatedInvoices = invoiceIds.map(id => {
        const index = invoiceStore.findIndex(inv => inv.id === id);
        if (index !== -1) {
          invoiceStore[index] = { ...invoiceStore[index], status: action };
          return invoiceStore[index];
        }
        return null;
      }).filter(Boolean);

      return mockApiResponse({
        updatedInvoices,
        action,
        justification
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
};