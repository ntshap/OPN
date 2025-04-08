"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, AlertCircle, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { formatImageUrl, formatDate } from "@/lib/image-utils"
import { UploadPhotosDirect } from "./upload-photos-direct"

// Import the API base URL for image fallback
const API_BASE_URL = "https://backend-project-pemuda.onrender.com"

interface GallerySimpleProps {
  eventId: string | number
}

export function GallerySimple({ eventId }: GallerySimpleProps) {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const fetchPhotos = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log(`[GallerySimple] Fetching photos for event ${eventId}`)

      // Direct API call to get event details
      const response = await apiClient.get(`/events/${eventId}`)
      console.log("[GallerySimple] Event response:", response.data)

      if (response.data && Array.isArray(response.data.photos)) {
        console.log("[GallerySimple] Raw photos from API:", response.data.photos);

        // Process photos to ensure they have the correct URL format
        const processedPhotos = response.data.photos
          .filter(photo => photo && (photo.photo_url || photo.url)) // Filter out invalid photos
          .map(photo => {
            // If the photo_url doesn't exist or is malformed, try to fix it
            const photoUrl = photo.photo_url || photo.url;
            console.log("[GallerySimple] Processing photo URL:", photoUrl);

            // Ensure the event ID is included in the URL if needed
            const processedPhoto = {
              ...photo,
              photo_url: photoUrl,
              // Add event_id if not present
              event_id: photo.event_id || eventId
            };

            console.log("[GallerySimple] Processed photo:", processedPhoto);
            return processedPhoto;
          });

        console.log("[GallerySimple] Final processed photos:", processedPhotos);
        // Store the processed photos array
        setPhotos(processedPhotos);
      } else {
        console.log("[GallerySimple] No photos found in response");
        setPhotos([]);
      }
    } catch (err) {
      console.error("[GallerySimple] Error fetching photos:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [eventId])

  const handleUploadPhotos = () => {
    setIsUploadModalOpen(true)
  }

  // We'll use the formatImageUrl utility from image-utils.ts

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={handleUploadPhotos}>
            <Upload className="mr-2 h-4 w-4" />
            Unggah Foto
          </Button>
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          ) : photos.length > 0 ? (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">Total foto: {photos.length}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={photo.id || index} className="relative aspect-square rounded-md overflow-hidden border bg-muted">
                    {/* Image with fallback handling */}
                    <div className="relative w-full h-full">
                      <img
                        src={formatImageUrl(photo.photo_url)}
                        alt={`Foto acara ${index + 1}`}
                        className="w-full h-full object-cover"
                        onLoad={(e) => {
                          console.log(`[GallerySimple] Image loaded successfully: ${photo.photo_url}`);
                          // Remove any error class that might have been added
                          e.currentTarget.classList.remove('opacity-0');
                        }}
                        onError={(e) => {
                          console.log(`[GallerySimple] Using fallback for: ${photo.photo_url}`);
                          // Hide the broken image
                          e.currentTarget.classList.add('opacity-0');
                          // Show fallback image (handled by CSS background)
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.classList.add('bg-gray-200');
                            parent.style.backgroundImage = 'url("/placeholder.svg")';
                            parent.style.backgroundSize = 'cover';
                            parent.style.backgroundPosition = 'center';
                          }
                        }}
                      />
                    </div>

                    {/* Date display */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                      {formatDate(photo.uploaded_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada foto yang diunggah untuk acara ini.</p>
              <Button variant="outline" className="mt-4" onClick={handleUploadPhotos}>
                <Upload className="mr-2 h-4 w-4" />
                Unggah Foto Pertama
              </Button>
            </div>
          )}
        </div>
      </div>

      <UploadPhotosDirect
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        eventId={eventId}
        onSuccess={() => {
          // Refetch photos after successful upload
          fetchPhotos()
        }}
      />
    </>
  )
}
