import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground mb-6 leading-tight italic">
          <span className="text-primary">Ready</span> to experience
          <br />
          premium driving?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of satisfied customers who trust Rydex for their premium car rental needs.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/cars">
            <Button size="lg" className="group">
              Browse Cars
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/list-your-car">
            <Button variant="outline" size="lg">List Your Car</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
