"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => { const run = async () => {
    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")

    if (!accessToken || !refreshToken) {
      window.location.href = "/login"
      return
    }

    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]))
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${payload.userId}`)
      const user = await res.json()
      localStorage.setItem("user", JSON.stringify(user))
    } catch {}

    window.location.href = "/"
  }; run() }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  )
}
