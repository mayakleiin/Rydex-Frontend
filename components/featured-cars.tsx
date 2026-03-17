"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Star, Fuel, Users, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for featured cars
const featuredCars = [
  {
    id: "1",
    name: "Porsche 911 Carrera",
    year: 2024,
    price: 450,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80",
    location: "Los Angeles, CA",
    fuelType: "Premium",
    seats: 2,
    horsepower: 379,
    owner: {
      name: "Michael S.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    },
    likes: 245
  },
  {
    id: "2",
    name: "Mercedes-Benz S-Class",
    year: 2024,
    price: 380,
    rating: 4.8,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    location: "Miami, FL",
    fuelType: "Premium",
    seats: 5,
    horsepower: 429,
    owner: {
      name: "Sarah L.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
    },
    likes: 189
  },
  {
    id: "3",
    name: "BMW M4 Competition",
    year: 2023,
    price: 320,
    rating: 4.9,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80",
    location: "New York, NY",
    fuelType: "Premium",
    seats: 4,
    horsepower: 503,
    owner: {
      name: "James R.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
    },
    likes: 312
  },
  {
    id: "4",
    name: "Tesla Model S Plaid",
    year: 2024,
    price: 350,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=800&q=80",
    location: "San Francisco, CA",
    fuelType: "Electric",
    seats: 5,
    horsepower: 1020,
    owner: {
      name: "Emily W.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
    },
    likes: 427
  },
  {
    id: "5",
    name: "Range Rover Sport",
    year: 2024,
    price: 280,
    rating: 4.8,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    location: "Chicago, IL",
    fuelType: "Diesel",
    seats: 5,
    horsepower: 395,
    owner: {
      name: "David K.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
    },
    likes: 156
  },
  {
    id: "6",
    name: "Audi RS e-tron GT",
    year: 2024,
    price: 420,
    rating: 4.9,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80",
    location: "Seattle, WA",
    fuelType: "Electric",
    seats: 4,
    horsepower: 637,
    owner: {
      name: "Lisa M.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"
    },
    likes: 283
  }
]

interface CarCardProps {
  car: typeof featuredCars[0]
  onLike?: (carId: string) => void
  isLiked?: boolean
}

export function CarCard({ car, onLike, isLiked = false }: CarCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(car.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
    onLike?.(car.id)
  }

  return (
    <Card className="group bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleLike}
          className={`absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background ${
            liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          <span className="sr-only">{liked ? "Remove from favorites" : "Add to favorites"}</span>
        </Button>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <img
            src={car.owner.avatar}
            alt={car.owner.name}
            className="w-8 h-8 rounded-full border-2 border-background"
          />
          <span className="text-sm text-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
            {car.owner.name}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {car.name}
            </h3>
            <p className="text-sm text-muted-foreground">{car.year} • {car.location}</p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{car.rating}</span>
            <span className="text-xs text-muted-foreground">({car.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{car.horsepower}hp</span>
          </div>
          <div className={`flex items-center gap-1 ml-auto ${liked ? "text-red-500" : ""}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-primary">${car.price}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          <Link href={`/cars/${car.id}`}>
            <Button variant="outline" size="sm">Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export function FeaturedCars() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4 font-medium">Our Fleet</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-foreground italic">
              Featured <span className="text-primary">Vehicles</span>
            </h2>
          </div>
          <Link href="/cars">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { featuredCars, CarCard }
