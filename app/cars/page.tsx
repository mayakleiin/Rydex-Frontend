"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CarCard } from "@/components/featured-cars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Grid3X3,
  List,
  Loader2,
} from "lucide-react";

function mapCarFromApi(car: any) {
  return {
    id: car._id,
    name: `${car.make} ${car.model}`,
    year: car.year,
    price: car.pricePerDay,
    rating: 0,
    reviews: car.commentsCount ?? 0,
    image:
      car.image ||
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    location: car.location,
    category: car.category,
    fuelType: car.fuelType ?? "Gasoline",
    seats: car.seats ?? 4,
    horsepower: 0,
    owner: {
      name: car.owner?.username ?? "Owner",
      avatar:
        car.owner?.profileImage ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    likes: car.likes?.length ?? 0,
    likesIds: car.likes ?? [],
  };
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "luxury", label: "Luxury" },
  { value: "sports", label: "Sports Cars" },
  { value: "suv", label: "SUVs" },
  { value: "electric", label: "Electric" },
  { value: "exotic", label: "Exotic" },
];

const fuelTypes = ["Premium", "Electric", "Diesel", "Hybrid"];
const seatingOptions = [2, 4, 5, 7];

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedFuelTypes,
  setSelectedFuelTypes,
  selectedSeats,
  setSelectedSeats,
  onReset,
}: {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedFuelTypes: string[];
  setSelectedFuelTypes: (value: string[]) => void;
  selectedSeats: number[];
  setSelectedSeats: (value: number[]) => void;
  onReset: () => void;
}) {
  const toggleFuelType = (fuel: string) => {
    if (selectedFuelTypes.includes(fuel)) {
      setSelectedFuelTypes(selectedFuelTypes.filter((f) => f !== fuel));
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, fuel]);
    }
  };

  const toggleSeats = (seats: number) => {
    if (selectedSeats.includes(seats)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seats));
    } else {
      setSelectedSeats([...selectedSeats, seats]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-foreground font-medium mb-4 block">
          Price Range (per day)
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={1000}
          step={10}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <Label className="text-foreground font-medium mb-4 block">
          Fuel Type
        </Label>
        <div className="space-y-3">
          {fuelTypes.map((fuel) => (
            <div key={fuel} className="flex items-center gap-2">
              <Checkbox
                id={`fuel-${fuel}`}
                checked={selectedFuelTypes.includes(fuel)}
                onCheckedChange={() => toggleFuelType(fuel)}
              />
              <label
                htmlFor={`fuel-${fuel}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {fuel}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Seating */}
      <div>
        <Label className="text-foreground font-medium mb-4 block">
          Seating
        </Label>
        <div className="flex flex-wrap gap-2">
          {seatingOptions.map((seats) => (
            <Button
              key={seats}
              variant={selectedSeats.includes(seats) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSeats(seats)}
              className={
                selectedSeats.includes(seats)
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }
            >
              {seats}+ seats
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full border-border text-muted-foreground"
        onClick={onReset}
      >
        Reset Filters
      </Button>
    </div>
  );
}

export default function CarsPage() {
  const [allCars, setAllCars] = useState<ReturnType<typeof mapCarFromApi>[]>(
    [],
  );
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const LIMIT = 12;

  const loadCars = useCallback(async (pageNum: number, replace: boolean) => {
    if (pageNum === 1) setIsLoadingCars(true);
    else setIsLoadingMore(true);
    try {
      const params = new URLSearchParams();
      params.append("page", pageNum.toString());
      params.append("limit", LIMIT.toString());
      if (category !== "all") params.append("category", category);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cars?${params}`,
      );
      const data = await res.json();
      const mapped = data.cars.map(mapCarFromApi);
      setAllCars((prev) => (replace ? mapped : [...prev, ...mapped]));
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch {
      // keep existing on error
    } finally {
      setIsLoadingCars(false);
      setIsLoadingMore(false);
    }
  }, [category]);

  useEffect(() => {
    loadCars(1, true);
  }, [loadCars]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isLoadingCars
        ) {
          loadCars(page + 1, false);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoadingCars, page, loadCars]);

  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedFuelTypes([]);
    setSelectedSeats([]);
    setCategory("all");
    setSearchQuery("");
    setLocation("");
  };

  const filteredCars = useMemo(() => {
    let filtered = allCars;

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Location
    if (location) {
      filtered = filtered.filter((car) =>
        car.location.toLowerCase().includes(location.toLowerCase()),
      );
    }

    // Category
    if (category !== "all") {
      filtered = filtered.filter((car) => {
        const carCategory = (car as (typeof allCars)[0] & { category?: string })
          .category;
        return carCategory === category;
      });
    }

    // Price range
    filtered = filtered.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1],
    );

    // Fuel types
    if (selectedFuelTypes.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFuelTypes.includes(car.fuelType),
      );
    }

    // Seating
    if (selectedSeats.length > 0) {
      filtered = filtered.filter((car) =>
        selectedSeats.some((seats) => car.seats >= seats),
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered = [...filtered].sort((a, b) => b.year - a.year);
        break;
    }

    return filtered;
  }, [
    allCars,
    searchQuery,
    location,
    category,
    sortBy,
    priceRange,
    selectedFuelTypes,
    selectedSeats,
  ]);

  const activeFiltersCount =
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    selectedFuelTypes.length +
    selectedSeats.length +
    (category !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Search Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Location Input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 bg-input border-border"
                />
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by brand, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-input border-border"
                />
              </div>

              {/* Category Select */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 w-full lg:w-48 bg-input border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
                <h2 className="font-serif font-medium italic text-foreground mb-6">
                  Filters
                </h2>
                <FilterSidebar
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedFuelTypes={selectedFuelTypes}
                  setSelectedFuelTypes={setSelectedFuelTypes}
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  onReset={resetFilters}
                />
              </div>
            </aside>

            {/* Cars Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-serif text-2xl font-medium italic text-foreground">
                    {filteredCars.length}{" "}
                    <span className="text-primary">Cars</span> Available
                    {hasMore && (
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        (loading more...)
                      </span>
                    )}
                  </h1>
                  {location && (
                    <p className="text-muted-foreground">in {location}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="lg:hidden border-border"
                      >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar
                          priceRange={priceRange}
                          setPriceRange={setPriceRange}
                          selectedFuelTypes={selectedFuelTypes}
                          setSelectedFuelTypes={setSelectedFuelTypes}
                          selectedSeats={selectedSeats}
                          setSelectedSeats={setSelectedSeats}
                          onReset={resetFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort Select */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 bg-input border-border">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={viewMode === "grid" ? "bg-secondary" : ""}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={viewMode === "list" ? "bg-secondary" : ""}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {category !== "all" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      onClick={() => setCategory("all")}
                    >
                      {categories.find((c) => c.value === category)?.label}
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      onClick={() => setPriceRange([0, 1000])}
                    >
                      ${priceRange[0]} - ${priceRange[1]}
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                  {selectedFuelTypes.map((fuel) => (
                    <Button
                      key={fuel}
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        setSelectedFuelTypes(
                          selectedFuelTypes.filter((f) => f !== fuel),
                        )
                      }
                    >
                      {fuel}
                      <X className="w-3 h-3" />
                    </Button>
                  ))}
                  {selectedSeats.map((seats) => (
                    <Button
                      key={seats}
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        setSelectedSeats(
                          selectedSeats.filter((s) => s !== seats),
                        )
                      }
                    >
                      {seats}+ seats
                      <X className="w-3 h-3" />
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={resetFilters}
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Cars Grid */}
              {isLoadingCars ? (
                <div className="flex justify-center items-center py-24">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredCars.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No cars found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button onClick={resetFilters} variant="outline">
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="h-4" />
              {isLoadingMore && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
              {!hasMore && allCars.length > 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  All cars loaded
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
