import { FinanceDetail } from "@/components/finance/finance-detail"

type FinancePageParams = Promise<{ id: string }>

export default async function FinanceDetailPage({ params }: { params: FinancePageParams }) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { id } = await params

  return (
    <div className="container mx-auto py-6">
      <FinanceDetail financeId={id} />
    </div>
  )
}
