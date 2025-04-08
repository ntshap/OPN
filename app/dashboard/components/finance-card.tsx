"use client"

import { DollarSign } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"

export function FinanceCard() {
  // Hardcoded value to match the Manajemen Keuangan section
  const currentBalance = "15000"
  
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
      value={formatRupiah(currentBalance)}
      isLoading={false}
      description="Saldo bersih"
      trend="up"
      percentage={0}
      icon={DollarSign}
      color="green"
    />
  )
}
