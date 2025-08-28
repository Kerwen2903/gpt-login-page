"use client"

import { useState, useEffect } from "react"

interface User {
  id: number
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const userData = localStorage.getItem("user")

      if (!token || !userData) {
        setIsLoading(false)
        return
      }

      // Verify token with protected endpoint
      const response = await fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
      } else {
        // Token invalid, clear storage
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
      }
    } catch (error) {
      console.error("[v0] Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    window.location.href = "/"
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    checkAuth,
  }
}
