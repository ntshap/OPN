"use client"

import { useState } from "react"
import { type Finance, type FinanceFormData, type FinanceHistoryResponse } from "@/lib/api"

// Mock data for finances
const mockFinances: Finance[] = [
  {
    id: 1,
    amount: "1000000",
    category: "Pemasukan",
    date: "2023-04-01T10:00:00Z",
    description: "Sumbangan anggota",
    balance_before: "5000000",
    balance_after: "6000000",
    document_url: null,
    created_by: 1,
    created_at: "2023-04-01T10:00:00Z",
    updated_at: "2023-04-01T10:00:00Z"
  },
  {
    id: 2,
    amount: "500000",
    category: "Pengeluaran",
    date: "2023-04-05T14:00:00Z",
    description: "Pembelian alat tulis",
    balance_before: "6000000",
    balance_after: "5500000",
    document_url: "https://example.com/document1.pdf",
    created_by: 1,
    created_at: "2023-04-05T14:00:00Z",
    updated_at: "2023-04-05T14:00:00Z"
  },
  {
    id: 3,
    amount: "2000000",
    category: "Pemasukan",
    date: "2023-04-10T09:30:00Z",
    description: "Donasi",
    balance_before: "5500000",
    balance_after: "7500000",
    document_url: null,
    created_by: 1,
    created_at: "2023-04-10T09:30:00Z",
    updated_at: "2023-04-10T09:30:00Z"
  },
  {
    id: 4,
    amount: "750000",
    category: "Pengeluaran",
    date: "2023-04-15T13:45:00Z",
    description: "Konsumsi rapat",
    balance_before: "7500000",
    balance_after: "6750000",
    document_url: "https://example.com/document2.pdf",
    created_by: 1,
    created_at: "2023-04-15T13:45:00Z",
    updated_at: "2023-04-15T13:45:00Z"
  },
  {
    id: 5,
    amount: "1500000",
    category: "Pemasukan",
    date: "2023-04-20T11:15:00Z",
    description: "Iuran bulanan",
    balance_before: "6750000",
    balance_after: "8250000",
    document_url: null,
    created_by: 1,
    created_at: "2023-04-20T11:15:00Z",
    updated_at: "2023-04-20T11:15:00Z"
  }
]

// Mock finance history response
const mockFinanceHistory: FinanceHistoryResponse = {
  transactions: mockFinances,
  current_balance: "8250000"
}

// Mock finance summary
const mockFinanceSummary = {
  total_income: "4500000",
  total_expense: "1250000",
  net_change: "3250000",
  current_balance: "8250000",
  categories: {
    "Pemasukan": "4500000",
    "Pengeluaran": "1250000"
  }
}

// Hook for fetching finance history
export function useFinanceHistoryMock(params?: {
  skip?: number
  limit?: number
  category?: string
  start_date?: string
  end_date?: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Filter transactions based on params
  const filteredTransactions = mockFinances.filter(finance => {
    if (params?.category && finance.category !== params.category) return false
    if (params?.start_date && new Date(finance.date) < new Date(params.start_date)) return false
    if (params?.end_date && new Date(finance.date) > new Date(params.end_date)) return false
    return true
  })

  // Apply pagination
  const skip = params?.skip || 0
  const limit = params?.limit || 10
  const paginatedTransactions = filteredTransactions.slice(skip, skip + limit)

  const data: FinanceHistoryResponse = {
    transactions: paginatedTransactions,
    current_balance: mockFinanceHistory.current_balance
  }

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }
}

// Hook for fetching finance summary
export function useFinanceSummaryMock(params?: {
  start_date?: string
  end_date?: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  return {
    data: mockFinanceSummary,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }
}

// Hook for fetching a single finance record
export function useFinanceMock(id: number | string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const finance = mockFinances.find(f => f.id === Number(id))

  return {
    data: finance,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }
}

// Hook for finance mutations (create, update, delete)
export function useFinanceMutationsMock() {
  const [isLoading, setIsLoading] = useState(false)

  // Create finance mutation
  const createFinance = {
    mutate: (data: FinanceFormData, options?: { onSuccess?: (data: any) => void }) => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        console.log('Created finance:', data)
        // Create a mock response with an ID
        const mockResponse = {
          id: Math.floor(Math.random() * 1000) + 10,
          ...data,
          amount: String(data.amount), // Convert to string as the API would return
          balance_before: "5000000",
          balance_after: "5000000",
          document_url: null,
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        // Call onSuccess if provided
        if (options?.onSuccess) {
          options.onSuccess(mockResponse)
        }
      }, 1000)
    },
    isLoading
  }

  // Update finance mutation
  const updateFinance = {
    mutate: ({ id, data }: { id: number | string; data: Partial<FinanceFormData> }) => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        console.log(`Updated finance ${id}:`, data)
      }, 1000)
    },
    isLoading
  }

  // Delete finance mutation
  const deleteFinance = {
    mutate: (id: number | string) => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        console.log(`Deleted finance ${id}`)
      }, 1000)
    },
    isLoading
  }

  // Upload document mutation
  const uploadDocument = {
    mutate: ({ financeId, file }: { financeId: number | string; file: File }) => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        console.log(`Uploaded document for finance ${financeId}:`, file.name)
      }, 1000)
    },
    isLoading
  }

  return {
    createFinance,
    updateFinance,
    deleteFinance,
    uploadDocument
  }
}
