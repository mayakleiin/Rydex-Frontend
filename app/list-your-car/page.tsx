"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Car,
  Upload,
  DollarSign,
  MapPin,
  Calendar,
  Fuel,
  Users,
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react"

const carBrands = [
  "Audi", "BMW", "Bentley", "Cadillac", "Ferrari", "Ford", "Honda", "Jaguar",
  "Lamborghini", "Land Rover", "Lexus", "Maserati", "McLaren", "Mercedes-Benz",
  "Porsche", "Rolls-Royce", "Tesla", "Toyota", "Volkswagen"
]

const fuelTypes = ["Premium", "Regular", "Diesel", "Electric", "Hybrid"]
const transmissionTypes = ["Automatic", "Manual", "Semi-Automatic"]
const categories = ["Luxury", "Sports", "SUV", "Sedan", "Electric", "Exotic", "Business"]

const features = [
  "Apple CarPlay / Android Auto",
  "Navigation System",
  "Bluetooth",
  "Backup Camera",
  "Heated Seats",
  "Cooled Seats",
  "Sunroof/Moonroof",
  "Leather Seats",
  "Premium Sound System",
  "Adaptive Cruise Control",
  "Lane Departure Warning",
  "Parking Sensors",
  "360 Camera",
  "Keyless Entry",
  "Wireless Charging",
  "WiFi Hotspot",
]

type Step = 1 | 2 | 3 | 4

export default function ListYourCarPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/login")
    }
  }, [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    brand: "",
    model: "",
    year: "",
    category: "",
    // Step 2 - Details
    fuelType: "",
    transmission: "",
    seats: "",
    horsepower: "",
    description: "",
    // Step 3 - Features & Rules
    features: [] as string[],
    rules: {
      noSmoking: true,
      noPets: false,
      minAge: "21",
      cleanRecord: true,
    },
    // Step 4 - Location & Pricing
    location: "",
    address: "",
    pricePerDay: "",
    minRentalDays: "1",
    maxRentalDays: "30",
  })

  const handleChange = (field: string, value: string | string[] | boolean) => {
    if (field.startsWith("rules.")) {
      const ruleField = field.split(".")[1]
      setFormData({
        ...formData,
        rules: { ...formData.rules, [ruleField]: value },
      })
    } else {
      setFormData({ ...formData, [field]: value })
    }
  }

  const toggleFeature = (feature: string) => {
    const newFeatures = formData.features.includes(feature)
      ? formData.features.filter((f) => f !== feature)
      : [...formData.features, feature]
    handleChange("features", newFeatures)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...imageFiles, ...files].slice(0, 8)
    setImageFiles(newFiles)
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)))
  }

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    setImageFiles(newFiles)
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as Step)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step)
  }

  const handleSubmit = async () => {
    setError("")
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        router.push("/login")
        return
      }

      const body = new FormData()
      body.append("title", `${formData.brand} ${formData.model} ${formData.year}`)
      body.append("make", formData.brand)
      body.append("model", formData.model)
      body.append("year", formData.year)
      body.append("description", formData.description || "No description provided")
      body.append("location", formData.location)
      body.append("pricePerDay", formData.pricePerDay)
      if (formData.fuelType) body.append("fuelType", formData.fuelType)
      if (formData.transmission) body.append("transmission", formData.transmission)
      if (formData.seats) body.append("seats", formData.seats)
      if (imageFiles[0]) body.append("image", imageFiles[0])

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create listing")

      router.push("/profile?listed=true")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Basic Info", icon: Car },
    { number: 2, title: "Details", icon: Settings },
    { number: 3, title: "Features", icon: Check },
    { number: 4, title: "Pricing", icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl font-medium italic text-foreground mb-4">
              List Your <span className="text-primary">Car</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Share your vehicle with our community and start earning. It only takes a few minutes.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                    currentStep >= step.number
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-24 lg:w-32 h-1 mx-2 ${
                      currentStep > step.number ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) => handleChange("brand", value)}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {carBrands.map((brand) => (
                            <SelectItem key={brand} value={brand.toLowerCase()}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        placeholder="e.g., 911 Carrera"
                        value={formData.model}
                        onChange={(e) => handleChange("model", e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => handleChange("year", value)}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleChange("category", value)}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat.toLowerCase()}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>Photos</Label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img src={preview} alt={`Car ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {imagePreviews.length < 8 && (
                        <button
                          type="button"
                          onClick={() => document.getElementById("image-upload")?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Add Photo</span>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload up to 8 photos. First photo will be the main image.
                    </p>
                  </div>
                </>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Fuel Type</Label>
                      <Select
                        value={formData.fuelType}
                        onValueChange={(value) => handleChange("fuelType", value)}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          {fuelTypes.map((fuel) => (
                            <SelectItem key={fuel} value={fuel.toLowerCase()}>
                              {fuel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Transmission</Label>
                      <Select
                        value={formData.transmission}
                        onValueChange={(value) => handleChange("transmission", value)}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          {transmissionTypes.map((trans) => (
                            <SelectItem key={trans} value={trans.toLowerCase()}>
                              {trans}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Number of Seats</Label>
                      <Select
                        value={formData.seats}
                        onValueChange={(value) => handleChange("seats", value)}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select seats" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} seats
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horsepower">Horsepower</Label>
                      <Input
                        id="horsepower"
                        placeholder="e.g., 379"
                        value={formData.horsepower}
                        onChange={(e) => handleChange("horsepower", e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell renters about your car - what makes it special, its condition, any unique features..."
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="bg-input border-border min-h-[150px]"
                    />
                  </div>
                </>
              )}

              {/* Step 3: Features & Rules */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-4">
                    <Label>Features (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {features.map((feature) => (
                        <div
                          key={feature}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            formData.features.includes(feature)
                              ? "bg-primary/10 border-primary"
                              : "bg-card border-border hover:border-primary/50"
                          }`}
                          onClick={() => toggleFeature(feature)}
                        >
                          <Checkbox
                            checked={formData.features.includes(feature)}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-border">
                    <Label>Rental Rules</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="noSmoking"
                          checked={formData.rules.noSmoking}
                          onCheckedChange={(checked) => handleChange("rules.noSmoking", checked as boolean)}
                        />
                        <label htmlFor="noSmoking" className="text-sm text-foreground cursor-pointer">
                          No smoking in the vehicle
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="noPets"
                          checked={formData.rules.noPets}
                          onCheckedChange={(checked) => handleChange("rules.noPets", checked as boolean)}
                        />
                        <label htmlFor="noPets" className="text-sm text-foreground cursor-pointer">
                          No pets allowed
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="cleanRecord"
                          checked={formData.rules.cleanRecord}
                          onCheckedChange={(checked) => handleChange("rules.cleanRecord", checked as boolean)}
                        />
                        <label htmlFor="cleanRecord" className="text-sm text-foreground cursor-pointer">
                          Clean driving record required
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Label htmlFor="minAge" className="text-sm">Minimum driver age:</Label>
                        <Select
                          value={formData.rules.minAge}
                          onValueChange={(value) => handleChange("rules.minAge", value)}
                        >
                          <SelectTrigger className="w-24 bg-input border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[18, 21, 25, 30].map((age) => (
                              <SelectItem key={age} value={age.toString()}>
                                {age}+
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Location & Pricing */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="location">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="e.g., Los Angeles, CA"
                          value={formData.location}
                          onChange={(e) => handleChange("location", e.target.value)}
                          className="pl-10 bg-input border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Pickup Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address (visible only to confirmed renters)"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-border">
                    <div className="space-y-2">
                      <Label htmlFor="pricePerDay">Price per Day</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="pricePerDay"
                          type="number"
                          placeholder="0"
                          value={formData.pricePerDay}
                          onChange={(e) => handleChange("pricePerDay", e.target.value)}
                          className="pl-10 bg-input border-border"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You will receive 85% of the rental price. Rydex takes a 15% service fee.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Minimum Rental Days</Label>
                        <Select
                          value={formData.minRentalDays}
                          onValueChange={(value) => handleChange("minRentalDays", value)}
                        >
                          <SelectTrigger className="bg-input border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 5, 7].map((days) => (
                              <SelectItem key={days} value={days.toString()}>
                                {days} {days === 1 ? "day" : "days"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum Rental Days</Label>
                        <Select
                          value={formData.maxRentalDays}
                          onValueChange={(value) => handleChange("maxRentalDays", value)}
                        >
                          <SelectTrigger className="bg-input border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[7, 14, 30, 60, 90].map((days) => (
                              <SelectItem key={days} value={days.toString()}>
                                {days} days
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Earnings Preview */}
                    {formData.pricePerDay && (
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-foreground mb-2">Estimated Earnings</h4>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                ${Math.round(Number(formData.pricePerDay) * 0.85 * 4)}
                              </div>
                              <div className="text-sm text-muted-foreground">Per Week</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                ${Math.round(Number(formData.pricePerDay) * 0.85 * 15)}
                              </div>
                              <div className="text-sm text-muted-foreground">Per Month</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                ${Math.round(Number(formData.pricePerDay) * 0.85 * 180)}
                              </div>
                              <div className="text-sm text-muted-foreground">Per Year</div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            Based on 50% occupancy rate
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={prevStep} className="border-border">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {currentStep < 4 ? (
                  <Button onClick={nextStep} className="bg-primary text-primary-foreground">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-primary text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Listing Your Car...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        List Your Car
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}
