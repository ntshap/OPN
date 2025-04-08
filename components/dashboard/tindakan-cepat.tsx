"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  FileText, 
  Users, 
  Plus, 
  Upload,
  BarChart2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LazyEventForm } from "@/components/lazy-imports"
import { useToast } from "@/components/ui/use-toast"
import { eventApi } from "@/lib/api"

interface TindakanCepatProps {
  className?: string
}

export function TindakanCepat({ className }: TindakanCepatProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false)
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  // Fungsi untuk membuat acara baru
  const handleCreateEvent = async (data: any) => {
    try {
      setIsCreatingEvent(true)
      await eventApi.createEvent(data)
      setIsCreateEventDialogOpen(false)
      toast({
        title: "Berhasil",
        description: "Acara berhasil dibuat",
      })
      router.push("/dashboard/events")
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat membuat acara",
        variant: "destructive",
      })
    } finally {
      setIsCreatingEvent(false)
    }
  }

  // Fungsi untuk navigasi ke halaman laporan
  const handleViewReports = () => {
    router.push("/dashboard/news")
  }

  // Fungsi untuk navigasi ke halaman anggota tim
  const handleInviteTeam = () => {
    router.push("/dashboard/members")
  }

  // Fungsi untuk navigasi ke halaman pengumuman
  const handleCreateAnnouncement = () => {
    router.push("/dashboard/news?action=create")
  }

  // Fungsi untuk navigasi ke halaman unggah berkas
  const handleUploadFiles = () => {
    router.push("/dashboard/events?action=upload")
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Tindakan Cepat</h2>
        <p className="text-sm text-muted-foreground">Tugas umum dan pintasan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buat Acara */}
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent transition-colors"
          onClick={() => setIsCreateEventDialogOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Buat Acara</h3>
          <p className="text-xs text-muted-foreground">Jadwalkan acara baru</p>
        </Card>

        {/* Lihat Laporan */}
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent transition-colors"
          onClick={handleViewReports}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <BarChart2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Lihat Laporan</h3>
          <p className="text-xs text-muted-foreground">Periksa analitik</p>
        </Card>

        {/* Undang Tim */}
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent transition-colors"
          onClick={handleInviteTeam}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Undang Tim</h3>
          <p className="text-xs text-muted-foreground">Tambah anggota tim</p>
        </Card>

        {/* Postingan Baru */}
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent transition-colors"
          onClick={handleCreateAnnouncement}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Postingan Baru</h3>
          <p className="text-xs text-muted-foreground">Buat pengumuman</p>
        </Card>

        {/* Unggah Berkas */}
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent transition-colors"
          onClick={handleUploadFiles}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Unggah Berkas</h3>
          <p className="text-xs text-muted-foreground">Bagikan dokumen</p>
        </Card>
      </div>

      {/* Dialog untuk membuat acara baru */}
      <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Buat Acara Baru</DialogTitle>
          </DialogHeader>
          <LazyEventForm 
            onSubmit={handleCreateEvent}
            isSubmitting={isCreatingEvent}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
