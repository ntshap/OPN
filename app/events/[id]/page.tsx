import { EventDetail } from "@/components/events/event-detail"

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  // In a real application, we would fetch the event data from the API
  // For now, we'll use mock data
  const mockEvent = {
    id: parseInt(params.id),
    title: "Rapat Anggota Tahunan",
    description: "Rapat anggota tahunan untuk membahas program kerja dan evaluasi kegiatan.",
    date: "2025-04-15T10:00:00Z",
    time: "10:00:00",
    location: "Aula Utama",
    status: "akan datang",
    attendees: 150,
    created_by: 1,
    created_at: "2023-03-01T10:30:00Z",
    updated_at: "2023-03-01T10:30:00Z",
    photos: [
      {
        id: 1,
        photo_url: "https://images.unsplash.com/photo-1511578314322-379afb476865",
        uploaded_at: "2023-03-01T10:35:00Z"
      },
      {
        id: 2,
        photo_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
        uploaded_at: "2023-03-01T10:36:00Z"
      }
    ],
    minutes: "Hasil rapat:\n1. Pembukaan oleh ketua panitia\n2. Laporan kegiatan tahun sebelumnya\n3. Diskusi program kerja tahun ini\n4. Pemilihan koordinator baru\n5. Penutup\n\nKeputusan:\n- Program kerja disetujui dengan beberapa perubahan minor\n- Anggaran kegiatan akan ditinjau ulang bulan depan\n- Koordinator baru telah terpilih untuk periode 2023-2024"
  }

  return (
    <div className="container mx-auto py-6">
      <EventDetail
        event={mockEvent}
        onEdit={() => console.log("Edit event", params.id)}
        onDelete={() => console.log("Delete event", params.id)}
      />
    </div>
  )
}
