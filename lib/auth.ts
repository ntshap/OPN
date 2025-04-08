interface User {
  username: string
  role: string
  [key: string]: any
}

export async function login(username: string, password: string) {
  const formData = new URLSearchParams()
  formData.append("username", username)
  formData.append("password", password)
  formData.append("grant_type", "password")

  const response = await fetch("https://backend-project-pemuda.onrender.com/api/v1/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Invalid credentials")
  }

  const data = await response.json()
  return data
}

export async function register(username: string, password: string, role = "Member") {
  const response = await fetch("https://backend-project-pemuda.onrender.com/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      role,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Registration failed")
  }

  return response.json()
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch("https://backend-project-pemuda.onrender.com/api/v1/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function getStoredUser(): User | null {
  // We no longer store the user in localStorage for security reasons
  // Instead, we should fetch the user data from the server using the token
  return null
}

export function clearAuth() {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
  // No need to remove user as we don't store it anymore
}

