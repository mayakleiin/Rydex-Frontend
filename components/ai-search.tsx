"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Send,
  Loader2,
  Car,
  MapPin,
  DollarSign,
  X,
  Mic,
  MicOff,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getUploadUrl } from "@/lib/uploads";

interface SearchResult {
  id: string
  name: string
  image: string
  price: number
  location: string
  match: number
  reason: string
}

const searchCarsWithAI = async (query: string): Promise<{ message: string; results: SearchResult[] }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  })

  if (!res.ok) throw new Error("Search failed")

  const data = await res.json()

  const results: SearchResult[] = (data.cars ?? []).map((car: {
    _id: string
    title: string
    image?: string
    images?: string[]
    pricePerDay: number
    location?: string
    description?: string
  }, index: number) => ({
    id: car._id,
    name: car.title,
image: car.images?.[0] || car.image
  ? getUploadUrl(car.images?.[0] || car.image)
  : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    price: car.pricePerDay,
    location: car.location || "Location not specified",
    match: Math.max(95 - index * 5, 70),
    reason: car.description ?? "",
  }))

  return {
    message: results.length > 0
      ? `Found ${results.length} car${results.length !== 1 ? "s" : ""} matching your request:`
      : "No cars found matching your request. Try different keywords.",
    results,
  }
}

interface AISearchProps {
  isOpen: boolean
  onClose: () => void
}

export function AISearch({ isOpen, onClose }: AISearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [response, setResponse] = useState<{ message: string; results: SearchResult[] } | null>(null)
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return

    setIsSearching(true)
    setResponse(null)

    try {
      const result = await searchCarsWithAI(query)
      setResponse(result)
    } catch {
      setResponse({
        message: "Sorry, I encountered an error. Please try again.",
        results: [],
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // Voice recognition would be implemented here with Web Speech API
  }

  const suggestedQueries = [
    "I need a spacious car for a family road trip",
    "Show me electric vehicles under $300/day",
    "Fast sports car for a weekend getaway",
    "Luxury SUV for a business trip in NYC",
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-serif font-medium italic text-foreground">AI Car <span className="text-primary">Finder</span></h2>
              <p className="text-xs text-muted-foreground">Describe your perfect ride</p>
            </div>
          </div>
          <Button size="icon-sm" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me what you're looking for... e.g., 'I need a spacious SUV for a family trip to the mountains'"
              className="w-full min-h-[100px] p-4 pr-24 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                className={isListening ? "text-primary" : "text-muted-foreground"}
                onClick={toggleVoice}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              <Button
                size="icon-sm"
                onClick={handleSearch}
                disabled={!query.trim() || isSearching}
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Suggested Queries */}
          {!response && !isSearching && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(suggestion)}
                    className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Searching for your perfect car...</p>
          </div>
        )}

        {/* Results */}
        {response && (
          <div className="border-t border-border">
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-foreground">{response.message}</p>
              </div>

              {response.results.length > 0 && (
                <div className="space-y-3">
                  {response.results.map((car) => (
                    <Link href={`/cars/${car.id}`} key={car.id} onClick={onClose}>
                      <Card className="bg-muted/50 border-border hover:border-primary/50 transition-colors cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex gap-4">
                            {car.image && (
                              <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={car.image}
                                  alt={car.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-foreground truncate">
                                  {car.name}
                                </h3>
                                <Badge className="bg-primary/20 text-primary shrink-0">
                                  {car.match}% match
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                {car.reason}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {car.location}
                                </span>
                                <span className="flex items-center gap-1 text-primary font-semibold">
                                  <DollarSign className="w-3 h-3" />
                                  {car.price}/day
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-4 text-center">
                <Link href="/cars" onClick={onClose}>
                  <Button variant="outline">
                    <Car className="w-4 h-4" />
                    View All Cars
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
