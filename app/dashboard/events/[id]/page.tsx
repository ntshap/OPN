"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Download,
  Loader2,
  AlertCircle,
  Upload,
  ImageIcon,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useEvent, useEventAttendance, useEventMutations } from "@/hooks/useEvents"
import { UploadPhotosModal } from "@/components/events/upload-photos-modal"
import { MeetingMinutesList } from "@/components/events/meeting-minutes-list"
import { GallerySimple } from "@/components/events/gallery-simple"
import { AttendanceForm } from "@/components/events/attendance-form"
import { format, parseISO, isValid } from "date-fns"

export default function EventPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const eventId = params.id

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Fetch event data with refetch capability
  const { data: event, isLoading: isEventLoading, isError: isEventError, error: eventError, refetch } = useEvent(eventId)

  // Fetch attendees
  const { data: attendees = [], isLoading: isAttendeesLoading } = useEventAttendance(eventId)

  // Event mutations
  const { deleteEvent } = useEventMutations()

  // Format date for display
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const date = parseISO(dateString)
      return isValid(date) ? format(date, "PPP") : "Invalid date"
    } catch (error) {
      return "Invalid date"
    }
  }

  // Format time for display
  const formatEventTime = (timeString?: string) => {
    if (!timeString) return "N/A"
    try {
      // Extract time portion from ISO string or use as is
      const timeValue = timeString.includes("T") ? timeString.split("T")[1].substring(0, 5) : timeString.substring(0, 5)

      return timeValue
    } catch (error) {
      return "Invalid time"
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/events/edit/${eventId}`)
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleUploadPhotos = () => {
    setIsUploadModalOpen(true)
  }

  const confirmDelete = () => {
    deleteEvent.mutate(eventId, {
      onSuccess: () => {
        router.push("/dashboard/events")
      },
    })
    setIsDeleteDialogOpen(false)
  }

  const handleExport = () => {
    // TODO: Implement actual export functionality
    alert("Export functionality will be implemented soon")
  }

  // Loading state
  if (isEventLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Skeleton className="h-10 w-64 mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  if (isEventError || !event) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {eventError instanceof Error ? eventError.message : "Failed to load event details. Please try again."}
          </AlertDescription>
        </Alert>

        <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/events")}>
          Back to Events
        </Button>
      </div>
    )
  }

  // Determine event status
  const isUpcoming = event.status === "akan datang"

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/events")} className="ml-auto">
          Kembali
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tanggal</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">April 9th, 2025</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waktu</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEventTime(event.time)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lokasi</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tempat</div>
            <p className="text-xs text-muted-foreground">{event.location}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peserta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendees.length}</div>
            <p className="text-xs text-muted-foreground">Peserta terdaftar</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detail</TabsTrigger>
          <TabsTrigger value="photos">Dokumentasi</TabsTrigger>
          <TabsTrigger value="attendees">Daftar Hadir</TabsTrigger>
          <TabsTrigger value="notulensi">Notulensi</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detail Acara</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Judul</h4>
                  <p className="text-sm text-muted-foreground mt-1">{event.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Deskripsi</h4>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Tanggal</h4>
                  <p className="text-sm text-muted-foreground mt-1">April 9th, 2025</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Waktu</h4>
                  <p className="text-sm text-muted-foreground mt-1">{formatEventTime(event.time)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Lokasi</h4>
                  <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <div className="mt-1">
                    <Badge variant={isUpcoming ? "default" : "secondary"}>
                      {isUpcoming ? "Akan Datang" : "Selesai"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Hadir Peserta</CardTitle>
            </CardHeader>
            <CardContent>
              {isAttendeesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : attendees.length === 0 ? (
                <p className="text-muted-foreground">Belum ada peserta yang terdaftar untuk acara ini.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Member ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Catatan</TableHead>
                        <TableHead>Waktu Presensi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendees.map((attendee, index) => (
                        <TableRow key={attendee.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{attendee.member_id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
                              {attendee.status || 'Izin'}
                            </Badge>
                          </TableCell>
                          <TableCell>{attendee.notes || '-'}</TableCell>
                          <TableCell>{format(new Date(), "dd/MM/yyyy HH:mm")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Dokumentasi Acara</CardTitle>
            </CardHeader>
            <CardContent>
              <GallerySimple eventId={eventId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notulensi">
          <Card>
            <CardHeader>
              <CardTitle>Notulensi Acara</CardTitle>
            </CardHeader>
            <CardContent>
              <MeetingMinutesList eventId={Number(eventId)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus acara "{event.title}" secara permanen dan menghapus semua
              data terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteEvent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Photos Modal */}
      <UploadPhotosModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        eventId={eventId}
        onSuccess={() => {
          // Refetch event data to get updated photos
          refetch()
        }}
      />
    </div>
  )
}
