"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, RefreshCw, Loader2 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface LoginResponse {
  message: string
  user: {
    id: number
    name: string
  }
  access_token: string
  refresh_token: string
}

export function LoginForm() {
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [captchaId, setCaptchaId] = useState("")
  const [captchaImageUrl, setCaptchaImageUrl] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCaptcha()
  }, [])

  const loadCaptcha = async () => {
    try {
      const response = await fetch("/api/captcha", {
        method: "GET",
        headers: {
          Accept: "image/png",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const captchaIdFromHeader = response.headers.get("x-captcha-id")
      console.log("[v0] Captcha ID from proxy:", captchaIdFromHeader)

      if (!captchaIdFromHeader) {
        throw new Error(t("captchaNotFound"))
      }

      setCaptchaId(captchaIdFromHeader)

      const imageBlob = await response.blob()
      const imageUrl = URL.createObjectURL(imageBlob)
      setCaptchaImageUrl(imageUrl)

      console.log("[v0] Captcha loaded successfully with ID:", captchaIdFromHeader)
    } catch (error) {
      console.error("[v0] Failed to load captcha:", error)
      setError(`${t("captchaLoadFailed")}: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const refreshCaptcha = async () => {
    setCaptchaInput("")
    setError("")

    if (captchaImageUrl) {
      URL.revokeObjectURL(captchaImageUrl)
    }

    await loadCaptcha()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Submitting login with:", {
        username,
        captchaId,
        captchaInput,
      })

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            id: 0,
            name: username,
            password: password,
          },
          captcha_solution: captchaInput,
          captcha_id: captchaId,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || "Login failed")
      }

      console.log("[v0] Login successful:", responseData)

      localStorage.setItem("access_token", responseData.access_token)
      localStorage.setItem("refresh_token", responseData.refresh_token)
      localStorage.setItem("user", JSON.stringify(responseData.user))

      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("[v0] Login failed:", error)

      if (error.message.includes("Invalid") || error.message.includes("captcha")) {
        setError(t("invalidCredentials"))
      } else {
        setError(`${t("loginFailed")}: ${error.message}`)
      }

      await refreshCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (captchaImageUrl) {
        URL.revokeObjectURL(captchaImageUrl)
      }
    }
  }, [captchaImageUrl])

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-accent-foreground">G</span>
        </div>
        <CardTitle className="text-2xl font-bold text-balance">{t("loginTitle")}</CardTitle>
        <CardDescription className="text-muted-foreground">{t("loginDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              {t("username")}
            </Label>
            <Input
              id="username"
              type="text"
              placeholder={t("usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("password")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="captcha" className="text-sm font-medium">
              {t("captchaVerification")}
            </Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-muted p-2 rounded-md border flex items-center justify-center min-h-[60px]">
                {captchaImageUrl ? (
                  <img
                    src={captchaImageUrl || "/placeholder.svg"}
                    alt="Captcha"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">{t("loadingCaptcha")}</div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={refreshCaptcha}
                className="px-3 bg-transparent"
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Input
              id="captcha"
              type="text"
              placeholder={t("captchaPlaceholder")}
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loggingIn")}
              </>
            ) : (
              t("login")
            )}
          </Button>

          <div className="text-center">
            <Button variant="link" className="text-accent hover:text-accent/80 p-0">
              {t("forgotPassword")}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Button variant="link" className="text-accent hover:text-accent/80 p-0 h-auto font-normal">
            {t("signUpHere")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
