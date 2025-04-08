import { FinanceDetail } from "@/components/finance/finance-detail"

export default function FinanceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <FinanceDetail financeId={params.id} />
    </div>
  )
}
