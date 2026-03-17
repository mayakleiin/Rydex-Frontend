import { Search, Shield, Key } from "lucide-react"

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Discover",
    description: "Browse our curated collection of premium vehicles and find your perfect match."
  },
  {
    icon: Shield,
    number: "02",
    title: "Book",
    description: "Reserve your car in seconds with our secure, transparent booking system."
  },
  {
    icon: Key,
    number: "03",
    title: "Drive",
    description: "Pick up your keys and enjoy the open road with complete peace of mind."
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4 font-medium">How it works</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-foreground italic">
            Simple. Fast. <span className="text-primary">Premium.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="flex flex-col items-center text-center">
                {/* Number */}
                <div className="text-7xl font-serif font-light text-border/50 mb-6 group-hover:text-primary/30 transition-colors">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
