import axios, { AxiosError, isCancel } from "axios"

// Create an Axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://backend-project-pemuda.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
})

// Add request interceptor to handle authentication
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging and auth handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`API Response [${response.config.method?.toUpperCase()}] ${response.config.url}:`, {
        status: response.status,
        data: response.data,
      })
    }
    return response
  },
  (error) => {
    // Don't log canceled requests as errors
    if (isCancel(error)) {
      console.log('Request canceled:', error.message)
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.error('Authentication error: Token invalid or expired')

      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')

        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          // Store the current path to redirect back after login
          localStorage.setItem('redirectAfterLogin', window.location.pathname)

          // Show alert to user
          alert('Sesi Anda telah berakhir. Silakan login kembali.')

          // Redirect to login page
          window.location.href = '/login'
          return Promise.reject(error)
        }
      }
    }

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error(`API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    }
    return Promise.reject(error)
  }
)
