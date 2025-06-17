"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Film, AlertCircle, RefreshCw, Star, Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import Image from "next/image"

interface Movie {
  title: string
  image_url: string
  rating?: number
  year?: number
  duration?: string
  genre?: string
}

export default function MoviePage() {
  const { id } = useParams()
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMovies = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/${id}`)
      if (!response.ok) throw new Error("Failed to fetch movies")
      const data = await response.json()
      setMovies(data.movies || [])
    } catch (err) {
      setError("Failed to load movies. Please try again.")
      console.error("Error fetching movies:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [id])

  const MovieSkeleton = () => (
    <Card className="overflow-hidden border-0 shadow-lg">
      <Skeleton className="h-[400px] w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Film className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-3">No Movies Found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        We couldn't find any movies in this collection. The collection might be empty or unavailable.
      </p>
      <Button onClick={() => router.push("/")} variant="outline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Generate New QR Code
      </Button>
    </div>
  )

  const ErrorState = () => (
    <div className="col-span-full">
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchMovies} className="ml-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => router.push("/")}
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to QR Generator
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
              onClick={() => navigator.share?.({ title: "Movie Collection", url: window.location.href })}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Film className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Movie Gallery</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
              Discover amazing movies from our curated collection
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
              Collection #{id}
            </Badge>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12">
        {error ? (
          <div className="grid grid-cols-1">
            <ErrorState />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => <MovieSkeleton key={index} />)
            ) : movies.length === 0 ? (
              <EmptyState />
            ) : (
              movies.map((movie, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90"
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">#{index + 1}</Badge>
                    </div>
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{movie.rating || "8.5"}</span>
                    </div>
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <Image
                        src={movie.image_url || "/placeholder.svg?height=600&width=400"}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {movie.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {movie.year && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{movie.year}</span>
                        </div>
                      )}
                      {movie.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{movie.duration}</span>
                        </div>
                      )}
                    </div>

                    {movie.genre && (
                      <Badge variant="outline" className="text-xs">
                        {movie.genre}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Stats Section */}
        {!loading && !error && movies.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="inline-block border-0 shadow-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Film className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-lg">
                    Showing {movies.length} movie{movies.length !== 1 ? "s" : ""} in this collection
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
