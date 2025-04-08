import { FinanceForm } from "@/components/finance/finance-form"
import { useFinanceMock } from "@/hooks/useFinance.mock"

export default function EditFinancePage({ params }: { params: { id: string } }) {
  // In a real implementation, we would fetch the finance data here
  // For now, we'll pass the ID to the form component
  
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Edit Transaksi Keuangan</h2>
        <FinanceForm isEditing={true} />
      </div>
    </div>
  )
}
