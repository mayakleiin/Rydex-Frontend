"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Heart,
  Star,
  Share2,
  MapPin,
  Fuel,
  Users,
  Gauge,
  Calendar as CalendarIcon,
  Shield,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Send,
  ThumbsUp,
  MoreHorizontal,
  Clock,
  Zap,
  Settings,
  Car,
} from "lucide-react"

// Mock car data - in real app this would come from API
const carData = {
  id: "1",
  name: "Porsche 911 Carrera",
  year: 2024,
  price: 450,
  rating: 4.9,
  reviews: 128,
  images: [
    "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
  ],
  location: "Los Angeles, CA",
  fuelType: "Premium",
  seats: 2,
  horsepower: 379,
  transmission: "Automatic",
  drivetrain: "RWD",
  description: `Experience the thrill of driving one of the world's most iconic sports cars. This 2024 Porsche 911 Carrera combines timeless design with cutting-edge performance technology.

The twin-turbocharged flat-six engine delivers 379 horsepower, providing exhilarating acceleration and a top speed of 182 mph. The 8-speed PDK transmission ensures smooth, lightning-fast gear changes.

Inside, you'll find a perfect blend of luxury and sportiness, with premium leather seats, a state-of-the-art infotainment system, and Porsche's legendary build quality.`,
  features: [
    "Apple CarPlay / Android Auto",
    "Navigation System",
    "Bluetooth",
    "Backup Camera",
    "Heated Seats",
    "Sport Chrono Package",
    "BOSE Sound System",
    "Adaptive Cruise Control",
    "Lane Departure Warning",
    "Parking Sensors",
  ],
  rules: [
    "No smoking",
    "No pets",
    "Minimum age 25",
    "Clean driving record required",
    "Return with same fuel level",
  ],
  owner: {
    id: "owner1",
    name: "Michael S.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    memberSince: "2021",
    responseTime: "Within 1 hour",
    responseRate: "98%",
    totalCars: 5,
    verified: true,
  },
  likes: 245,
  isLiked: false,
}

// Mock comments data
const mockComments = [
  {
    id: "c1",
    user: {
      name: "Jennifer K.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    rating: 5,
    date: "2024-01-15",
    content: "Absolutely incredible experience! The car was in pristine condition and Michael was super accommodating with pickup times. Will definitely rent again!",
    likes: 12,
    isLiked: false,
  },
  {
    id: "c2",
    user: {
      name: "David R.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    },
    rating: 5,
    date: "2024-01-10",
    content: "Dream car experience! Everything was perfect from start to finish. The 911 handled like a dream on the PCH. Michael provided great tips for scenic routes.",
    likes: 8,
    isLiked: true,
  },
  {
    id: "c3",
    user: {
      name: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    },
    rating: 4,
    date: "2024-01-05",
    content: "Great car, great owner. Minor delay at pickup but Michael was very apologetic and gave me extra time. Would recommend to any car enthusiast.",
    likes: 5,
    isLiked: false,
  },
]

function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-2xl">
        <img
          src={images[currentIndex]}
          alt={`Car image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={goToPrevious}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={goToNext}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
              index === currentIndex ? "border-primary" : "border-transparent"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function CommentSection() {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(5)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: `c${comments.length + 1}`,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      },
      rating: newRating,
      date: new Date().toISOString().split("T")[0],
      content: newComment,
      likes: 0,
      isLiked: false,
    }

    setComments([comment, ...comments])
    setNewComment("")
    setNewRating(5)
  }

  const toggleLike = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <form onSubmit={handleSubmitComment}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newRating
                          ? "text-primary fill-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your experience with this car..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4 bg-input border-border min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{comment.user.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: comment.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{comment.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={comment.isLiked ? "text-primary" : "text-muted-foreground"}
                      onClick={() => toggleLike(comment.id)}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-1 ${comment.isLiked ? "fill-primary" : ""}`} />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function CarDetailPage() {
  const params = useParams()
  const [isLiked, setIsLiked] = useState(carData.isLiked)
  const [likesCount, setLikesCount] = useState(carData.likes)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  const toggleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: carData.name,
        text: `Check out this ${carData.name} on Rydex!`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/cars" className="hover:text-primary">
              Cars
            </Link>
            <span>/</span>
            <span className="text-foreground">{carData.name}</span>
          </nav>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImageGallery images={carData.images} />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-medium italic text-foreground mb-2">
                      {carData.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <span>{carData.year}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {carData.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        {carData.rating} ({carData.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`border-border ${isLiked ? "text-red-500 border-red-500" : ""}`}
                      onClick={toggleLike}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon" className="border-border" onClick={handleShare}>
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <Fuel className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel</p>
                      <p className="font-medium text-foreground">{carData.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <p className="font-medium text-foreground">{carData.seats}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <Gauge className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Power</p>
                      <p className="font-medium text-foreground">{carData.horsepower}hp</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <Settings className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-medium text-foreground">{carData.transmission}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start bg-card border border-border">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({carData.reviews})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {carData.description}
                    </p>
                  </div>

                  {/* Rules */}
                  <div className="mt-8">
                    <h3 className="font-serif text-lg font-medium italic text-foreground mb-4">Rental Rules</h3>
                    <ul className="space-y-2">
                      {carData.rules.map((rule, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {carData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-card rounded-lg border border-border"
                      >
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <CommentSection />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Pricing Card */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-primary">${carData.price}</span>
                      <span className="text-muted-foreground">/ day</span>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-3 mb-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-border text-left h-auto py-3"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">Pickup Date</span>
                                <span className="text-foreground">
                                  {dateRange.from
                                    ? dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : "Select date"}
                                </span>
                              </div>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-fit">
                          <DialogHeader>
                            <DialogTitle>Select Rental Dates</DialogTitle>
                            <DialogDescription>Choose your pickup and return dates.</DialogDescription>
                          </DialogHeader>
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                            numberOfMonths={2}
                            className="rounded-md border"
                            disabled={(date) => date < new Date()}
                          />
                          {dateRange.from && dateRange.to && (
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div className="text-sm text-muted-foreground">
                                {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days selected
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => setDateRange({ from: undefined, to: undefined })}
                                variant="ghost"
                              >
                                Clear
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Return Date Display */}
                      <div className="flex items-center gap-3 w-full px-4 py-3 border border-border rounded-md bg-secondary/30">
                        <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-muted-foreground">Return Date</span>
                          <span className="text-foreground">
                            {dateRange.to
                              ? dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : "Select above"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    {dateRange.from && dateRange.to ? (
                      <div className="space-y-3 mb-6 pb-6 border-b border-border">
                        {(() => {
                          const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
                          const subtotal = carData.price * days;
                          const serviceFee = Math.round(subtotal * 0.1);
                          const insurance = 50;
                          const total = subtotal + serviceFee + insurance;
                          return (
                            <>
                              <div className="flex justify-between text-muted-foreground">
                                <span>${carData.price} x {days} {days === 1 ? 'day' : 'days'}</span>
                                <span>${subtotal}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Service fee (10%)</span>
                                <span>${serviceFee}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Insurance</span>
                                <span>${insurance}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-foreground pt-3 border-t border-border">
                                <span>Total</span>
                                <span>${total}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-6 mb-6 border-b border-border">
                        <p className="text-muted-foreground text-sm">Select dates to see pricing</p>
                      </div>
                    )}

                    {/* Book Button */}
                    <Button 
                      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
                      disabled={!dateRange.from || !dateRange.to}
                    >
                      {dateRange.from && dateRange.to ? 'Book Now' : 'Select Dates to Book'}
                    </Button>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        Insured
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Instant Book
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Card */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={carData.owner.avatar} alt={carData.owner.name} />
                        <AvatarFallback>{carData.owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{carData.owner.name}</h3>
                          {carData.owner.verified && (
                            <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Member since {carData.owner.memberSince}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Response Time</p>
                        <p className="font-medium text-foreground">{carData.owner.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Response Rate</p>
                        <p className="font-medium text-foreground">{carData.owner.responseRate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Cars</p>
                        <p className="font-medium text-foreground">{carData.owner.totalCars}</p>
                      </div>
                    </div>

                    <Link href={`/profile/${carData.owner.id}`}>
                      <Button variant="outline" className="w-full border-border">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Owner
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Likes Count */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  <span>{likesCount} people liked this car</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
