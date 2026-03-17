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
  Calendar,
  DollarSign,
  X,
  Mic,
  MicOff,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface SearchResult {
  id: string
  name: string
  image: string
  price: number
  location: string
  match: number
  reason: string
}

// Simulated AI responses based on query
const simulateAISearch = async (query: string): Promise<{ message: string; results: SearchResult[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const queryLower = query.toLowerCase()

  // Different responses based on query content
  if (queryLower.includes("family") || queryLower.includes("kids") || queryLower.includes("spacious")) {
    return {
      message: "I found some great family-friendly vehicles with plenty of space for everyone. Here are my top recommendations:",
      results: [
        {
          id: "5",
          name: "Range Rover Sport",
          image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop&q=60",
          price: 275,
          location: "New York, NY",
          match: 98,
          reason: "Spacious 7-seater with premium comfort features",
        },
        {
          id: "6",
          name: "BMW X7",
          image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60",
          price: 320,
          location: "Los Angeles, CA",
          match: 95,
          reason: "Luxurious SUV with 3rd row seating",
        },
      ],
    }
  }

  if (queryLower.includes("sport") || queryLower.includes("fast") || queryLower.includes("performance")) {
    return {
      message: "Looking for thrills? Here are some high-performance vehicles that will get your heart racing:",
      results: [
        {
          id: "2",
          name: "Porsche 911 Carrera",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60",
          price: 450,
          location: "Miami, FL",
          match: 99,
          reason: "Iconic sports car with 379hp and perfect handling",
        },
        {
          id: "4",
          name: "BMW M4 Competition",
          image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=60",
          price: 380,
          location: "San Francisco, CA",
          match: 96,
          reason: "503hp twin-turbo for ultimate performance",
        },
      ],
    }
  }

  if (queryLower.includes("electric") || queryLower.includes("eco") || queryLower.includes("tesla")) {
    return {
      message: "Great choice going electric! Here are some premium EVs with excellent range:",
      results: [
        {
          id: "1",
          name: "Tesla Model S Plaid",
          image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=60",
          price: 299,
          location: "Los Angeles, CA",
          match: 100,
          reason: "1,020hp, 390mi range, fastest acceleration",
        },
        {
          id: "7",
          name: "Mercedes EQS",
          image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60",
          price: 350,
          location: "New York, NY",
          match: 94,
          reason: "Ultra-luxury EV with 350mi range",
        },
      ],
    }
  }

  if (queryLower.includes("cheap") || queryLower.includes("budget") || queryLower.includes("affordable")) {
    return {
      message: "I found some great value options that won't break the bank:",
      results: [
        {
          id: "8",
          name: "BMW 3 Series",
          image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60",
          price: 150,
          location: "Chicago, IL",
          match: 92,
          reason: "Premium sedan at an accessible price point",
        },
        {
          id: "9",
          name: "Audi A4",
          image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop&q=60",
          price: 140,
          location: "Dallas, TX",
          match: 90,
          reason: "Luxury features with great fuel economy",
        },
      ],
    }
  }

  // Default response
  return {
    message: "Based on your request, here are some vehicles that might interest you:",
    results: [
      {
        id: "1",
        name: "Tesla Model S Plaid",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=60",
        price: 299,
        location: "Los Angeles, CA",
        match: 95,
        reason: "Premium electric sedan with cutting-edge technology",
      },
      {
        id: "2",
        name: "Porsche 911 Carrera",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60",
        price: 450,
        location: "Miami, FL",
        match: 88,
        reason: "Iconic sports car for an unforgettable experience",
      },
    ],
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
      const result = await simulateAISearch(query)
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
                            <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={car.image}
                                alt={car.name}
                                fill
                                className="object-cover"
                              />
                            </div>
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
