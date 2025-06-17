"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, RefreshCw, Smartphone, Camera, ExternalLink, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function QRPage() {
  const [qrUrl, setQrUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchQR = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr`)
      if (!response.ok) throw new Error("Failed to fetch QR code")
      const data = await response.json()
      setQrUrl(data.qrCodeUrl)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching QR code:", err)
      setError("Failed to load QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQR()
    const interval = setInterval(fetchQR, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-8 backdrop-blur-sm">
              <QrCode className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">Movie Discovery</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Scan the QR code below to unlock a curated collection of 10 amazing random movies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                Auto-refreshes every 10 seconds
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Optimized
              </Badge>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* QR Code Card */}
          <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Your Movie QR Code
                </h2>
                <p className="text-muted-foreground text-lg">Point your camera at the code below</p>
              </div>

              {/* QR Code Display */}
              <div className="relative mb-8">
                {loading ? (
                  <div className="w-80 h-80 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse transform -skew-x-12" />
                    <div className="text-center">
                      <RefreshCw className="h-12 w-12 text-muted-foreground animate-spin mb-4 mx-auto" />
                      <p className="text-lg font-medium text-muted-foreground">Generating QR Code...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="w-80 h-80 mx-auto">
                    <Alert variant="destructive" className="h-full flex flex-col items-center justify-center">
                      <AlertCircle className="h-12 w-12 mb-4" />
                      <AlertDescription className="text-center mb-4 text-lg">{error}</AlertDescription>
                      <Button onClick={fetchQR} variant="outline" size="lg">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </Alert>
                  </div>
                ) : qrUrl ? (
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                    <div className="relative">
                      <Image
                        src={qrUrl || "/placeholder.svg"}
                        alt="QR Code for Random Movies"
                        width={320}
                        height={320}
                        className="mx-auto rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700 transition-transform duration-300 group-hover:scale-105"
                        priority
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={fetchQR}
                  disabled={loading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Refreshing..." : "Generate New QR Code"}
                </Button>

                {lastUpdated && (
                  <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg py-3 px-4">
                    <span className="font-medium">Last updated:</span> {formatTime(lastUpdated)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="mt-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardContent className="p-8">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-blue-900 dark:text-blue-100">
                <Camera className="h-6 w-6" />
                How to Scan
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3 mx-auto">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Open Camera</h4>
                  <p className="text-sm text-muted-foreground">Launch your phone's camera app</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3 mx-auto">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Point & Scan</h4>
                  <p className="text-sm text-muted-foreground">Aim at the QR code above</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3 mx-auto">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Discover Movies</h4>
                  <p className="text-sm text-muted-foreground">Tap to open the movie gallery</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold">Auto-Refresh</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  QR codes automatically refresh every 10 seconds for fresh movie collections
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold">Instant Access</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan once to instantly access a curated collection of 10 random movies
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
