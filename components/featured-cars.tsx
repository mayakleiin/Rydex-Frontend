"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, Fuel, Users, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function mapCarFromApi(car: any) {
  return {
    id: car._id,
    name: `${car.brand} ${car.model}`,
    year: car.year,
    price: car.pricePerDay,
    rating: 0,
    reviews: car.commentsCount ?? 0,
    image: car.image?.startsWith("http")
      ? car.image
      : car.image
        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${car.image}`
        : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    location: car.location ?? "",
    fuelType: car.fuelType ?? "Gasoline",
    seats: car.seats ?? "—",
    transmission: car.transmission ?? "Automatic",
    owner: {
      name: car.owner?.username ?? "Owner",
      avatar: car.owner?.profileImage?.startsWith("http")
        ? car.owner.profileImage
        : car.owner?.profileImage
          ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${car.owner.profileImage}`
          : "",
    },
    likes: car.likes?.length ?? 0,
    likesIds: car.likes ?? [],
  };
}

interface Car {
  id: string;
  name: string;
  year: number;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  location: string;
  fuelType: string;
  seats: number;
  transmission: string;
  owner: { name: string; avatar: string };
  likes: number;
  likesIds?: string[];
}

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const userId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")?._id
      : null;
  const [liked, setLiked] = useState(
    () => !!(userId && car.likesIds?.includes(userId)),
  );
  const [likesCount, setLikesCount] = useState(car.likes);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${car.id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

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
          <span className="sr-only">
            {liked ? "Remove from favorites" : "Add to favorites"}
          </span>
        </Button>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {car.owner.avatar && (
            <img
              src={car.owner.avatar}
              alt={car.owner.name}
              className="w-8 h-8 rounded-full border-2 border-background"
            />
          )}
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
            <p className="text-sm text-muted-foreground">
              {car.year} •{" "}
              {car.location && car.location.trim() !== ""
                ? car.location
                : "Location not specified"}
            </p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{car.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({car.reviews})
            </span>
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
            <Settings className="w-4 h-4" />
            <span>{car.transmission}</span>
          </div>
          <div
            className={`flex items-center gap-1 ml-auto ${liked ? "text-red-500" : ""}`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-primary">
              ${car.price}
            </span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          <Link href={`/cars/${car.id}`}>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars?limit=6`)
      .then((r) => r.json())
      .then((data) => setCars((data.cars ?? []).map(mapCarFromApi)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4 font-medium">
              Our Fleet
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-foreground italic">
              Featured <span className="text-primary">Vehicles</span>
            </h2>
          </div>
          <Link href="/cars">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export type { Car };
