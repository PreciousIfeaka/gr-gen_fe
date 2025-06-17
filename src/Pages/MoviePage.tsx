"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Film, AlertCircle, RefreshCw, Star, Calendar, Clock } from "lucide-react"

interface Movie {
  title: string
  image_url: string
  rating?: number
  year?: number
  duration?: string
  genre?: string
}

const MoviePage = () => {
  const { id } = useParams()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMovies = async () => {
    setLoading(true)
    setError(null)

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/movies/${id}`
      console.log(url)
      const response = await axios.get(url)
      setMovies(response.data.movies || [])
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
    <Card className="overflow-hidden">
      <Skeleton className="h-[400px] w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  )

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <Film className="h-24 w-24 text-muted-foreground mb-4" />
      <h3 className="text-2xl font-semibold text-muted-foreground mb-2">No Movies Found</h3>
      <p className="text-muted-foreground text-center max-w-md">
        We couldn't find any movies in this collection. Check back later for updates.
      </p>
    </div>
  )

  const ErrorState = () => (
    <div className="col-span-full">
      <Alert variant="destructive">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Film className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Movie Gallery</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover amazing movies and explore our curated collection
            </p>
            <Badge variant="secondary" className="mt-4">
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
              Array.from({ length: 8 }).map((_, index) => <MovieSkeleton key={index} />)
            ) : movies.length === 0 ? (
              <EmptyState />
            ) : (
              movies.map((movie, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80"
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="secondary" className="bg-black/70 text-white border-0">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{movie.rating || "8.5"}</span>
                    </div>
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img
                        src={movie.image_url || "/placeholder.svg?height=600&width=400"}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        crossOrigin="anonymous"
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
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-6 py-3 border">
              <Film className="h-5 w-5 text-blue-600" />
              <span className="font-medium">
                Showing {movies.length} movie{movies.length !== 1 ? "s" : ""} in this collection
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MoviePage
