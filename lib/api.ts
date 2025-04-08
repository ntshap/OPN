import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { mockMeetingMinutesApi } from './mock-api'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-project-pemuda.onrender.com/api/v1"
const MAX_RETRIES = 3 // Meningkatkan jumlah percobaan dari 1 menjadi 3
const RETRY_DELAY = 1000 // ms - Meningkatkan delay antar percobaan dari 500ms menjadi 1000ms

// Flag to enable fallback data when API is unavailable
export const USE_FALLBACK_DATA = process.env.NEXT_PUBLIC_USE_FALLBACK_DATA === 'true' ? true : false

// Log API configuration on startup
console.log('API Configuration:', {
  API_BASE_URL,
  USE_FALLBACK_DATA,
  MAX_RETRIES,
  RETRY_DELAY
})

// Flag to track if we're using the mock API due to network issues
let usingMockApi = false

// Function to check if we're using the mock API
export const isUsingMockApi = () => usingMockApi

// Token management
const getAuthToken = () => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('token')
}

const setAuthToken = (token: string) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('token', token)
}

const removeAuthToken = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('refreshToken')
  window.localStorage.removeItem('user') // Explicitly remove any user data
}

// Create Axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Meningkatkan timeout dari 5 detik menjadi 15 detik
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosError = error as AxiosError<{
        detail?: string;
        message?: string;
        errors?: Record<string, string[]>;
      }>

      // Handle request cancellation
      if (axios.isCancel(error)) {
        console.log('Request canceled:', axiosError.message)
        return Promise.reject(error)
      }

      const originalRequest = axiosError.config as AxiosRequestConfig & { _retry?: boolean }

      // Handle 401 Unauthorized - Token expired
      if (axiosError.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Attempt to refresh token
          const refreshToken = localStorage.getItem("refreshToken")
          if (!refreshToken) {
            removeAuthToken()
            window.location.href = "/login"
            return Promise.reject(error)
          }

          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          })

          const { token } = response.data
          setAuthToken(token)

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return axios(originalRequest)
        } catch (refreshError) {
          removeAuthToken()
          window.location.href = "/login"
          return Promise.reject(error)
        }
      }
    }

    return Promise.reject(error)
  }
)

// Helper function to implement retry logic
async function withRetry<T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
): Promise<AxiosResponse<T>> {
  try {
    return await apiCall()
  } catch (error) {
    // Ensure error is not undefined or null
    const safeError = error || { message: 'Unknown error' };

    // Handle canceled requests specially - don't log them as errors
    if (axios.isCancel(safeError)) {
      console.log('Request canceled:', safeError.message || 'No message provided')
      // We'll still throw the error, but it will be caught and handled by the specific API functions
      throw safeError
    }

    // Log the error for debugging (only for non-canceled requests)
    console.error('Error caught in withRetry:', safeError);

    // Default retry decision - will be used if we can't determine more specific conditions
    let shouldRetry = retries > 0;
    let retryDelay = delay;
    let retryMessage = 'Retrying generic request...';

    // Log detailed error information for Axios errors
    if (safeError && typeof safeError === 'object' && 'isAxiosError' in safeError) {
      const axiosError = safeError as AxiosError;
      const errorDetails = {
        message: axiosError.message || 'No message',
        code: axiosError.code || 'No code',
        url: axiosError.config?.url || 'No URL',
        method: axiosError.config?.method || 'No method',
        status: axiosError.response?.status || 'No status',
      };

      console.error('Axios request failed:', errorDetails);

      // Special handling for network errors
      if (axiosError.message === 'Network Error') {
        console.error('Network Error detected - likely no internet connection or API server is down');

        // For network errors, use a more aggressive retry strategy with shorter initial delay
        shouldRetry = retries > 0;
        retryDelay = 1000; // Start with 1 second for network errors
        retryMessage = `Network error - retrying request to ${axiosError.config?.url || 'unknown URL'}`;

        // Log more details about the request that failed
        console.log('Failed request details:', {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          baseURL: axiosError.config?.baseURL,
          headers: axiosError.config?.headers,
        });
      } else {
        // For other errors, determine if we should retry based on error type
        const axiosShouldRetry = (
          // Retry on timeout errors
          (axiosError.message && axiosError.message.includes('timeout')) ||
          // Retry on 5xx server errors
          (axiosError.response?.status && axiosError.response.status >= 500) ||
          // Retry on 429 Too Many Requests
          axiosError.response?.status === 429
        );

        // Never retry on 422 Unprocessable Entity (validation errors)
        if (axiosError.response?.status === 422) {
          console.log('Not retrying 422 Unprocessable Entity error');
          shouldRetry = false;

          // Log the request data that caused the validation error
          console.error('Request data causing 422 error:', {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            data: axiosError.config?.data,
            response: axiosError.response?.data
          });
        } else if (axiosShouldRetry) {
          shouldRetry = true;
          // Exponential backoff: increase delay with each retry
          retryDelay = delay * (MAX_RETRIES - retries + 1);
          retryMessage = `Retrying request to ${axiosError.config?.url || 'unknown URL'}...`;
        } else {
          // Don't retry for specific error conditions
          shouldRetry = false;
        }
      }
    } else if (safeError instanceof Error) {
      // Handle standard Error objects
      console.error('Standard error in request:', safeError.message || 'No message');
      retryMessage = `Retrying after Error: ${safeError.message || 'Unknown error'}`;
    } else {
      // Handle any other type of error (like empty objects)
      console.error('Non-standard error in request:',
        typeof safeError === 'object' ? JSON.stringify(safeError) : String(safeError));
      retryMessage = 'Retrying after non-standard error';
    }

    // Perform the retry if conditions are met
    if (retries > 0 && shouldRetry) {
      console.log(`${retryMessage} ${retries} attempts left`);
      console.log(`Waiting ${retryDelay}ms before next attempt`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return withRetry(apiCall, retries - 1, delay);
    }

    // If we've exhausted retries or shouldn't retry, throw the error
    console.error('All retry attempts failed or retry not allowed');
    throw safeError;
  }
}

// Fallback data for when API is unavailable
const fallbackEvents: Event[] = [
  {
    id: 1,
    title: "Rapat Anggota Tahunan",
    description: "Rapat tahunan untuk membahas perkembangan organisasi",
    date: "2025-04-15",
    time: "09:00",
    location: "Aula Utama",
    status: "akan datang",
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-01T00:00:00Z",
    photos: [],
    attendees: []
  },
  {
    id: 2,
    title: "Workshop Pengembangan Diri",
    description: "Workshop untuk meningkatkan soft skill anggota",
    date: "2025-04-20",
    time: "13:00",
    location: "Ruang Pelatihan",
    status: "akan datang",
    created_at: "2025-03-05T00:00:00Z",
    updated_at: "2025-03-05T00:00:00Z",
    photos: [],
    attendees: []
  },
  {
    id: 3,
    title: "Bakti Sosial",
    description: "Kegiatan bakti sosial di panti asuhan",
    date: "2025-03-10",
    time: "08:00",
    location: "Panti Asuhan Harapan",
    status: "selesai",
    created_at: "2025-02-15T00:00:00Z",
    updated_at: "2025-03-11T00:00:00Z",
    photos: [
      { id: 1, event_id: 3, photo_url: "https://source.unsplash.com/random/800x600/?charity", uploaded_at: "2025-03-11T00:00:00Z" },
      { id: 2, event_id: 3, photo_url: "https://source.unsplash.com/random/800x600/?volunteer", uploaded_at: "2025-03-11T00:00:00Z" }
    ],
    attendees: []
  },
  {
    id: 4,
    title: "Seminar Kepemimpinan",
    description: "Seminar tentang kepemimpinan efektif",
    date: "2025-03-05",
    time: "10:00",
    location: "Auditorium",
    status: "selesai",
    created_at: "2025-02-20T00:00:00Z",
    updated_at: "2025-03-06T00:00:00Z",
    photos: [
      { id: 3, event_id: 4, photo_url: "https://source.unsplash.com/random/800x600/?seminar", uploaded_at: "2025-03-06T00:00:00Z" }
    ],
    attendees: []
  },
  {
    id: 5,
    title: "Pelatihan Digital Marketing",
    description: "Pelatihan tentang strategi pemasaran digital",
    date: "2025-05-10",
    time: "14:00",
    location: "Ruang Komputer",
    status: "akan datang",
    created_at: "2025-03-15T00:00:00Z",
    updated_at: "2025-03-15T00:00:00Z",
    photos: [],
    attendees: []
  },
  {
    id: 6,
    title: "Diskusi Panel Ekonomi",
    description: "Diskusi tentang perkembangan ekonomi terkini",
    date: "2025-05-20",
    time: "15:30",
    location: "Ruang Seminar",
    status: "akan datang",
    created_at: "2025-03-20T00:00:00Z",
    updated_at: "2025-03-20T00:00:00Z",
    photos: [],
    attendees: []
  },
  {
    id: 7,
    title: "Lomba Karya Tulis",
    description: "Kompetisi karya tulis ilmiah",
    date: "2025-02-25",
    time: "09:00",
    location: "Aula Serbaguna",
    status: "selesai",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-02-26T00:00:00Z",
    photos: [
      { id: 4, event_id: 7, photo_url: "https://source.unsplash.com/random/800x600/?writing", uploaded_at: "2025-02-26T00:00:00Z" },
      { id: 5, event_id: 7, photo_url: "https://source.unsplash.com/random/800x600/?competition", uploaded_at: "2025-02-26T00:00:00Z" }
    ],
    attendees: []
  },
  {
    id: 8,
    title: "Webinar Teknologi",
    description: "Webinar tentang perkembangan teknologi terbaru",
    date: "2025-06-05",
    time: "19:00",
    location: "Online (Zoom)",
    status: "akan datang",
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2025-04-01T00:00:00Z",
    photos: [],
    attendees: []
  },
  {
    id: 9,
    title: "Perayaan Hari Kemerdekaan",
    description: "Acara perayaan hari kemerdekaan Indonesia",
    date: "2025-08-17",
    time: "08:00",
    location: "Lapangan Utama",
    status: "akan datang",
    created_at: "2025-07-01T00:00:00Z",
    updated_at: "2025-07-01T00:00:00Z",
    photos: [],
    attendees: []
  }
];

const fallbackFinanceSummary = {
  total_income: 15000000,
  total_expense: 5000000,
  net_change: 10000000,
  current_balance: 10000000
};

const fallbackFinanceHistory = {
  transactions: [
    {
      id: 1,
      amount: "5000000",
      category: "Pengeluaran",
      date: "2023-04-02T00:00:00Z",
      description: "Biaya kegiatan",
      balance_before: "15000000",
      balance_after: "10000000",
      document_url: null,
      created_by: 1,
      created_at: "2023-04-02T00:00:00Z",
      updated_at: "2023-04-02T00:00:00Z"
    },
    {
      id: 2,
      amount: "20000000",
      category: "Pemasukan",
      date: "2023-04-02T00:00:00Z",
      description: "Iuran anggota",
      balance_before: "0",
      balance_after: "15000000",
      document_url: null,
      created_by: 1,
      created_at: "2023-04-02T00:00:00Z",
      updated_at: "2023-04-02T00:00:00Z"
    }
  ],
  current_balance: "10000000"
};

const fallbackMembers: MemberResponse = {
  "Pengurus Inti": [
    { id: 1, full_name: "Budi Santoso", division: "Pengurus Inti", position: "Ketua" },
    { id: 2, full_name: "Siti Rahayu", division: "Pengurus Inti", position: "Sekretaris" },
    { id: 3, full_name: "Agus Wijaya", division: "Pengurus Inti", position: "Bendahara" }
  ],
  "Divisi Pendidikan": [
    { id: 4, full_name: "Dewi Lestari", division: "Divisi Pendidikan", position: "Koordinator" },
    { id: 5, full_name: "Rudi Hartono", division: "Divisi Pendidikan", position: "Anggota" }
  ],
  "Divisi Sosial": [
    { id: 6, full_name: "Rina Wati", division: "Divisi Sosial", position: "Koordinator" },
    { id: 7, full_name: "Joko Susilo", division: "Divisi Sosial", position: "Anggota" }
  ]
};

// Unused but kept for reference
// const fallbackNews: NewsItem[] = [];

// API service for events
export const eventApi = {
  // Get events with pagination
  getEvents: async (page = 1, limit = 10, signal?: AbortSignal): Promise<Event[]> => {
    // Immediately return fallback data if enabled
    if (USE_FALLBACK_DATA) {
      console.log('Using fallback events data immediately')
      // Sort fallback events by newest date first
      const sortedEvents = [...fallbackEvents].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      // Simulate pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      return sortedEvents.slice(startIndex, endIndex)
    }

    try {
      const skip = (page - 1) * limit
      console.log('Fetching events with params:', { skip, limit })

      const token = getAuthToken()
      console.log('Using auth token:', token ? 'Token exists' : 'No token')

      const response = await withRetry(() =>
        apiClient.get<Event[]>("/events", {
          params: { skip, limit },
          signal,
        })
      )

      console.log('Events API response:', response.data)
      return response.data || []
    } catch (error) {
      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('Events request was cancelled - returning empty array')
        return [] // Return empty array instead of throwing error
      }

      // For other errors, log detailed information
      console.error('Error fetching events:', error)

      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError
        console.error('Axios error details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            headers: axiosError.config?.headers,
          }
        })
      }

      // Only use fallback data if explicitly enabled
      if (USE_FALLBACK_DATA) {
        console.log('Using fallback events data due to API error')

        // Sort fallback events by newest date first
        const sortedEvents = [...fallbackEvents].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        return sortedEvents.slice(startIndex, endIndex)
      }

      // Otherwise, throw the error to be handled by the UI
      throw error
    }
  },

  // Search events
  searchEvents: async (
    params: {
      title?: string
      description?: string
      date?: string
      time?: string
      location?: string
    },
    signal?: AbortSignal,
  ): Promise<Event[]> => {
    // Immediately return filtered fallback data if enabled
    if (USE_FALLBACK_DATA) {
      console.log('Using fallback events data for search immediately')
      // Filter fallback events based on search params
      const filteredEvents = fallbackEvents.filter(event => {
        if (params.title && !event.title.toLowerCase().includes(params.title.toLowerCase())) {
          return false
        }
        if (params.description && !event.description.toLowerCase().includes(params.description.toLowerCase())) {
          return false
        }
        if (params.date && event.date !== params.date) {
          return false
        }
        if (params.location && !event.location.toLowerCase().includes(params.location.toLowerCase())) {
          return false
        }
        return true
      })

      // Sort filtered events by newest date first
      return filteredEvents.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
    }

    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
      )

      const response = await withRetry(() =>
        apiClient.get<Event[]>("/events/search", {
          params: cleanParams,
          signal,
        })
      )

      return response.data || []
    } catch (error) {
      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('Search request was cancelled - returning empty array')
        return [] // Return empty array instead of throwing error
      }

      // For other errors, log and throw
      console.error('Error searching events:', error)
      throw error
    }
  },

  // Get single event
  getEvent: async (id: number | string, signal?: AbortSignal): Promise<Event> => {
    // Immediately return fallback data if enabled
    if (USE_FALLBACK_DATA) {
      console.log('Using fallback event data immediately')
      const fallbackEvent = fallbackEvents.find(event => event.id === Number(id))
      if (fallbackEvent) {
        return fallbackEvent
      }

      // If no matching fallback event, return a default event
      return {
        id: Number(id),
        title: 'Acara tidak ditemukan',
        description: 'Detail acara tidak tersedia',
        date: new Date().toISOString().split('T')[0],
        time: '00:00',
        location: 'Lokasi tidak tersedia',
        status: 'akan datang',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        photos: [],
        attendees: []
      }
    }

    try {
      const response = await withRetry(() =>
        apiClient.get<Event>(`/events/${id}`, { signal })
      )

      // Ensure photos array exists
      if (!response.data.photos) {
        response.data.photos = []
      }

      return response.data
    } catch (error) {
      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('Event request was cancelled - returning default event object')
        // Return a default event object to prevent UI errors
        return {
          id: Number(id),
          title: 'Permintaan dibatalkan',
          description: 'Detail acara tidak dapat dimuat',
          date: new Date().toISOString().split('T')[0],
          time: '00:00',
          location: '',
          status: 'akan datang',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          photos: [],
          attendees: []
        }
      }
      console.error('Error fetching event:', error)
      throw error
    }
  },

  // Create event
  createEvent: async (data: EventFormData): Promise<Event> => {
    // Format the data before sending it to the API
    const formattedData = formatEventData(data, true) // true indicates this is a create operation

    console.log('Creating event with formatted data:', formattedData)

    const response = await withRetry(() =>
      apiClient.post<Event>("/events", formattedData)
    )
    return response.data
  },

  // Update event
  updateEvent: async (id: number | string, data: Partial<EventFormData>): Promise<Event> => {
    // Format the data before sending it to the API
    const formattedData = formatEventData(data, false) // false indicates this is an update operation

    console.log('Updating event with formatted data:', formattedData)

    try {
      const response = await withRetry(() =>
        apiClient.put<Event>(`/events/${id}`, formattedData)
      )
      return response.data
    } catch (error) {
      console.error('Error updating event:', error)

      // Log detailed error information
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError
        console.error('Axios error details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            data: axiosError.config?.data,
          }
        })
      }

      throw error
    }
  },

  // Delete event
  deleteEvent: async (id: number | string): Promise<void> => {
    await withRetry(() => apiClient.delete(`/events/${id}`))
  },

  // Get event attendance
  getEventAttendance: async (eventId: number | string, signal?: AbortSignal): Promise<Attendee[]> => {
    try {
      const response = await withRetry(() => apiClient.get<Attendee[]>(`/events/${eventId}/attendance`, { signal }))
      return response.data || []
    } catch (error) {
      // Check if the request was canceled
      if (axios.isCancel(error)) {
        console.log('Event attendance request was cancelled')
        return [] // Return empty array to prevent UI errors
      }
      console.error('Error fetching event attendance:', error)
      throw error
    }
  },

  // Update attendance
  updateAttendance: async (
    eventId: number | string,
    memberId: number,
    data: { status: string; notes: string },
  ): Promise<Attendee> => {
    const response = await withRetry(() => apiClient.put<Attendee>(`/events/${eventId}/attendance/${memberId}`, data))
    return response.data
  },

  // Create or update multiple attendance records
  createOrUpdateAttendance: async (
    eventId: number | string,
    attendanceData: Array<{ member_id: number; status: string; notes: string }>,
  ): Promise<Attendee[]> => {
    try {
      const response = await withRetry(() => apiClient.post<Attendee[]>(`/events/${eventId}/attendance`, attendanceData))
      return response.data || []
    } catch (error) {
      console.error('Error creating/updating attendance:', error)

      // If we're using fallback data, return a mock response
      if (USE_FALLBACK_DATA) {
        console.log('Using fallback attendance data')
        return attendanceData.map(item => ({
          id: Math.floor(Math.random() * 1000),
          event_id: Number(eventId),
          member_id: item.member_id,
          status: item.status as "Hadir" | "Izin" | "Alfa",
          notes: item.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      }

      throw error
    }
  },



  // Upload event photos
  uploadEventPhotos: async (
    eventId: number | string,
    files: File[],
    onProgress?: (percentage: number) => void,
  ): Promise<EventPhoto[]> => {
    const formData = new FormData()

    // Add each file to form data with the correct field name 'files'
    // The backend expects an array of files with the field name 'files'
    files.forEach((file) => {
      formData.append('files', file)
      console.log(`[uploadEventPhotos] Uploading file: ${file.name} (${file.size} bytes) for event ID: ${eventId}`)
    })

    try {
      console.log(`[uploadEventPhotos] FormData contains ${files.length} files for event ${eventId}`)

      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('[uploadEventPhotos] No token found in localStorage')
        throw new Error('Authentication required')
      }

      // Use the correct API endpoint as per the documentation
      // POST /api/v1/uploads/events/{event_id}/photos with multipart/form-data
      const response = await apiClient.post(`/uploads/events/${eventId}/photos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (onProgress) {
            onProgress(percentCompleted)
          }
        },
      })

      console.log('Upload successful:', response.data)

      // Handle different response formats
      // The API might return a single URL string, an array of URL strings, or an array of objects
      if (typeof response.data === 'string') {
        // Single URL string response
        return [{
          id: Date.now(),
          event_id: Number(eventId),
          photo_url: response.data,
          uploaded_at: new Date().toISOString()
        }]
      } else if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          return []
        }

        if (typeof response.data[0] === 'string') {
          // Array of URL strings
          return response.data.map((url, index) => ({
            id: Date.now() + index,
            event_id: Number(eventId),
            photo_url: url,
            uploaded_at: new Date().toISOString()
          }))
        } else if (typeof response.data[0] === 'object') {
          // Array of objects (already in the right format)
          return response.data
        }
      }

      // Default fallback
      return []
    } catch (error) {
      console.error('Photo upload error:', error)

      // Improved error handling
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError
        console.error('Network error details:', {
          message: axiosError.message,
          code: axiosError.code,
          request: axiosError.request ? 'Request exists' : 'No request',
          response: axiosError.response ? JSON.stringify(axiosError.response.data) : 'No response',
          config: axiosError.config ? `${axiosError.config.method} ${axiosError.config.url}` : 'No config',
        })
      }

      throw error
    }
  },


}

// Finance types
export interface Finance {
  id: number
  amount: string // Backend returns this as string
  category: string
  date: string // ISO date format
  description: string
  balance_before: string
  balance_after: string
  document_url: string | null
  created_by: number
  created_at: string
  updated_at: string
}

// This matches the backend's expected request body for POST/PUT
export interface FinanceFormData {
  amount: number // Backend expects this as number
  category: string
  date: string // ISO date format
  description: string
}

export interface FinanceHistoryResponse {
  transactions: Finance[]
  current_balance: string
}

// Finance API service
export const financeApi = {
  // Get finance history with pagination and filters
  getFinanceHistory: async (
    params?: {
      skip?: number
      limit?: number
      category?: string
      start_date?: string
      end_date?: string
    },
    signal?: AbortSignal
  ): Promise<FinanceHistoryResponse> => {
    // Immediately return fallback data if enabled
    if (USE_FALLBACK_DATA) {
      console.log('Using fallback finance history data immediately')
      return fallbackFinanceHistory
    }

    try {
      console.log('Attempting to fetch finance history data...');
      const response = await withRetry(() =>
        apiClient.get<FinanceHistoryResponse>("/finance/history", {
          params,
          signal,
          // Increase timeout specifically for this request
          timeout: 20000, // 20 seconds
        })
      )

      console.log('Finance history data fetched successfully');
      return response.data
    } catch (error) {
      // Ensure error is not undefined or null
      const safeError = error || { message: 'Unknown error' };

      // Handle canceled requests gracefully
      if (axios.isCancel(safeError)) {
        console.log('Finance history request was cancelled - returning fallback data')
        return fallbackFinanceHistory // Return fallback data instead of throwing error
      }

      console.error('Error fetching finance history:', safeError)

      // Log detailed error information for debugging
      if (safeError && typeof safeError === 'object') {
        if ('isAxiosError' in safeError) {
          const axiosError = safeError as AxiosError
          console.error('Network error details:', {
            message: axiosError.message || 'No message',
            code: axiosError.code || 'No code',
            request: axiosError.request ? 'Request exists' : 'No request',
            response: axiosError.response ? JSON.stringify(axiosError.response.data) : 'No response',
            config: axiosError.config ? `${axiosError.config.method} ${axiosError.config.url}` : 'No config',
          })
        } else {
          // For non-Axios error objects
          console.error('Non-Axios error object:', JSON.stringify(safeError, null, 2));
        }
      } else if (safeError instanceof Error) {
        // For standard Error objects
        console.error('Standard error:', safeError.message, safeError.stack);
      } else {
        // For primitive error values
        console.error('Primitive error value:', String(safeError));
      }

      // Only use fallback data if explicitly enabled
      if (USE_FALLBACK_DATA) {
        console.warn('Returning fallback finance history data due to API error')
        return fallbackFinanceHistory
      }

      // Otherwise, throw the error to be handled by the UI
      throw error
    }
  },

  // Get finance summary
  getFinanceSummary: async (
    params?: {
      start_date?: string
      end_date?: string
    },
    signal?: AbortSignal
  ): Promise<any> => {
    // Immediately return fallback data if enabled
    if (USE_FALLBACK_DATA) {
      console.log('Using fallback finance summary data immediately')
      return fallbackFinanceSummary
    }

    try {
      console.log('Attempting to fetch finance summary data...');
      const response = await withRetry(() =>
        apiClient.get<any>("/finance/summary", {
          params,
          signal,
          // Increase timeout specifically for this request
          timeout: 20000, // 20 seconds
        })
      )

      console.log('Finance summary data fetched successfully');
      return response.data
    } catch (error) {
      // Ensure error is not undefined or null
      const safeError = error || { message: 'Unknown error' };

      // Handle canceled requests gracefully
      if (axios.isCancel(safeError)) {
        console.log('Finance summary request was cancelled - returning fallback data')
        return fallbackFinanceSummary // Return fallback data instead of throwing error
      }

      console.error('Error fetching finance summary:', safeError)

      // Log detailed error information for debugging
      if (safeError && typeof safeError === 'object') {
        if ('isAxiosError' in safeError) {
          const axiosError = safeError as AxiosError
          console.error('Network error details:', {
            message: axiosError.message || 'No message',
            code: axiosError.code || 'No code',
            request: axiosError.request ? 'Request exists' : 'No request',
            response: axiosError.response ? JSON.stringify(axiosError.response.data) : 'No response',
            config: axiosError.config ? `${axiosError.config.method} ${axiosError.config.url}` : 'No config',
          })
        } else {
          // For non-Axios error objects
          console.error('Non-Axios error object:', JSON.stringify(safeError, null, 2));
        }
      } else if (safeError instanceof Error) {
        // For standard Error objects
        console.error('Standard error:', safeError.message, safeError.stack);
      } else {
        // For primitive error values
        console.error('Primitive error value:', String(safeError));
      }

      // Return fallback data instead of throwing error to prevent app from crashing
      console.warn('Returning fallback finance summary data due to API error')
      return fallbackFinanceSummary
    }
  },

  // Get single finance record
  getFinance: async (id: number | string, signal?: AbortSignal): Promise<Finance> => {
    // Immediately return fallback data if enabled
    if (USE_FALLBACK_DATA) {
      console.log('Using fallback finance record data immediately')
      // Try to find the finance record in fallbackFinanceHistory
      const fallbackFinance = fallbackFinanceHistory.transactions.find(t => t.id === Number(id))
      if (fallbackFinance) {
        return fallbackFinance
      }

      // Return a default finance record if not found
      return {
        id: Number(id),
        amount: "0",
        category: "Pemasukan",
        date: new Date().toISOString(),
        description: "Detail transaksi tidak tersedia",
        balance_before: "10000000",
        balance_after: "10000000",
        document_url: null,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    try {
      const response = await withRetry(() =>
        apiClient.get<Finance>(`/finance/${id}`, { signal })
      )
      return response.data
    } catch (error) {
      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('Finance record request was cancelled - returning default finance record')
        // Return a default finance record to prevent UI errors
        return {
          id: Number(id),
          amount: "0",
          category: "",
          date: new Date().toISOString(),
          description: "",
          balance_before: "0",
          balance_after: "0",
          document_url: null,
          created_by: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      console.error('Error fetching finance record:', error)
      throw error
    }
  },

  // Create finance record
  createFinance: async (data: FinanceFormData): Promise<Finance> => {
    try {
      // Ensure data is formatted correctly for the backend
      const formattedData = {
        amount: Number(data.amount), // Ensure it's a number
        category: data.category,
        date: new Date(data.date).toISOString(), // Ensure date is in ISO format
        description: data.description
      }

      const response = await withRetry(() =>
        apiClient.post<Finance>("/finance/", formattedData)
      )
      return response.data
    } catch (error) {
      console.error('Error creating finance record:', error)
      throw error
    }
  },

  // Update finance record
  updateFinance: async (id: number | string, data: Partial<FinanceFormData>): Promise<Finance> => {
    try {
      // Format the data for the backend
      const formattedData: Record<string, any> = {}
      if (data.amount !== undefined) formattedData.amount = Number(data.amount)
      if (data.category !== undefined) formattedData.category = data.category
      if (data.date !== undefined) formattedData.date = new Date(data.date).toISOString()
      if (data.description !== undefined) formattedData.description = data.description

      const response = await withRetry(() =>
        apiClient.put<Finance>(`/finance/${id}`, formattedData)
      )
      return response.data
    } catch (error) {
      console.error('Error updating finance record:', error)
      throw error
    }
  },

  // Delete finance record
  deleteFinance: async (id: number | string): Promise<void> => {
    try {
      await withRetry(() => apiClient.delete(`/finance/${id}`))
    } catch (error) {
      console.error('Error deleting finance record:', error)
      throw error
    }
  },

  // Upload finance document
  uploadFinanceDocument: async (financeId: number | string, file: File): Promise<string> => {
    try {
      // Check if token exists
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Anda belum login. Silakan login terlebih dahulu.')
      }

      const formData = new FormData()
      // Use 'file' as the field name as specified in the API docs
      // POST /api/v1/uploads/finances/{finance_id}/document with multipart/form-data and 'file' parameter
      formData.append('file', file)

      console.log(`Uploading document for finance ID: ${financeId}, file: ${file.name} (${file.size} bytes)`)

      const response = await withRetry(() =>
        apiClient.post<string>(`/uploads/finances/${financeId}/document`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        })
      )

      console.log('Upload finance document response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error uploading finance document:', error)

      // Add more specific error handling
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          console.error('Authentication error: Token invalid or expired')
          // Clear token from localStorage
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        }
      }

      throw error
    }
  },
}

// Auth API service
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; refreshToken: string }> => {
    try {
      // Create form data as expected by the backend
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)
      formData.append("grant_type", "password")

      const response = await apiClient.post<{ access_token: string; refresh_token: string }>(
        '/auth/token',
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      // Store only the token securely, not username or password
      setAuthToken(response.data.access_token)

      // Store refresh token in memory or in a secure HTTP-only cookie (if possible)
      // For this implementation, we'll store it in localStorage but in a real app,
      // consider more secure options like HTTP-only cookies
      localStorage.setItem('refreshToken', response.data.refresh_token)

      // Explicitly remove any user data from localStorage for security
      localStorage.removeItem('user')

      return {
        token: response.data.access_token,
        refreshToken: response.data.refresh_token
      }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error instanceof Error ? error.message : 'Invalid credentials')
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeAuthToken()
      window.location.href = "/login"
    }
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const formData = new URLSearchParams()
      formData.append("refresh_token", refreshToken)
      formData.append("grant_type", "refresh_token")

      const response = await apiClient.post<{ access_token: string }>(
        '/auth/token',
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      setAuthToken(response.data.access_token)
      return response.data.access_token
    } catch (error) {
      removeAuthToken()
      throw error
    }
  }
}

// Type definitions for API responses
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}

// Event types
export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  status: "akan datang" | "selesai" // Backend uses 'akan datang' as default
  attendees?: Attendee[] | number // Can be an array of Attendee objects or a count
  created_by?: number // Make optional for fallback data
  created_at: string
  updated_at: string
  photos: EventPhoto[]
  minutes?: string // For meeting minutes
}

export interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  location: string
  status?: "akan datang" | "selesai" // Backend uses 'akan datang' as default
  minutes?: string // For meeting minutes
}

export interface EventPhoto {
  id: number
  event_id: number
  photo_url: string
  uploaded_at: string
}

export interface Attendee {
  id: number
  member_id: number
  event_id: number
  status: "Hadir" | "Izin" | "Alfa" // Match the enum in the database
  notes: string
  created_at: string
  updated_at: string
  member?: {
    name: string
    email: string
  }
}

// News types
export interface NewsItem {
  id: number
  title: string
  description: string
  date: string
  is_published: boolean
  created_by: number
  created_at: string
  updated_at: string
  photos: NewsPhoto[]
}

export interface NewsPhoto {
  id: number
  news_id: number
  photo_url: string
  uploaded_at: string
}

export interface NewsFormData {
  title: string
  description: string
  date: string
  is_published: boolean
}

// Member types
export interface Member {
  id: number
  full_name: string
  division: string
  position: string
}

export interface MemberDetail {
  id: number
  full_name: string
  email: string
  phone_number: string
  birth_date: string
  division: string
  address: string
  position: string
}

export interface MemberFormData {
  full_name: string
  email: string
  phone_number: string
  birth_date: string
  division: string
  address: string
  position: string
}

export interface MemberResponse {
  [division: string]: Member[]
}

// Meeting Minutes types
export interface MeetingMinutes {
  id: number
  title: string
  description: string
  date: string
  document_url: string
  event_id: number
  created_at: string
  updated_at: string
}

export interface MeetingMinutesFormData {
  title: string
  description: string
  date: string
  document_url?: string
  event_id: number
}

// News API service
export const newsApi = {
  // Get all news with pagination and filters
  getNews: async (
    params?: {
      skip?: number
      limit?: number
      is_published?: boolean
      search?: string
    },
    signal?: AbortSignal
  ): Promise<NewsItem[]> => {
    try {
      const response = await withRetry(() =>
        apiClient.get<NewsItem[]>("/news/", {
          params,
          signal,
        })
      )
      return response.data || []
    } catch (error) {
      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('News request was cancelled - returning empty array')
        // Return a default response to prevent UI errors
        return []
      }
      console.error('Error fetching news:', error)
      throw error
    }
  },

  // Get single news item by ID
  getNewsItem: async (id: number | string, signal?: AbortSignal): Promise<NewsItem> => {
    try {
      const response = await withRetry(() =>
        apiClient.get<NewsItem>(`/news/${id}`, { signal })
      )
      return response.data
    } catch (error) {
      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('News item request was cancelled - returning default news item')
        // Return a default news item to prevent UI errors
        return {
          id: Number(id),
          title: 'Permintaan dibatalkan',
          description: 'Detail berita tidak dapat dimuat',
          date: new Date().toISOString(),
          is_published: false,
          created_by: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          photos: []
        }
      }
      console.error('Error fetching news item:', error)
      throw error
    }
  },

  // Create news item
  createNews: async (data: NewsFormData): Promise<NewsItem> => {
    try {
      const response = await withRetry(() =>
        apiClient.post<NewsItem>("/news/", data)
      )
      return response.data
    } catch (error) {
      console.error('Error creating news:', error)
      throw error
    }
  },

  // Update news item
  updateNews: async (id: number | string, data: Partial<NewsFormData>): Promise<NewsItem> => {
    try {
      const response = await withRetry(() =>
        apiClient.put<NewsItem>(`/news/${id}`, data)
      )
      return response.data
    } catch (error) {
      console.error('Error updating news:', error)
      throw error
    }
  },

  // Delete news item
  deleteNews: async (id: number | string): Promise<void> => {
    try {
      await withRetry(() => apiClient.delete(`/news/${id}`))
    } catch (error) {
      console.error('Error deleting news:', error)
      throw error
    }
  },

  // Upload news photo
  uploadNewsPhoto: async (newsId: number | string, file: File): Promise<string> => {
    try {
      // Check if token exists
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Anda belum login. Silakan login terlebih dahulu.')
      }

      const formData = new FormData()
      // Use 'files' as the field name as specified in the API docs
      // POST /api/v1/uploads/news/{news_id}/photos with multipart/form-data and 'files' array parameter
      formData.append('files', file)

      console.log(`Uploading photo for news ID: ${newsId}, file: ${file.name} (${file.size} bytes)`)

      const response = await withRetry(() =>
        apiClient.post<string | string[]>(`/uploads/news/${newsId}/photos`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        })
      )

      console.log('Upload news photo response:', response.data)

      // Handle different response formats
      if (typeof response.data === 'string') {
        // Single URL string response
        return response.data
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        // Array of URL strings - return the first one
        return response.data[0]
      }

      return ''
    } catch (error) {
      console.error('Error uploading news photo:', error)

      // Add more specific error handling
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          console.error('Authentication error: Token invalid or expired')
          // Clear token from localStorage
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        }
      }

      throw error
    }
  },
}

// Meeting Minutes API service
export const meetingMinutesApi = {
  // Get all meeting minutes
  getMeetingMinutes: async (signal?: AbortSignal): Promise<MeetingMinutes[]> => {
    // Use fallback data immediately if enabled
    if (USE_FALLBACK_DATA) {
      console.log('Using fallback meeting minutes data immediately');
      return mockMeetingMinutesApi.getMeetingMinutes();
    }

    try {
      console.log('Fetching meeting minutes with increased timeout...');
      // Create a default fallback array to return in case of errors
      const fallbackData: MeetingMinutes[] = [
        {
          id: 1,
          title: 'Rapat Anggota Tahunan',
          description: 'Pembahasan program kerja dan evaluasi kegiatan',
          date: new Date().toISOString().split('T')[0],
          document_url: '',
          event_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const response = await withRetry(() =>
        apiClient.get<MeetingMinutes[]>("/meeting-minutes/", {
          signal,
          timeout: 30000 // Increase timeout to 30 seconds for this specific request
        })
      )
      console.log('Successfully fetched meeting minutes:', response.data.length);

      // Reset the flag since we successfully connected to the API
      usingMockApi = false;

      return response.data.length > 0 ? response.data : fallbackData
    } catch (error) {
      // Create a default fallback array to return in case of errors
      const fallbackData: MeetingMinutes[] = [
        {
          id: 1,
          title: 'Rapat Anggota Tahunan',
          description: 'Pembahasan program kerja dan evaluasi kegiatan',
          date: new Date().toISOString().split('T')[0],
          document_url: '',
          event_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('Meeting minutes request was cancelled - returning fallback data')
        return fallbackData // Return fallback data instead of empty array
      }

      // Handle timeout errors specifically
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('Timeout error fetching meeting minutes');
        console.warn('Using fallback data due to timeout');
        return fallbackData;
      }

      // Handle network errors
      if (axios.isAxiosError(error) && error.message === 'Network Error') {
        console.error('Network error fetching meeting minutes');
        console.warn('Using fallback data due to network error');
        return fallbackData;
      }

      // Handle 403 errors (permission denied)
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.error('Permission denied (403) fetching meeting minutes');
        console.warn('Using fallback data due to permission denied');
        return fallbackData;
      }

      console.error('Error fetching meeting minutes:', error)
      console.warn('Using fallback data due to unknown error');

      // Return fallback data instead of empty array to prevent UI from breaking
      return fallbackData
    }
  },

  // Get meeting minutes by ID
  getMeetingMinutesById: async (id: number | string, signal?: AbortSignal): Promise<MeetingMinutes> => {
    // Create a default fallback object to return in case of errors
    const fallbackData: MeetingMinutes = {
      id: Number(id),
      title: 'Rapat Anggota Tahunan',
      description: 'Pembahasan program kerja dan evaluasi kegiatan',
      date: new Date().toISOString().split('T')[0],
      document_url: '',
      event_id: Number(id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Use fallback data immediately if enabled
    if (USE_FALLBACK_DATA) {
      console.log(`Using fallback meeting minutes data immediately for ID ${id}`);
      return fallbackData;
    }

    try {
      console.log(`Fetching meeting minutes with ID ${id} with increased timeout...`);
      const response = await withRetry(() =>
        apiClient.get<MeetingMinutes>(`/meeting-minutes/${id}`, {
          signal,
          timeout: 30000 // Increase timeout to 30 seconds for this specific request
        })
      )
      console.log(`Successfully fetched meeting minutes with ID ${id}`);
      return response.data
    } catch (error) {
      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('Meeting minutes request was cancelled - returning fallback data')
        return fallbackData;
      }

      // Handle timeout errors specifically
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error(`Timeout error fetching meeting minutes with ID ${id}`);
        console.warn('Using fallback data due to timeout');
        return {
          ...fallbackData,
          title: 'Permintaan Timeout',
          description: 'Data notulensi tidak dapat dimuat karena waktu permintaan habis. Silakan coba lagi nanti.'
        };
      }

      // Handle 403 errors (permission denied)
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.error(`Permission denied (403) fetching meeting minutes with ID ${id}`);
        console.warn('Using fallback data due to permission denied');
        return {
          ...fallbackData,
          title: 'Akses Ditolak',
          description: 'Anda tidak memiliki izin untuk mengakses data notulensi ini.'
        };
      }

      console.error(`Error fetching meeting minutes with ID ${id}:`, error)
      console.warn('Using fallback data due to unknown error');

      // Return fallback data with error message
      return {
        ...fallbackData,
        title: 'Error',
        description: 'Terjadi kesalahan saat memuat data notulensi. Silakan coba lagi nanti.'
      };
    }
  },

  // Create meeting minutes
  createMeetingMinutes: async (data: MeetingMinutesFormData): Promise<MeetingMinutes> => {
    // Ensure description is a string
    const formattedData = {
      ...data,
      description: data.description || '',
      document_url: data.document_url || undefined
    };

    try {
      console.log('Sending meeting minutes data to API with increased timeout:', formattedData);

      // For POST requests, we'll keep the JSON object format as it seems to be expected
      const response = await withRetry(() =>
        apiClient.post<MeetingMinutes>("/meeting-minutes/", formattedData, {
          timeout: 30000, // Increase timeout to 30 seconds for this specific request
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
      console.log('Successfully created meeting minutes:', response.data);

      // Reset the flag since we successfully connected to the API
      usingMockApi = false;

      return response.data
    } catch (error) {
      // Handle specific error types
      if (axios.isAxiosError(error)) {
        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
          console.error('Timeout error creating meeting minutes');

          if (USE_FALLBACK_DATA) {
            console.warn('Using mock API as fallback due to timeout');
            usingMockApi = true;
            return mockMeetingMinutesApi.createMeetingMinutes(formattedData);
          }

          throw new Error('Waktu permintaan habis. Silakan coba lagi nanti.');
        }

        // Handle network errors
        if (error.message === 'Network Error') {
          console.error('Network error creating meeting minutes');

          if (USE_FALLBACK_DATA) {
            console.warn('Using mock API as fallback due to network error');
            usingMockApi = true;
            return mockMeetingMinutesApi.createMeetingMinutes(formattedData);
          }

          throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.');
        }

        // Handle server errors
        if (error.response?.status && error.response.status >= 500) {
          console.error(`Server error (${error.response.status}) creating meeting minutes`);

          if (USE_FALLBACK_DATA) {
            console.warn('Using mock API as fallback due to server error');
            usingMockApi = true;
            return mockMeetingMinutesApi.createMeetingMinutes(formattedData);
          }

          throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
        }

        // Handle validation errors
        if (error.response?.status === 422) {
          console.error('Validation error (422) creating meeting minutes:', error.response.data);

          // Try to extract validation error details
          let errorMessage = 'Data tidak valid. Silakan periksa kembali data yang dimasukkan.';

          if (error.response.data?.detail) {
            try {
              // If detail is an array of validation errors
              if (Array.isArray(error.response.data.detail)) {
                const firstError = error.response.data.detail[0];
                if (firstError && firstError.msg) {
                  errorMessage = `Validasi gagal: ${firstError.msg}`;
                }
              } else if (typeof error.response.data.detail === 'string') {
                errorMessage = `Validasi gagal: ${error.response.data.detail}`;
              }
            } catch (e) {
              console.error('Error parsing validation error details:', e);
            }
          }

          throw new Error(errorMessage);
        }
      }

      // For other errors, try using the mock API if fallback is enabled
      console.error('Error creating meeting minutes:', error);

      if (USE_FALLBACK_DATA) {
        console.warn('Using mock API as fallback due to unknown error');
        usingMockApi = true;
        return mockMeetingMinutesApi.createMeetingMinutes(formattedData);
      }

      throw new Error('Terjadi kesalahan saat membuat notulensi. Silakan coba lagi.');
    }
  },

  // Update meeting minutes
  updateMeetingMinutes: async (id: number | string, data: Partial<MeetingMinutesFormData>): Promise<MeetingMinutes> => {
    try {
      // According to the API documentation, the PUT endpoint expects a string as the request body
      // We'll convert our data to a JSON string

      // First, ensure description is a string if present
      const formattedData = {
        ...data,
        description: data.description !== undefined ? (data.description || '') : undefined,
        document_url: data.document_url || undefined
      };

      // Convert the data to a JSON string
      const jsonString = JSON.stringify(formattedData);

      console.log(`Updating meeting minutes ${id} with data and increased timeout:`, jsonString);

      const response = await withRetry(() =>
        apiClient.put<MeetingMinutes>(`/meeting-minutes/${id}`, jsonString, {
          timeout: 30000, // Increase timeout to 30 seconds for this specific request
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
      console.log(`Successfully updated meeting minutes with ID ${id}:`, response.data);
      return response.data
    } catch (error) {
      // Handle specific error types
      if (axios.isAxiosError(error)) {
        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
          console.error(`Timeout error updating meeting minutes with ID ${id}`);
          throw new Error('Waktu permintaan habis. Silakan coba lagi nanti.');
        }

        // Handle network errors
        if (error.message === 'Network Error') {
          console.error(`Network error updating meeting minutes with ID ${id}`);
          throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.');
        }

        // Handle server errors
        if (error.response?.status && error.response.status >= 500) {
          console.error(`Server error (${error.response.status}) updating meeting minutes with ID ${id}`);
          throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
        }

        // Handle validation errors
        if (error.response?.status === 422) {
          console.error(`Validation error (422) updating meeting minutes with ID ${id}:`, error.response.data);
          throw new Error('Data tidak valid. Silakan periksa kembali data yang dimasukkan.');
        }
      }

      // For other errors, log and throw a generic error message
      console.error('Error updating meeting minutes:', error);
      throw new Error('Terjadi kesalahan saat memperbarui notulensi. Silakan coba lagi.');
    }
  },

  // Delete meeting minutes
  deleteMeetingMinutes: async (id: number | string): Promise<void> => {
    try {
      console.log(`Deleting meeting minutes with ID ${id} with increased timeout...`);
      await withRetry(() => apiClient.delete(`/meeting-minutes/${id}`, {
        timeout: 30000 // Increase timeout to 30 seconds for this specific request
      }))
      console.log(`Successfully deleted meeting minutes with ID ${id}`);
    } catch (error) {
      // Handle timeout errors specifically
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error(`Timeout error deleting meeting minutes with ID ${id}`);
        throw new Error('Waktu permintaan habis. Silakan coba lagi nanti.');
      }

      console.error('Error deleting meeting minutes:', error)
      throw error
    }
  },
}

// Member API service
export const memberApi = {
  // Get all members grouped by division
  getMembers: async (signal?: AbortSignal): Promise<MemberResponse> => {
    try {
      const response = await withRetry(() =>
        apiClient.get<MemberResponse>("/members/", { signal })
      )
      return response.data
    } catch (error) {
      // Handle canceled requests gracefully
      if (axios.isCancel(error)) {
        console.log('Members request was cancelled - returning empty object')
        return {} // Return empty object instead of throwing error
      }
      console.error('Error fetching members:', error)

      // Only use fallback data if explicitly enabled
      if (USE_FALLBACK_DATA) {
        console.log('Using fallback members data')
        return fallbackMembers
      }

      // Otherwise, throw the error to be handled by the UI
      throw error
    }
  },

  // Create member biodata
  createMemberBiodata: async (data: MemberFormData): Promise<Member> => {
    try {
      const response = await withRetry(() =>
        apiClient.post<Member>("/members/biodata", data)
      )
      return response.data
    } catch (error) {
      console.error('Error creating member biodata:', error)
      throw error
    }
  },

  // Update member biodata
  updateMemberBiodata: async (data: MemberFormData): Promise<Member> => {
    try {
      const response = await withRetry(() =>
        apiClient.put<Member>("/members/biodata/", data)
      )
      return response.data
    } catch (error) {
      console.error('Error updating member biodata:', error)
      throw error
    }
  },

  // Delete user
  deleteUser: async (userId: number | string): Promise<void> => {
    try {
      await withRetry(() => apiClient.delete(`/members/user/${userId}`))
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },
}

// Helper function to format event data for API - exported for use in components
export function formatEventData(data: Partial<EventFormData>, isCreate = false): Record<string, any> {
  // Only validate required fields for create operations
  if (isCreate) {
    if (!data.title) throw new Error("Title is required")
    if (!data.date) throw new Error("Date is required")
    if (!data.location) throw new Error("Location is required")
  }

  try {
    // Create formatted data object
    const formattedData: Record<string, any> = {}

    // Format title if present
    if (data.title !== undefined) {
      formattedData.title = data.title.trim()
    }

    // Format description if present
    if (data.description !== undefined) {
      formattedData.description = data.description.trim() || ""
    }

    // Format location if present
    if (data.location !== undefined) {
      formattedData.location = data.location.trim()
    }

    // Format status if present
    if (data.status !== undefined) {
      formattedData.status = data.status
    }

    // Format minutes if present
    if (data.minutes !== undefined) {
      formattedData.minutes = data.minutes
    }

    // Format date and time if present
    if (data.date) {
      try {
        // Parse the date string to ensure it's valid
        const dateObj = new Date(data.date)
        if (isNaN(dateObj.getTime())) {
          throw new Error(`Invalid date: ${data.date}`)
        }

        // Format time if present
        let timeString = "00:00:00"
        if (data.time) {
          const [hours, minutes] = data.time.split(':').map(Number)
          timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
        }

        // Format date as ISO string with time for the API (YYYY-MM-DDTHH:MM:SS.sssZ)
        const isoDate = `${data.date}T${timeString}.000Z`
        formattedData.date = isoDate
        formattedData.time = `${timeString}.000Z`
      } catch (dateError) {
        console.error('Error formatting date:', dateError)
        throw new Error(`Invalid date format: ${data.date}`)
      }
    }

    // Log the formatted data for debugging
    console.log('Formatted event data:', formattedData)

    return formattedData
  } catch (error) {
    console.error('Error formatting event data:', {
      input: data,
      error: error instanceof Error ? error.message : error
    })

    // Throw a more specific error message
    if (error instanceof Error) {
      throw error; // Preserve the original error message
    } else {
      throw new Error('Invalid data format')
    }
  }
}

// Error handling utilities
export function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{
      detail?: string | Record<string, any>;
      message?: string;
      errors?: Record<string, string[]>;
    }>

    // Log the full error response for debugging
    console.error('Full API error response:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      headers: axiosError.response?.headers,
    })

    // Special handling for 422 Unprocessable Entity errors
    if (axiosError.response?.status === 422) {
      console.log('Handling 422 validation error')
      return 'Validation error: The data format is incorrect. Please check the form fields.'
    }

    // Try to extract error message from response data
    if (axiosError.response?.data) {
      const data = axiosError.response.data as {
        detail?: string | Record<string, any>;
        message?: string;
        errors?: Record<string, string[]>;
      }

      // Check for nested error details
      if (data.detail) {
        if (typeof data.detail === 'string') {
          return data.detail
        } else if (typeof data.detail === 'object') {
          // Handle object-type detail (common in FastAPI validation errors)
          return JSON.stringify(data.detail)
        }
      }

      // Check for error message
      if (data.message) {
        return data.message
      }

      // Check for validation errors
      if (data.errors) {
        const errorMessages = Object.entries(data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        return errorMessages || 'Validation error'
      }
    }

    // Fallback to status text or generic message
    return axiosError.response?.statusText || 'An error occurred while making the request'
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message
  }

  return 'An unknown error occurred'
}

export default apiClient
