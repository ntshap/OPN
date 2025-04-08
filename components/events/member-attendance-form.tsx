"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useMembers } from "@/hooks/useMembers"
import { useAttendanceMutations } from "@/hooks/useEvents"

interface MemberAttendanceFormProps {
  eventId: string | number
  onAttendanceChange?: (records: Array<{ member_id: number; status: string; notes: string }>) => void
}

export function MemberAttendanceForm({ eventId, onAttendanceChange }: MemberAttendanceFormProps) {
  const { toast } = useToast()
  const { data: members = [], isLoading: isMembersLoading } = useMembers()
  const { createOrUpdateAttendance } = useAttendanceMutations(eventId)

  // State for attendance records
  const [attendanceRecords, setAttendanceRecords] = useState<Array<{
    member_id: number;
    name: string;
    division: string;
    status: string;
    notes: string;
  }>>([])

  // Initialize attendance records from members data
  useEffect(() => {
    if (members && Object.keys(members).length > 0) {
      // Create initial attendance records for all members
      const initialRecords = Object.entries(members).flatMap(([division, membersList]) =>
        membersList.map(member => ({
          member_id: member.id,
          name: member.full_name,
          division: division,
          status: "Hadir", // Default status is present
          notes: ""
        }))
      )
      setAttendanceRecords(initialRecords)
    } else {
      // Use mock data when no members are available
      const mockMembers = [
        { member_id: 1, name: "Dian P", division: "members", status: "Hadir", notes: "" }
      ]
      setAttendanceRecords(mockMembers)
    }
  }, [members])

  // Handle status change
  const handleStatusChange = (memberId: number, status: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.member_id === memberId
          ? { ...record, status }
          : record
      )
    )
  }

  // Handle notes change
  const handleNotesChange = (memberId: number, notes: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.member_id === memberId
          ? { ...record, notes }
          : record
      )
    )
  }

  // Notify parent component when attendance records change
  useEffect(() => {
    if (onAttendanceChange && attendanceRecords.length > 0) {
      const formattedRecords = attendanceRecords.map(record => ({
        member_id: record.member_id,
        status: record.status,
        notes: record.notes
      }))
      onAttendanceChange(formattedRecords)
    }
  }, [attendanceRecords, onAttendanceChange])

  // Handle save all attendance records
  const handleSaveAttendance = async () => {
    try {
      // Format data for API
      const attendanceData = attendanceRecords.map(record => ({
        member_id: record.member_id,
        status: record.status,
        notes: record.notes
      }))

      // Call API to save attendance
      await createOrUpdateAttendance.mutateAsync(attendanceData)

      toast({
        title: "Berhasil",
        description: "Data kehadiran berhasil disimpan",
      })
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data kehadiran",
        variant: "destructive"
      })
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "success"
      case "izin":
        return "warning"
      case "tidak hadir":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">

      {isMembersLoading ? (
        <div className="text-center py-4">
          <p>Memuat data anggota...</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b bg-gray-50">
              <div>Nama</div>
              <div>Divisi</div>
              <div>Status</div>
              <div>Keterangan</div>
            </div>

            {attendanceRecords.map((record) => (
              <div key={record.member_id} className="grid grid-cols-4 gap-4 p-4 border-b bg-white even:bg-gray-50">
                <div>{record.name}</div>
                <div>{record.division}</div>
                <div>
                  <Select
                    value={record.status}
                    onValueChange={(value) => handleStatusChange(record.member_id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hadir">Hadir</SelectItem>
                      <SelectItem value="Tidak Hadir">Tidak Hadir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    placeholder="Masukkan keterangan"
                    value={record.notes}
                    onChange={(e) => handleNotesChange(record.member_id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>


        </>
      )}
    </div>
  )
}
