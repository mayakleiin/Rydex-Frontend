"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CarCard, featuredCars } from "@/components/featured-cars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Search, SlidersHorizontal, X, MapPin, Grid3X3, List } from "lucide-react"

// Extended car data for the listings
const allCars = [
  ...featuredCars,
  {
    id: "7",
    name: "Lamborghini Huracan",
    year: 2023,
    price: 850,
    rating: 4.9,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    location: "Las Vegas, NV",
    fuelType: "Premium",
    seats: 2,
    horsepower: 631,
    owner: {
      name: "Tony V.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&q=80"
    },
    category: "exotic",
    likes: 534
  },
  {
    id: "8",
    name: "Rolls-Royce Ghost",
    year: 2024,
    price: 980,
    rating: 5.0,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
    location: "Beverly Hills, CA",
    fuelType: "Premium",
    seats: 5,
    horsepower: 563,
    owner: {
      name: "Victoria P.",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80"
    },
    category: "luxury",
    likes: 412
  },
  {
    id: "9",
    name: "Ferrari 488 Spider",
    year: 2022,
    price: 750,
    rating: 4.8,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    location: "Miami, FL",
    fuelType: "Premium",
    seats: 2,
    horsepower: 661,
    owner: {
      name: "Carlos M.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80"
    },
    category: "sports",
    likes: 389
  },
  {
    id: "10",
    name: "Cadillac Escalade",
    year: 2024,
    price: 220,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    location: "Houston, TX",
    fuelType: "Premium",
    seats: 7,
    horsepower: 420,
    owner: {
      name: "Robert J.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
    },
    category: "suv",
    likes: 178
  },
  {
    id: "11",
    name: "Rivian R1T",
    year: 2024,
    price: 180,
    rating: 4.6,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1617886322168-72b886573c35?w=800&q=80",
    location: "Denver, CO",
    fuelType: "Electric",
    seats: 5,
    horsepower: 835,
    owner: {
      name: "Nathan K.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    },
    category: "electric",
    likes: 267
  },
  {
    id: "12",
    name: "Bentley Continental GT",
    year: 2023,
    price: 680,
    rating: 4.9,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    location: "San Diego, CA",
    fuelType: "Premium",
    seats: 4,
    horsepower: 542,
    owner: {
      name: "William H.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
    },
    category: "luxury",
    likes: 356
  }
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "luxury", label: "Luxury" },
  { value: "sports", label: "Sports Cars" },
  { value: "suv", label: "SUVs" },
  { value: "electric", label: "Electric" },
  { value: "exotic", label: "Exotic" },
]

const fuelTypes = ["Premium", "Electric", "Diesel", "Hybrid"]
const seatingOptions = [2, 4, 5, 7]

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
]

function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedFuelTypes,
  setSelectedFuelTypes,
  selectedSeats,
  setSelectedSeats,
  onReset,
}: {
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  selectedFuelTypes: string[]
  setSelectedFuelTypes: (value: string[]) => void
  selectedSeats: number[]
  setSelectedSeats: (value: number[]) => void
  onReset: () => void
}) {
  const toggleFuelType = (fuel: string) => {
    if (selectedFuelTypes.includes(fuel)) {
      setSelectedFuelTypes(selectedFuelTypes.filter((f) => f !== fuel))
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, fuel])
    }
  }

  const toggleSeats = (seats: number) => {
    if (selectedSeats.includes(seats)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seats))
    } else {
      setSelectedSeats([...selectedSeats, seats])
    }
  }

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
        <Label className="text-foreground font-medium mb-4 block">Fuel Type</Label>
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
        <Label className="text-foreground font-medium mb-4 block">Seating</Label>
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
  )
}

export default function CarsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recommended")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([])
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const resetFilters = () => {
    setPriceRange([0, 1000])
    setSelectedFuelTypes([])
    setSelectedSeats([])
    setCategory("all")
    setSearchQuery("")
    setLocation("")
  }

  const filteredCars = useMemo(() => {
    let filtered = allCars

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Location
    if (location) {
      filtered = filtered.filter((car) =>
        car.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Category
    if (category !== "all") {
      filtered = filtered.filter((car) => {
        const carCategory = (car as typeof allCars[0] & { category?: string }).category
        return carCategory === category
      })
    }

    // Price range
    filtered = filtered.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
    )

    // Fuel types
    if (selectedFuelTypes.length > 0) {
      filtered = filtered.filter((car) => selectedFuelTypes.includes(car.fuelType))
    }

    // Seating
    if (selectedSeats.length > 0) {
      filtered = filtered.filter((car) =>
        selectedSeats.some((seats) => car.seats >= seats)
      )
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered = [...filtered].sort((a, b) => b.year - a.year)
        break
    }

    return filtered
  }, [searchQuery, location, category, sortBy, priceRange, selectedFuelTypes, selectedSeats])

  const activeFiltersCount =
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    selectedFuelTypes.length +
    selectedSeats.length +
    (category !== "all" ? 1 : 0)

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
                <h2 className="font-serif font-medium italic text-foreground mb-6">Filters</h2>
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
                    {filteredCars.length} <span className="text-primary">Cars</span> Available
                  </h1>
                  {location && (
                    <p className="text-muted-foreground">in {location}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden border-border">
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
                        setSelectedFuelTypes(selectedFuelTypes.filter((f) => f !== fuel))
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
                        setSelectedSeats(selectedSeats.filter((s) => s !== seats))
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
              {filteredCars.length > 0 ? (
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
