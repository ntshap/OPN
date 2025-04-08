import { FinanceForm } from "@/components/finance/finance-form"

export default function CreateFinancePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Tambah Transaksi Keuangan</h2>
        <FinanceForm />
      </div>
    </div>
  )
}
