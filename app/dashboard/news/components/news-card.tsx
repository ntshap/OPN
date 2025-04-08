import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, MessageSquare, ThumbsUp } from "lucide-react"
import Image from "next/image"

interface NewsCardProps {
  id: number
  title: string
  description: string
  date: string
  is_published: boolean
  photos: Array<{ id: number, photo_url: string }>
  created_at: string
  updated_at: string
}

export function NewsCard({
  id,
  title,
  description,
  date,
  is_published,
  photos,
  created_at,
  updated_at
}: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  // Check if there are photos
  const hasPhoto = photos && photos.length > 0 && photos[0].photo_url

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        {hasPhoto ? (
          <Image
            src={photos[0].photo_url}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground text-sm">Tidak ada foto</p>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className={`px-2 py-1 rounded-full text-xs ${is_published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
            {is_published ? "Dipublikasikan" : "Draft"}
          </span>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(date)}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Diperbarui: {formatDate(updated_at)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-4">
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-1" />
            <span>Admin</span>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`/dashboard/news/${id}`} className="no-underline">
            Baca Selengkapnya
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
