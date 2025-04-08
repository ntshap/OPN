"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LockKeyhole, User } from "lucide-react"
import { authApi } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Explicitly remove any user data from localStorage for security
      localStorage.removeItem("user")

      // Use the secure auth service
      await authApi.login(username, password)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute -left-4 -top-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
        <div className="absolute -right-4 -bottom-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/2 top-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
              <LockKeyhole className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="text-center text-gray-500 dark:text-gray-400">
              Masukkan kredensial Anda untuk mengakses dasbor
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  placeholder="Masukkan nama pengguna Anda"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  placeholder="Masukkan kata sandi Anda"
                />
                <LockKeyhole className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Masuk...
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
