"use client"

import { useState, useEffect } from "react"
import { DollarSign } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { financeApi, USE_FALLBACK_DATA } from "@/lib/api"
import { apiClient } from "@/lib/api-client"
import axios from "axios"

export function RealFinance() {
  const [isLoading, setIsLoading] = useState(true)
  const [financeSummary, setFinanceSummary] = useState({
    total_income: "20000",
    total_expense: "5000",
    current_balance: "15000"
  })

  useEffect(() => {
    const fetchFinanceSummary = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching finance summary, USE_FALLBACK_DATA:', USE_FALLBACK_DATA)

        // Use our API client instead of direct axios calls
        const summary = await financeApi.getFinanceSummary()
        console.log('Fetched finance summary:', summary)

        setFinanceSummary({
          total_income: summary.total_income || "0",
          total_expense: summary.total_expense || "0",
          current_balance: summary.current_balance || "0"
        })
      } catch (error) {
        console.error('Error fetching finance summary:', error)

        // Only use fallback data if explicitly enabled
        if (USE_FALLBACK_DATA) {
          const fallbackSummary = {
            total_income: "20000",
            total_expense: "5000",
            current_balance: "15000"
          }

          setFinanceSummary(fallbackSummary)
          console.log('Using fallback finance summary due to error:', fallbackSummary)
        } else {
          // Show real error state in the UI
          setFinanceSummary({
            total_income: "0",
            total_expense: "0",
            current_balance: "0"
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchFinanceSummary()
  }, [])

  // Format currency function
  const formatRupiah = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
      .format(numValue)
      .replace(/^Rp\s*/, 'Rp') // Remove space after Rp
  }

  return (
    <StatCard
      title="Keuangan"
      value={formatRupiah(financeSummary.current_balance)}
      isLoading={isLoading}
      description="Saldo bersih"
      trend="up"
      percentage={0}
      icon={DollarSign}
      color="green"
    />
  )
}
