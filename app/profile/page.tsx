"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CarCard } from "@/components/featured-cars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Star,
  MapPin,
  Calendar,
  Car,
  Heart,
  Settings,
  Camera,
  Edit2,
  Check,
  Loader2,
} from "lucide-react"

// Mock user data
const userData = {
  id: "user1",
  firstName: "Michael",
  lastName: "Smith",
  email: "michael.smith@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  bio: "Car enthusiast and weekend adventurer. I love sharing my collection with fellow enthusiasts who appreciate quality vehicles.",
  location: "Los Angeles, CA",
  memberSince: "January 2021",
  verified: true,
  responseRate: "98%",
  responseTime: "Within 1 hour",
  stats: {
    totalPosts: 156,
    carsOwned: 5,
    totalReviews: 234,
    averageRating: 4.9,
  },
}

// Mock user's cars
const userCars = [
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
    likes: 312,
    owner: {
      name: "Michael S.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
  },
  {
    id: "2",
    name: "Mercedes-Benz S-Class",
    year: 2024,
    price: 380,
    rating: 4.8,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    location: "Los Angeles, CA",
    fuelType: "Premium",
    seats: 5,
    horsepower: 429,
    likes: 241,
    owner: {
      name: "Michael S.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
  },
  {
    id: "3",
    name: "BMW M4 Competition",
    year: 2023,
    price: 320,
    rating: 4.9,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80",
    location: "Los Angeles, CA",
    fuelType: "Premium",
    seats: 4,
    horsepower: 503,
    likes: 198,
    owner: {
      name: "Michael S.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
  },
]

// Mock recent reviews
const recentReviews = [
  {
    id: "r1",
    carName: "Porsche 911 Carrera",
    reviewer: {
      name: "Jennifer K.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    rating: 5,
    date: "2024-01-15",
    content: "Absolutely incredible experience! The car was in pristine condition.",
  },
  {
    id: "r2",
    carName: "Mercedes-Benz S-Class",
    reviewer: {
      name: "David R.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    },
    rating: 5,
    date: "2024-01-10",
    content: "Perfect for my business trip. Michael was very professional.",
  },
]

function EditProfileDialog() {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your photo and display name.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userData.avatar} alt={userData.firstName} />
              <AvatarFallback>{userData.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" className="border-border">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-input border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-input border-border"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="border-border">
                Cancel
              </Button>
            </DialogTrigger>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated user={{ name: userData.firstName, avatar: userData.avatar }} />
      <main className="pt-16">
        {/* Profile Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage src={userData.avatar} alt={userData.firstName} />
                  <AvatarFallback className="text-4xl">
                    {userData.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {userData.verified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h1 className="font-serif text-3xl font-medium italic text-foreground">
                    {userData.firstName} <span className="text-primary">{userData.lastName}</span>
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {userData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since {userData.memberSince}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    {userData.stats.averageRating} ({userData.stats.totalReviews} reviews)
                  </span>
                </div>
                <p className="text-muted-foreground max-w-2xl">{userData.bio}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <EditProfileDialog />
                <Button variant="outline" className="border-border">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userData.stats.totalPosts}
                </div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userData.stats.carsOwned}
                </div>
                <div className="text-sm text-muted-foreground">Cars Listed</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userData.stats.totalReviews}
                </div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userData.stats.averageRating}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Rating</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="cars" className="w-full">
            <TabsList className="bg-card border border-border mb-8">
              <TabsTrigger value="cars" className="gap-2">
                <Car className="w-4 h-4" />
                My Cars ({userCars.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="w-4 h-4" />
                Reviews ({userData.stats.totalReviews})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <Card key={review.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                          <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {review.reviewer.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Reviewed {review.carName}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-primary fill-primary"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.content}</p>
                          <p className="text-sm text-muted-foreground mt-2">{review.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No favorites yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring and save cars you love
                </p>
                <Button className="bg-primary text-primary-foreground">
                  Browse Cars
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
