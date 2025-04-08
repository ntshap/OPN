"use client"

import type React from "react"
import { useState, useEffect, useLayoutEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Search,
  Menu,
  LogOut,
  ChevronDown,
  User,
  HelpCircle,
  BarChart3,

} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { NetworkStatus } from "@/components/ui/network-status"
import { MockApiIndicator } from "@/components/ui/mock-api-indicator"

// Dynamically import components that might cause hydration issues
const NotificationsDropdown = dynamic(
  () => import("@/components/notifications/notifications-dropdown").then(mod => mod.NotificationsDropdown),
  { ssr: false }
)

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if mobile on mount and when window resizes
  useLayoutEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    if (typeof window !== 'undefined') {
      checkIfMobile()
      window.addEventListener("resize", checkIfMobile)
      return () => window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const handleLogout = async () => {
    try {
      toast({
        title: "Berhasil keluar",
        description: "Anda telah keluar dari akun Anda.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Terjadi masalah saat keluar.",
        variant: "destructive",
      })
    }
  }

  const navigation = [
    { name: "Dasbor", href: "/dashboard", icon: LayoutDashboard },
    { name: "Acara", href: "/dashboard/events", icon: Calendar },
    { name: "Anggota", href: "/dashboard/members", icon: Users },
    { name: "Keuangan", href: "/dashboard/finance", icon: DollarSign },
    { name: "Berita", href: "/dashboard/news", icon: FileText },
  ]

  // Don't render anything until we're on the client
  if (!isClient) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 flex h-full w-64 flex-col bg-gray-900 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarCollapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className={`flex items-center gap-3 ${isSidebarCollapsed ? "md:hidden" : ""}`}>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white overflow-hidden">
              <Image
                src="/images/opn-logo.png"
                alt="OPN Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-white">OPN</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ChevronDown
              className={`h-6 w-6 transform transition-transform duration-200 ${
                isSidebarCollapsed ? "rotate-90" : "-rotate-90"
              }`}
            />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  onMouseEnter={() => {
                    // Prefetch the page when hovering over the link
                    router.prefetch(item.href)
                  }}
                >
                  <span
                    className={`flex items-center rounded-lg px-3 py-2 transition-colors hover:bg-gray-800 ${
                      isActive ? "bg-gray-800 text-white" : "text-gray-400"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isSidebarCollapsed ? "" : "mr-3"}`} />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  className="w-64 md:w-96 pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <NotificationsDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/user.png" alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/help")}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Bantuan</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8">
          {children}
        </main>

        {/* Status indicators */}
        <NetworkStatus />
        <MockApiIndicator />
      </div>
    </div>
  )
}
