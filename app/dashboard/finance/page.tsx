"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Loader2, ArrowDown, ArrowUp, Edit, Trash2 } from "lucide-react"
import { TransactionForm } from "./components/transaction-form"
import { toast } from "@/components/ui/use-toast"
import { useFinanceHistory, useFinanceSummary, useFinanceMutations } from "@/hooks/useFinance"
import { formatRupiah } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Transaction {
  id: number
  date: string
  description: string
  amount: number
  type: "income" | "expense"
}

export default function FinancePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null)

  // Fetch finance history and summary from API with error handling
  const { data: financeData, isLoading: isLoadingHistory, refetch, error: historyError } = useFinanceHistory()
  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useFinanceSummary()

  // Show toast if there are errors
  useEffect(() => {
    if (historyError) {
      toast({
        title: "Error",
        description: "Gagal memuat data transaksi. Silakan coba lagi nanti.",
        variant: "destructive",
      })
    }

    if (summaryError) {
      toast({
        title: "Error",
        description: "Gagal memuat ringkasan keuangan. Silakan coba lagi nanti.",
        variant: "destructive",
      })
    }
  }, [historyError, summaryError, toast])
  const { createFinance, updateFinance, deleteFinance } = useFinanceMutations()

  // Extract transactions from finance history
  const transactions = financeData?.transactions || []

  // Get summary data
  const totalIncome = summaryData?.total_income ? summaryData.total_income : "0"
  const totalExpense = summaryData?.total_expense ? summaryData.total_expense : "0"
  const currentBalance = financeData?.current_balance ? financeData.current_balance : "0"

  const handleAddTransaction = (data: any) => {
    // Convert form data to API format
    const financeData = {
      amount: Number(data.amount),
      category: data.type === "income" ? "Pemasukan" : "Pengeluaran",
      date: data.date.toISOString(),
      description: data.description
    }

    // Call the API to create a new finance record
    createFinance.mutate(financeData, {
      onSuccess: () => {
        setIsDialogOpen(false)
        refetch() // Refresh the data after adding a new transaction
      }
    })
  }

  const handleEditTransaction = (data: any) => {
    if (!transactionToEdit) return

    // Convert form data to API format
    const financeData = {
      amount: Number(data.amount),
      category: data.type === "income" ? "Pemasukan" : "Pengeluaran",
      date: data.date.toISOString(),
      description: data.description
    }

    // Call the API to update the finance record
    updateFinance.mutate({
      id: transactionToEdit.id,
      data: financeData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false)
        setTransactionToEdit(null)
        refetch() // Refresh the data after updating the transaction
      }
    })
  }

  const handleDeleteTransaction = () => {
    if (!transactionToDelete) return

    // Call the API to delete the finance record
    deleteFinance.mutate(transactionToDelete, {
      onSuccess: () => {
        setIsDeleteAlertOpen(false)
        setTransactionToDelete(null)
        refetch() // Refresh the data after deleting the transaction
      }
    })
  }

  const openEditDialog = (transaction: Transaction) => {
    setTransactionToEdit(transaction)
    setIsEditDialogOpen(true)
  }

  const openDeleteAlert = (id: number) => {
    setTransactionToDelete(id)
    setIsDeleteAlertOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Keuangan</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Transaksi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Transaksi Baru</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={handleAddTransaction} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-green-600">{formatRupiah(totalIncome)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-red-600">{formatRupiah(totalExpense)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saldo Saat Ini</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold">{formatRupiah(currentBalance)}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada transaksi</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(parseISO(transaction.date), "dd MMM yyyy")}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {transaction.category === "Pemasukan" ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                          <ArrowDown className="mr-1 h-3 w-3" />
                          {transaction.category}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <ArrowUp className="mr-1 h-3 w-3" />
                          {transaction.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={transaction.category === "Pemasukan" ? "text-green-600" : "text-red-600"}>
                        {formatRupiah(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => openDeleteAlert(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
          </DialogHeader>
          {transactionToEdit && (
            <TransactionForm
              onSubmit={handleEditTransaction}
              defaultValues={{
                date: new Date(transactionToEdit.date),
                description: transactionToEdit.description,
                amount: String(transactionToEdit.amount),
                type: transactionToEdit.category === "Pemasukan" ? "income" : "expense"
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Transaction Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTransaction}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

