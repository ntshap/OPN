"use client"

import { useState } from "react"
import { type Event } from "@/lib/api"

// Mock data for events
const mockEvents: Event[] = [
  {
    id: 1,
    title: "test123",
    description: "Test event description",
    date: "2025-04-02",
    time: "10:00",
    location: "Test location",
    status: "akan datang",
    attendees: 15,
    created_by: 1,
    created_at: "2024-03-01T10:30:00Z",
    updated_at: "2024-03-01T10:30:00Z",
    photos: []
  },
  {
    id: 2,
    title: "testas",
    description: "Another test event",
    date: "2025-04-02",
    time: "14:00",
    location: "Another location",
    status: "akan datang",
    attendees: 25,
    created_by: 1,
    created_at: "2024-03-05T14:15:00Z",
    updated_at: "2024-03-05T14:15:00Z",
    photos: []
  },
  {
    id: 3,
    title: "testas",
    description: "Third test event",
    date: "2025-04-02",
    time: "16:00",
    location: "Third location",
    status: "akan datang",
    attendees: 35,
    created_by: 1,
    created_at: "2024-02-15T09:00:00Z",
    updated_at: "2024-03-10T17:00:00Z",
    photos: []
  },
  {
    id: 4,
    title: "tambah event",
    description: "Fourth test event",
    date: "2025-03-28",
    time: "09:00",
    location: "Fourth location",
    status: "akan datang",
    attendees: 45,
    created_by: 1,
    created_at: "2024-03-15T11:30:00Z",
    updated_at: "2024-03-15T11:30:00Z",
    photos: []
  },
  {
    id: 5,
    title: "string",
    description: "Fifth test event",
    date: "2025-03-23",
    time: "11:00",
    location: "Fifth location",
    status: "akan datang",
    attendees: 55,
    created_by: 1,
    created_at: "2024-03-20T13:45:00Z",
    updated_at: "2024-03-20T13:45:00Z",
    photos: []
  },
  {
    id: 6,
    title: "string",
    description: "Sixth test event",
    date: "2025-03-23",
    time: "13:00",
    location: "Sixth location",
    status: "akan datang",
    attendees: 65,
    created_by: 1,
    created_at: "2024-03-22T15:30:00Z",
    updated_at: "2024-03-22T15:30:00Z",
    photos: []
  },
  {
    id: 7,
    title: "string",
    description: "Seventh test event",
    date: "2025-03-23",
    time: "15:00",
    location: "Seventh location",
    status: "akan datang",
    attendees: 75,
    created_by: 1,
    created_at: "2024-03-25T10:00:00Z",
    updated_at: "2024-03-25T10:00:00Z",
    photos: []
  }
];

// Mock hook for fetching a single event
export function useEvent(id: number | string) {
  const event = mockEvents.find(e => e.id.toString() === id.toString());

  return {
    data: event,
    isLoading: false,
    isError: !event,
    error: !event ? new Error("Event not found") : null
  };
}

// Mock hook for event mutations
export function useEventMutations() {
  return {
    createEvent: {
      mutate: (data: any, options?: any) => {
        console.log('Creating event:', data);
        if (options?.onSuccess) {
          options.onSuccess({ id: Math.floor(Math.random() * 1000), ...data });
        }
      },
      isPending: false,
      error: null
    },
    updateEvent: {
      mutate: ({ id, data }: { id: number | string; data: any }, options?: any) => {
        console.log('Updating event:', id, data);
        if (options?.onSuccess) {
          options.onSuccess({ id, ...data });
        }
      },
      isPending: false,
      error: null
    },
    deleteEvent: {
      mutate: (id: number | string, options?: any) => {
        console.log('Deleting event:', id);
        if (options?.onSuccess) {
          options.onSuccess();
        }
      }
    },
    uploadPhotos: {
      mutate: ({ eventId, files, onProgress }: { eventId: number | string; files: File[]; onProgress?: (percentage: number) => void }, options?: any) => {
        console.log('Uploading photos for event:', eventId, files);

        // Simulate upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          if (onProgress) {
            onProgress(progress);
          }

          if (progress >= 100) {
            clearInterval(progressInterval);

            // Simulate successful upload after progress reaches 100%
            setTimeout(() => {
              if (options?.onSuccess) {
                // Create mock photo responses with the event ID prefix
                const mockPhotos = files.map((file, index) => ({
                  id: Math.floor(Math.random() * 1000),
                  event_id: Number(eventId),
                  photo_url: `https://example.com/uploads/events/${eventId}/${eventId}_${index}.jpg`,
                  uploaded_at: new Date().toISOString()
                }));

                options.onSuccess(mockPhotos);
              }
            }, 500);
          }
        }, 300);
      },
      isPending: false,
      error: null
    }
  };
}
