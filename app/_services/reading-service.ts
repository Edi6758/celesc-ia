import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReadingEvidence } from '../_types/reading';
import { mockReadings } from '../_mocks/readings';
import { mockApiResponse, maybeThrowError } from './api';

let readingStore = [...mockReadings];

export const readingKeys = {
  all: ['readings'] as const,
  lists: () => [...readingKeys.all, 'list'] as const,
  list: (invoiceId: string) => [...readingKeys.lists(), invoiceId] as const,
  details: () => [...readingKeys.all, 'detail'] as const,
  detail: (id: string) => [...readingKeys.details(), id] as const,
};

export const useReadingsByInvoice = (invoiceId: string) => {
  return useQuery({
    queryKey: readingKeys.list(invoiceId),
    queryFn: async () => {
      maybeThrowError('Erro ao carregar evidências de leitura');
      const readings = readingStore.filter(reading => reading.invoiceId === invoiceId);
      return mockApiResponse(readings);
    },
    enabled: !!invoiceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useReading = (id: string) => {
  return useQuery({
    queryKey: readingKeys.detail(id),
    queryFn: async () => {
      maybeThrowError('Erro ao carregar evidência');
      const reading = readingStore.find(r => r.id === id);
      if (!reading) throw new Error('Evidência não encontrada');
      return mockApiResponse(reading);
    },
    enabled: !!id,
  });
};

export const useCreateReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReading: Omit<ReadingEvidence, 'id'>) => {
      maybeThrowError('Erro ao registrar leitura');

      const reading: ReadingEvidence = {
        ...newReading,
        id: `EVD-${Date.now()}`
      };

      readingStore.push(reading);
      return mockApiResponse(reading, 800); // Simulate OCR processing time
    },
    onSuccess: (newReading) => {
      queryClient.invalidateQueries({
        queryKey: readingKeys.list(newReading.invoiceId)
      });
    },
  });
};

export const useUpdateReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: Partial<ReadingEvidence>;
    }) => {
      maybeThrowError('Erro ao atualizar leitura');

      const index = readingStore.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Evidência não encontrada');

      readingStore[index] = { ...readingStore[index], ...updates };
      return mockApiResponse(readingStore[index]);
    },
    onSuccess: (updatedReading) => {
      queryClient.setQueryData(
        readingKeys.detail(updatedReading.id),
        updatedReading
      );
      queryClient.invalidateQueries({
        queryKey: readingKeys.list(updatedReading.invoiceId)
      });
    },
  });
};

// Mock OCR service
export const useOCRAnalysis = () => {
  return useMutation({
    mutationFn: async (imageUrl: string) => {
      maybeThrowError('Erro no processamento OCR');

      // Simulate OCR processing
      const mockOCR = {
        digits: String(Math.floor(Math.random() * 9000000) + 1000000),
        confidence: 0.75 + Math.random() * 0.24, // 0.75-0.99
        serial: `MTR${Math.floor(Math.random() * 9000) + 1000}`,
        quality: Math.random() > 0.2 ? 'GOOD' : 'BLURRY'
      };

      return mockApiResponse(mockOCR, 2000); // 2s processing time
    },
  });
};