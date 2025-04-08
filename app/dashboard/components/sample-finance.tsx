"use client"

import { useState, useEffect } from "react"
import { DollarSign } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"

export function SampleFinance() {
  const [isLoading, setIsLoading] = useState(true)
  
  // Sample data
  const sampleSummary = {
    total_income: "15000000",
    total_expense: "7500000",
    current_balance: "7500000"
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  // Format currency function
  const formatRupiah = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue)
  }

  return (
    <StatCard
      title="Keuangan"
      value={formatRupiah(sampleSummary.current_balance)}
      isLoading={isLoading}
      description="Saldo bersih"
      trend="up"
      percentage={0}
      icon={DollarSign}
      color="green"
    />
  )
}
