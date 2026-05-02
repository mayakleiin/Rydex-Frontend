"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CarCard } from "@/components/featured-cars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Camera,
  Edit2,
  Check,
  Loader2,
  Trash2,
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
    likesIds: car.likes ?? [],
  }
}

function EditCarDialog({ car, onSaved }: { car: any; onSaved: (updated: any) => void }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    make: car.make ?? "",
    model: car.model ?? "",
    year: String(car.year ?? ""),
    location: car.location ?? "",
    pricePerDay: String(car.pricePerDay ?? ""),
    description: car.description ?? "",
    fuelType: car.fuelType ?? "",
    transmission: car.transmission ?? "",
    seats: String(car.seats ?? ""),
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) body.append(k, v) })
      if (fileRef.current?.files?.[0]) body.append("image", fileRef.current.files[0])
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${car._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      if (res.ok) {
        const updated = await res.json()
        onSaved(updated)
        setOpen(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border">
          <Edit2 className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Car Listing</DialogTitle>
          <DialogDescription>Update your car details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Make</Label>
              <Input value={form.make} onChange={set("make")} required className="bg-input border-border" />
            </div>
            <div className="space-y-1">
              <Label>Model</Label>
              <Input value={form.model} onChange={set("model")} required className="bg-input border-border" />
            </div>
            <div className="space-y-1">
              <Label>Year</Label>
              <Input type="number" value={form.year} onChange={set("year")} className="bg-input border-border" />
            </div>
            <div className="space-y-1">
              <Label>Price / Day ($)</Label>
              <Input type="number" value={form.pricePerDay} onChange={set("pricePerDay")} required className="bg-input border-border" />
            </div>
            <div className="space-y-1">
              <Label>Fuel Type</Label>
              <Input value={form.fuelType} onChange={set("fuelType")} className="bg-input border-border" />
            </div>
            <div className="space-y-1">
              <Label>Transmission</Label>
              <Input value={form.transmission} onChange={set("transmission")} className="bg-input border-border" />
            </div>
            <div className="space-y-1">
              <Label>Seats</Label>
              <Input type="number" value={form.seats} onChange={set("seats")} className="bg-input border-border" />
            </div>
            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={form.location} onChange={set("location")} required className="bg-input border-border" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={set("description")} className="bg-input border-border min-h-[80px]" />
          </div>
          <div className="space-y-1">
            <Label>Replace Image</Label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" id={`car-img-${car._id}`} />
            <Button type="button" variant="outline" size="sm" className="border-border" onClick={() => fileRef.current?.click()}>
              <Camera className="w-3 h-3 mr-1" />
              Choose Image
            </Button>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="border-border" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Check className="w-4 h-4 mr-2" />Save</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditProfileDialog({ user, onSaved }: { user: any; onSaved: (updated: any) => void }) {
  const [username, setUsername] = useState(user?.username ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
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
      body.append("email", email)

      if (fileRef.current?.files?.[0]) {
        body.append("profileImage", fileRef.current.files[0])
      }

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
      } else {
        alert(data.message || "Failed to update profile")
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
          <DialogDescription>Update your photo, display name and email.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={getAvatarUrl(user?.profileImage)} alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
            />

            <Button
              type="button"
              variant="outline"
              className="border-border"
              onClick={() => fileRef.current?.click()}
            >
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

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-border"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

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
  const [user, setUser] = useState<any>(null)
  const [userCars, setUserCars] = useState<ReturnType<typeof mapCarFromApi>[]>([])
  const [rawCars, setRawCars] = useState<any[]>([])
  const [favoriteCars, setFavoriteCars] = useState<ReturnType<typeof mapCarFromApi>[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    if (!stored) { window.location.href = "/login"; return }
    setUser(stored)

    const fetchData = async () => {
      try {
        const [userRes, carsRes, allCarsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${stored._id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${stored._id}/cars?limit=50`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars?limit=200`),
        ])
        const [userData, carsData, allCarsData] = await Promise.all([
          userRes.json(), carsRes.json(), allCarsRes.json(),
        ])
        setUser(userData)
        setRawCars(carsData.cars)
        setUserCars(carsData.cars.map(mapCarFromApi))
        const liked = (allCarsData.cars ?? [])
          .filter((c: any) => c.likes?.includes(stored._id))
          .map(mapCarFromApi)
        setFavoriteCars(liked)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCarUpdated = (updatedRaw: any) => {
    setRawCars((prev) => prev.map((c) => (c._id === updatedRaw._id ? updatedRaw : c)))
    setUserCars((prev) => prev.map((c) => (c.id === updatedRaw._id ? mapCarFromApi(updatedRaw) : c)))
  }

  const handleCarDeleted = async (carId: string) => {
    const token = localStorage.getItem("accessToken")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setRawCars((prev) => prev.filter((c) => c._id !== carId))
      setUserCars((prev) => prev.filter((c) => c.id !== carId))
    }
  }

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
                  {userCars.map((car) => {
                    const raw = rawCars.find((r) => r._id === car.id)
                    return (
                      <div key={car.id} className="flex flex-col">
                        <CarCard car={car} />
                        <div className="flex gap-2 mt-2">
                          {raw && (
                            <EditCarDialog car={raw} onSaved={handleCarUpdated} />
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleCarDeleted(car.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No cars listed yet</h3>
                  <p className="text-muted-foreground mb-4">Share your car and start earning</p>
                  <Link href="/list-your-car">
                    <Button className="bg-primary text-primary-foreground">List Your Car</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites">
              {favoriteCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">Start exploring and save cars you love</p>
                  <Link href="/cars">
                    <Button className="bg-primary text-primary-foreground">Browse Cars</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
