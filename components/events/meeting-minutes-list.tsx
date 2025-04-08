import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Plus, AlertCircle, Lock, FileText, Trash } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { useMeetingMinutesByEvent, useMeetingMinutesMutations } from "@/hooks/useMeetingMinutes"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MeetingMinutesForm } from "./meeting-minutes-form"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { TipTapContent } from "@/components/ui/tiptap-editor"

interface MeetingMinutesListProps {
  eventId: number
}

export function MeetingMinutesList({ eventId }: MeetingMinutesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Fetch meeting minutes for this event
  const { data: meetingMinutes, isLoading, error, refetch } = useMeetingMinutesByEvent(eventId)
  const { createMeetingMinutes, updateMeetingMinutes, deleteMeetingMinutes } = useMeetingMinutesMutations()

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy", { locale: id })
    } catch (error) {
      return dateString
    }
  }

  // Handle form submission for creating new meeting minutes
  const handleCreateMinutes = (data: any) => {
    try {
      // Format the date as a string for the API
      const formattedData = {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
        event_id: Number(eventId),
        // Handle empty document URL
        document_url: data.document_url || undefined,
        // Ensure description is a string
        description: data.description || ''
      }

      // Log the data being sent to the API for debugging
      console.log('Creating meeting minutes with data:', formattedData)

      // Validate required fields
      if (!formattedData.title) {
        toast({
          title: "Validasi Gagal",
          description: "Judul notulensi harus diisi",
          variant: "destructive",
        })
        return;
      }

      if (!formattedData.description) {
        toast({
          title: "Validasi Gagal",
          description: "Deskripsi notulensi harus diisi",
          variant: "destructive",
        })
        return;
      }

      createMeetingMinutes.mutate(formattedData, {
        onSuccess: () => {
          setIsDialogOpen(false)
          refetch()
          toast({
            title: "Berhasil",
            description: "Notulensi berhasil dibuat",
          })
        },
        onError: (error) => {
          console.error('Error creating meeting minutes:', error)

          // Show more specific error messages based on the error type
          let errorMessage = "Terjadi kesalahan saat membuat notulensi";

          if (error instanceof Error) {
            // Use the error message from the API if available
            errorMessage = error.message;
          }

          toast({
            title: "Gagal",
            description: errorMessage,
            variant: "destructive",
          })

          // Keep the dialog open so the user can try again
          // setIsDialogOpen(false)
        }
      })
    } catch (error) {
      console.error('Error in handleCreateMinutes:', error)
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memproses data notulensi",
        variant: "destructive",
      })
    }
  }

  // Handle deleting meeting minutes
  const handleDeleteMinutes = (id: number) => {
    try {
      deleteMeetingMinutes.mutate(id, {
        onSuccess: () => {
          refetch()
          toast({
            title: "Berhasil",
            description: "Notulensi berhasil dihapus",
          })
        },
        onError: (error) => {
          console.error('Error deleting meeting minutes:', error)

          // Show more specific error messages based on the error type
          let errorMessage = "Terjadi kesalahan saat menghapus notulensi";

          if (error instanceof Error) {
            // Use the error message from the API if available
            errorMessage = error.message;
          }

          toast({
            title: "Gagal",
            description: errorMessage,
            variant: "destructive",
          })
        }
      })
    } catch (error) {
      console.error('Error in handleDeleteMinutes:', error)
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus notulensi",
        variant: "destructive",
      })
    }
  }

  // If there's an error, show a message with a retry button
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notulensi Rapat</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Terjadi kesalahan saat memuat notulensi rapat. Silakan coba lagi nanti.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Notulensi Rapat</CardTitle>
            <Skeleton className="h-9 w-32" /> {/* Button skeleton */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Skeleton className="h-5 w-40 mb-1" /> {/* Title skeleton */}
                  <Skeleton className="h-4 w-24" /> {/* Date skeleton */}
                </div>
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Action button skeleton */}
              </div>
              <div className="mb-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Notulensi Rapat</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Notulensi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tambah Notulensi Rapat</DialogTitle>
              </DialogHeader>
              <MeetingMinutesForm
                eventId={Number(eventId)}
                onSubmit={handleCreateMinutes}
                isSubmitting={createMeetingMinutes.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {meetingMinutes && meetingMinutes.length > 0 ? (
          <div className="space-y-4">
            {meetingMinutes.map((minutes) => (
              <div key={minutes.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{minutes.title}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(minutes.date)}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Notulensi</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus notulensi ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteMinutes(minutes.id)}>
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="mb-3 prose max-w-none">
                  {minutes.description && minutes.description.trim() !== '' ? (
                    <div dangerouslySetInnerHTML={{ __html: minutes.description }} />
                  ) : (
                    <p className="text-gray-500 italic">Tidak ada deskripsi</p>
                  )}
                </div>
                {minutes.document_url && (
                  <a
                    href={minutes.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Lihat Dokumen
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Belum ada notulensi untuk acara ini</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Tambah Notulensi
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
