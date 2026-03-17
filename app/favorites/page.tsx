"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Star,
  MapPin,
  Fuel,
  Users,
  Calendar,
  Trash2,
  Car,
  ArrowRight,
  Loader2,
} from "lucide-react"


type FavoriteCar = {
  id: string
  name: string
  image: string
  price: number
  location: string
  rating: number
  reviews: number
  year: number
  transmission: string
  fuel: string
  seats: number
  category: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteCar[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null")
        if (!user) return

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars?limit=100`)
        const data = await res.json()

        const liked = data.cars
          .filter((car: any) => car.likes?.includes(user._id))
          .map((car: any) => ({
            id: car._id,
            name: `${car.make} ${car.model}`,
            image: car.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
            price: car.pricePerDay,
            location: car.location,
            rating: 0,
            reviews: car.commentsCount ?? 0,
            year: car.year,
            transmission: car.transmission ?? "Automatic",
            fuel: car.fuelType ?? "Gasoline",
            seats: car.seats ?? 4,
            category: car.fuelType ?? "Car",
          }))

        setFavorites(liked)
      } catch {
        // keep empty on error
      } finally {
        setIsLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  const removeFavorite = async (id: string) => {
    const token = localStorage.getItem("accessToken")
    if (!token) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    setFavorites(favorites.filter((car) => car.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium italic text-foreground">
                Your <span className="text-primary">Favorites</span>
              </h1>
            </div>
            <p className="text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? "car" : "cars"} saved to your wishlist
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : favorites.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl font-medium italic text-foreground mb-3">
                No favorites <span className="text-primary">yet</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start exploring our collection and save your favorite cars to easily find them later.
              </p>
              <Link href="/cars">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Car className="w-5 h-5 mr-2" />
                  Browse Cars
                </Button>
              </Link>
            </div>
          ) : (
            /* Favorites Grid */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((car) => (
                <Card
                  key={car.id}
                  className="group bg-card border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                      {car.category}
                    </Badge>

                    {/* Remove Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => removeFavorite(car.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Price */}
                    <div className="absolute bottom-4 left-4">
                      <div className="text-white">
                        <span className="text-2xl font-bold">${car.price}</span>
                        <span className="text-white/80 text-sm">/day</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="text-sm font-medium text-foreground">{car.rating}</span>
                      <span className="text-xs text-muted-foreground">({car.reviews})</span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {car.name}
                    </h3>

                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{car.location}</span>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{car.year}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Fuel className="w-3.5 h-3.5" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span>{car.seats} seats</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/cars/${car.id}`} className="flex-1">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
