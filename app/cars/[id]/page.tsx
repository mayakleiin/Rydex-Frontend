"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Zap,
  Settings,
  Loader2,
  Trash2,
} from "lucide-react";

function getImageUrl(image: string | undefined) {
  if (!image)
    return "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80";
  if (image.startsWith("http")) return image;
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image}`;
}

function getAvatarUrl(profileImage: string | undefined) {
  if (!profileImage) return "";
  if (profileImage.startsWith("http")) return profileImage;
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${profileImage}`;
}

function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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
  );
}

function CommentSection({ carId }: { carId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUserId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")?._id
      : null;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${carId}`)
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [carId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${carId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment.trim() }),
        },
      );
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.ok) setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Share your experience with this car..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4 bg-input border-border min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Post Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment._id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage
                    src={getAvatarUrl(comment.author?.profileImage)}
                    alt={comment.author?.username}
                  />
                  <AvatarFallback>
                    {comment.author?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {comment.author?.username}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                    {currentUserId && comment.author?._id === currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(comment._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
}

export default function CarDetailPage() {
  const params = useParams();
  const carId = params.id as string;
  const [car, setCar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}`)
      .then((r) => r.json())
      .then((data) => {
        setCar(data);
        const userId = JSON.parse(localStorage.getItem("user") || "null")?._id;
        setIsLiked(userId ? data.likes?.includes(userId) : false);
        setLikesCount(data.likes?.length ?? 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [carId]);

  const toggleLike = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/like`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.ok) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car?.make} ${car?.model}`,
        text: `Check out this ${car?.make} ${car?.model} on Rydex!`,
        url: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Car not found.</p>
      </div>
    );
  }

  const normalizedFeatures: string[] = Array.isArray(car.features)
    ? car.features.flatMap((feature: string) => {
        try {
          const parsed = JSON.parse(feature);

          return Array.isArray(parsed) ? parsed : feature;
        } catch {
          return feature;
        }
      })
    : [];

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
            <span className="text-foreground">
              {car.brand} {car.model}
            </span>
          </nav>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImageGallery images={[getImageUrl(car.image)]} />
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
                      {car.make} {car.model}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <span>{car.year}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {car.location}
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
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border"
                      onClick={handleShare}
                    >
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
                      <p className="font-medium text-foreground">
                        {car.fuelType ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <p className="font-medium text-foreground">
                        {car.seats ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <Gauge className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-medium text-foreground">{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <Settings className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transmission
                      </p>
                      <p className="font-medium text-foreground">
                        {car.transmission ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start bg-card border border-border">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {car.description || "No description provided."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  {normalizedFeatures.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {normalizedFeatures.map((feature: string) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border"
                        >
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No additional features listed.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <CommentSection carId={carId} />
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
                      <span className="text-3xl font-bold text-primary">
                        ${car.pricePerDay}
                      </span>
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
                                <span className="text-xs text-muted-foreground">
                                  Pickup Date
                                </span>
                                <span className="text-foreground">
                                  {dateRange.from
                                    ? dateRange.from.toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        },
                                      )
                                    : "Select date"}
                                </span>
                              </div>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-fit">
                          <DialogHeader>
                            <DialogTitle>Select Rental Dates</DialogTitle>
                            <DialogDescription>
                              Choose your pickup and return dates.
                            </DialogDescription>
                          </DialogHeader>
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) =>
                              setDateRange({
                                from: range?.from,
                                to: range?.to,
                              })
                            }
                            numberOfMonths={2}
                            className="rounded-md border"
                            disabled={(date) => date < new Date()}
                          />
                          {dateRange.from && dateRange.to && (
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div className="text-sm text-muted-foreground">
                                {Math.ceil(
                                  (dateRange.to.getTime() -
                                    dateRange.from.getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}{" "}
                                days selected
                              </div>
                              <Button
                                size="sm"
                                onClick={() =>
                                  setDateRange({
                                    from: undefined,
                                    to: undefined,
                                  })
                                }
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
                          <span className="text-xs text-muted-foreground">
                            Return Date
                          </span>
                          <span className="text-foreground">
                            {dateRange.to
                              ? dateRange.to.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Select above"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    {dateRange.from && dateRange.to ? (
                      <div className="space-y-3 mb-6 pb-6 border-b border-border">
                        {(() => {
                          const days = Math.ceil(
                            (dateRange.to.getTime() -
                              dateRange.from.getTime()) /
                              (1000 * 60 * 60 * 24),
                          );
                          const subtotal = car.pricePerDay * days;
                          const serviceFee = Math.round(subtotal * 0.1);
                          const insurance = 50;
                          const total = subtotal + serviceFee + insurance;
                          return (
                            <>
                              <div className="flex justify-between text-muted-foreground">
                                <span>
                                  ${car.pricePerDay} x {days}{" "}
                                  {days === 1 ? "day" : "days"}
                                </span>
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
                        <p className="text-muted-foreground text-sm">
                          Select dates to see pricing
                        </p>
                      </div>
                    )}

                    {/* Book Button */}
                    <Button
                      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
                      disabled={!dateRange.from || !dateRange.to}
                    >
                      {dateRange.from && dateRange.to
                        ? "Book Now"
                        : "Select Dates to Book"}
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
                        <AvatarImage
                          src={getAvatarUrl(car.owner?.profileImage)}
                          alt={car.owner?.username}
                        />
                        <AvatarFallback>
                          {car.owner?.username?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {car.owner?.username}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Member since{" "}
                          {car.owner?.createdAt
                            ? new Date(car.owner.createdAt).getFullYear()
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <Link href={`/profile`}>
                      <Button
                        variant="outline"
                        className="w-full border-border"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View Owner Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Likes Count */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span>{likesCount} people liked this car</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
