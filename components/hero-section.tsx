"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Calendar, ArrowRight, Play, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [location, setLocation] = useState("")

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Full-bleed Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-car.jpg"
          alt="Luxury sports car"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="max-w-3xl">
          {/* Main Headline - Elegant Italic Serif like inspiration */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium mb-6 leading-[1.05] tracking-tight">
            <span className="italic text-primary">Your journey</span>
            <br />
            <span className="italic text-foreground">starts here</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-foreground/80 mb-10 max-w-xl leading-relaxed">
            Smooth, simple, and stress-free{" "}
            <span className="text-primary font-medium">premium car rentals.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link href="/cars">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 group">
                Browse Cars
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/list-your-car">
              <Button variant="outline" size="lg" className="border-foreground/30 hover:border-foreground hover:bg-foreground/10">
                List Your Car
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 bg-primary/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center text-center mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mb-2">
              Trusted by
            </p>
            <p className="text-4xl sm:text-5xl font-serif font-normal text-primary-foreground">
              1500+ Drivers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-primary-foreground/20">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1">10K+</div>
              <div className="text-sm text-primary-foreground/70">Premium Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1">50K+</div>
              <div className="text-sm text-primary-foreground/70">Happy Renters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1">100+</div>
              <div className="text-sm text-primary-foreground/70">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1">4.9</div>
              <div className="text-sm text-primary-foreground/70">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-foreground/50 uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-5 h-5 text-foreground/50" />
      </div>
    </section>
  )
}
