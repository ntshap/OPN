"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { financeApi, type Finance, type FinanceFormData, type FinanceHistoryResponse, extractErrorMessage } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Query keys
export const financeKeys = {
  all: ["finances"] as const,
  lists: () => [...financeKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...financeKeys.lists(), filters] as const,
  details: () => [...financeKeys.all, "detail"] as const,
  detail: (id: number | string) => [...financeKeys.details(), id] as const,
  summary: () => [...financeKeys.all, "summary"] as const,
}

// Hook for fetching finance history
export function useFinanceHistory(params?: {
  skip?: number
  limit?: number
  category?: string
  start_date?: string
  end_date?: string
}) {
  const { toast } = useToast()

  return useQuery({
    queryKey: financeKeys.list(params || {}),
    queryFn: ({ signal }) => financeApi.getFinanceHistory(params, signal),
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Only retry once for other errors
      return failureCount < 1
    },
    // Better error handling
    onError: (error) => {
      console.error('Error in useFinanceHistory:', error)

      // Show toast only for non-canceled requests
      if (!axios.isCancel(error)) {
        toast({
          title: "Gagal memuat riwayat transaksi",
          description: "Menggunakan data cadangan",
          variant: "destructive"
        })
      }
    },
    // Reduce stale time and cache time
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}

// Hook for fetching finance summary
export function useFinanceSummary(params?: {
  start_date?: string
  end_date?: string
}) {
  const { toast } = useToast()

  return useQuery({
    queryKey: financeKeys.summary(),
    queryFn: ({ signal }) => financeApi.getFinanceSummary(params, signal),
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }

      // Determine if we should retry based on error type
      if (error instanceof Error) {
        // Retry on network errors and timeouts
        if (error.message === 'Network Error' || error.message.includes('timeout')) {
          // Retry up to 3 times for these specific errors
          return failureCount < 3
        }
      }

      // For other errors, retry once
      return failureCount < 1
    },
    // Better error handling
    onError: (error) => {
      console.error('Error in useFinanceSummary:', error)

      // Show toast only for non-canceled requests
      if (!axios.isCancel(error)) {
        // Prepare a more specific error message
        let errorMessage = "Menggunakan data cadangan";

        if (error instanceof Error) {
          if (error.message.includes('timeout')) {
            errorMessage = "Waktu permintaan habis. Menggunakan data cadangan.";
          } else if (error.message === 'Network Error') {
            errorMessage = "Masalah jaringan. Menggunakan data cadangan.";
          }
        }

        toast({
          title: "Gagal memuat data keuangan",
          description: errorMessage,
          variant: "destructive"
        })
      }
    },
    // Reduce stale time and cache time
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Set a longer timeout for this query
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  })
}

// Hook for fetching a single finance record
export function useFinance(id: number | string) {
  const { toast } = useToast()

  return useQuery({
    queryKey: financeKeys.detail(id),
    queryFn: ({ signal }) => financeApi.getFinance(id, signal),
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Only retry once for other errors
      return failureCount < 1
    },
    // Better error handling
    onError: (error) => {
      console.error(`Error in useFinance(${id}):`, error)

      // Show toast only for non-canceled requests
      if (!axios.isCancel(error)) {
        toast({
          title: "Gagal memuat detail transaksi",
          description: "Menggunakan data cadangan",
          variant: "destructive"
        })
      }
    },
    // Reduce stale time and cache time
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}

// Hook for finance mutations (create, update, delete)
export function useFinanceMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Create finance mutation
  const createFinance = useMutation({
    mutationFn: (data: FinanceFormData) => financeApi.createFinance(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.lists() })
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dibuat",
      })
      return data // Return the data for chaining
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      })
    },
  })

  // Update finance mutation
  const updateFinance = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<FinanceFormData> }) =>
      financeApi.updateFinance(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: financeKeys.lists() })
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil diperbarui",
      })
      return data // Return the data for chaining
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      })
    },
  })

  // Delete finance mutation
  const deleteFinance = useMutation({
    mutationFn: (id: number | string) => financeApi.deleteFinance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.lists() })
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dihapus",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      })
    },
  })

  // Upload document mutation
  const uploadDocument = useMutation({
    mutationFn: ({ financeId, file }: { financeId: number | string; file: File }) =>
      financeApi.uploadFinanceDocument(financeId, file),
    onSuccess: (_, { financeId }) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.detail(financeId) })
      toast({
        title: "Berhasil",
        description: "Dokumen berhasil diunggah",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      })
    },
  })

  return {
    createFinance,
    updateFinance,
    deleteFinance,
    uploadDocument,
  }
}
