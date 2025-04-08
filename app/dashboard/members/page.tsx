"use client"

import { useState } from "react"
import {
  Users,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

import { MemberForm } from "@/components/members/member-form"
import { MemberCard } from "@/components/members/member-card"
import { useMembers, useMemberMutations } from "@/hooks/useMembers"
import { Member } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // Fetch members
  const { data: membersData = {}, isLoading, refetch } = useMembers()

  // Member mutations
  const { createMember, updateMember, deleteMember } = useMemberMutations()

  // Process members data
  const allMembers = Object.entries(membersData || {}).flatMap(([_, members]) => members || []) as Member[]

  // Filter members based on search query and active tab
  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab = activeTab === "all" || member.division === activeTab

    return matchesSearch && matchesTab
  })

  // Get unique divisions for tabs
  const divisions = ["all", ...new Set(allMembers.map(member => member.division))]

  // Handle create member
  const handleCreateMember = (data: any) => {
    createMember.mutate(data, {
      onSuccess: () => {
        setIsAddDialogOpen(false)
        refetch()
      }
    })
  }

  // Handle edit member
  const handleEditMember = (data: any) => {
    if (!selectedMember) return

    updateMember.mutate(data, {
      onSuccess: () => {
        setIsEditDialogOpen(false)
        setSelectedMember(null)
        refetch()
      }
    })
  }

  // Handle delete member
  const handleDeleteMember = () => {
    if (!selectedMember) return

    deleteMember.mutate(selectedMember.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        setSelectedMember(null)
        refetch()
      }
    })
  }

  // Open edit dialog
  const openEditDialog = (member: Member) => {
    setSelectedMember(member)
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (member: Member) => {
    setSelectedMember(member)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Anggota</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Anggota Baru</DialogTitle>
            </DialogHeader>
            <MemberForm
              onSubmit={handleCreateMember}
              isSubmitting={createMember.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Cari anggota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="overflow-x-auto">
            {divisions.map((division) => (
              <TabsTrigger key={division} value={division}>
                {division === "all" ? "Semua" : division}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4 pb-0 flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full mb-2" />
                <Skeleton className="h-5 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2 mb-2" />
              </CardHeader>
              <CardContent className="p-4 pt-2 text-center">
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
              </CardContent>
              <div className="p-4 pt-0 flex justify-between">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Tidak ada anggota yang ditemukan</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Anggota</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <MemberForm
              defaultValues={{
                full_name: selectedMember.full_name,
                division: selectedMember.division,
                position: selectedMember.position,
                // Other fields will be filled from API
                email: "",
                phone_number: "",
                birth_date: new Date(),
                address: "",
              }}
              onSubmit={handleEditMember}
              isSubmitting={updateMember.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Anggota</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMember.isPending}
            >
              {deleteMember.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
