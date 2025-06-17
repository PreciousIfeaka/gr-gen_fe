"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const QRPage = () => {
  const [qrUrl, setQrUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchQR = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/qr`)
      setQrUrl(res.data.qrCodeUrl)
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <div className="text-4xl">📱</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">QR Code Scanner</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-2">
              Scan the QR code below to discover 10 amazing random movies
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Auto-refreshes every 10 seconds
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* QR Code Container */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Scan to Explore Movies</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Point your camera at the QR code</p>
            </div>

            {/* QR Code Display */}
            <div className="relative">
              {loading ? (
                <div className="w-64 h-64 mx-auto bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse transform -skew-x-12"></div>
                  <div className="text-gray-400 dark:text-gray-500 text-center">
                    <div className="text-4xl mb-2">⏳</div>
                    <p className="text-sm font-medium">Generating QR Code...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="w-64 h-64 mx-auto bg-red-50 dark:bg-red-900/20 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-red-200 dark:border-red-800">
                  <div className="text-red-400 text-center mb-4">
                    <div className="text-4xl mb-2">❌</div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 px-4">{error}</p>
                  </div>
                  <button
                    onClick={fetchQR}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>🔄</span>
                    Retry
                  </button>
                </div>
              ) : qrUrl ? (
                <div className="relative group">
                  <img
                    src={qrUrl || "/placeholder.svg"}
                    alt="QR Code for Random Movies"
                    className="w-64 h-64 mx-auto rounded-2xl shadow-lg border-4 border-white dark:border-gray-600 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={fetchQR}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                <span className={loading ? "animate-spin" : ""}>🔄</span>
                {loading ? "Refreshing..." : "Refresh QR Code"}
              </button>

              {lastUpdated && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg py-2 px-4">
                  <span className="font-medium">Last updated:</span> {formatTime(lastUpdated)}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <span>📋</span>
              How to use:
            </h3>
            <ol className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </span>
                Open your phone's camera app
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </span>
                Point it at the QR code above
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </span>
                Tap the notification to open the movie gallery
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRPage
