"use client"

import { useState, useEffect, useRef } from "react"
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
  Calendar,
  Car,
  Heart,
  Settings,
  Camera,
  Edit2,
  Check,
  Loader2,
} from "lucide-react"

function getAvatarUrl(profileImage: string | undefined) {
  if (!profileImage) return ""
  if (profileImage.startsWith("http")) return profileImage
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${profileImage}`
}

function mapCarFromApi(car: any) {
  return {
    id: car._id,
    name: `${car.make} ${car.model}`,
    year: car.year,
    price: car.pricePerDay,
    rating: 0,
    reviews: car.commentsCount ?? 0,
    image: car.image?.startsWith("http") ? car.image : car.image ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${car.image}` : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    location: car.location,
    fuelType: car.fuelType ?? "Gasoline",
    seats: car.seats ?? 4,
    horsepower: 0,
    owner: {
      name: car.owner?.username ?? "Owner",
      avatar: getAvatarUrl(car.owner?.profileImage),
    },
    likes: car.likes?.length ?? 0,
  }
}

function EditProfileDialog({ user, onSaved }: { user: any; onSaved: (updated: any) => void }) {
  const [username, setUsername] = useState(user?.username ?? "")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      const body = new FormData()
      body.append("username", username)
      if (fileRef.current?.files?.[0]) body.append("profileImage", fileRef.current.files[0])

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data))
        onSaved(data)
        setOpen(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={getAvatarUrl(user?.profileImage)} alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" id="avatar-upload" />
            <Button type="button" variant="outline" className="border-border" onClick={() => fileRef.current?.click()}>
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Display Name</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" className="border-border" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
              ) : (
                <><Check className="w-4 h-4 mr-2" />Save Changes</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [userCars, setUserCars] = useState<ReturnType<typeof mapCarFromApi>[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    if (!stored) return
    setUser(stored)

    const fetchData = async () => {
      try {
        const [userRes, carsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${stored._id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${stored._id}/cars?limit=50`),
        ])
        const [userData, carsData] = await Promise.all([userRes.json(), carsRes.json()])
        setUser(userData)
        setUserCars(carsData.cars.map(mapCarFromApi))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated user={{ name: user?.username, avatar: getAvatarUrl(user?.profileImage) }} />
      <main className="pt-16">
        {/* Profile Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage src={getAvatarUrl(user?.profileImage)} alt={user?.username} />
                  <AvatarFallback className="text-4xl">
                    {user?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h1 className="font-serif text-3xl font-medium italic text-foreground">
                    <span className="text-primary">{user?.username}</span>
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <EditProfileDialog user={user} onSaved={setUser} />
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
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{userCars.length}</div>
                <div className="text-sm text-muted-foreground">Cars Listed</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userCars.reduce((sum, c) => sum + c.likes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
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
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars">
              {userCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  You haven&apos;t listed any cars yet.
                </div>
              )}
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
