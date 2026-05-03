"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CarCard } from "@/components/featured-cars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authFetch } from "@/lib/authFetch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Car,
  Heart,
  Camera,
  Edit2,
  Check,
  Loader2,
  Trash2,
  Bell,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

function getAvatarUrl(profileImage: string | undefined) {
  if (!profileImage) return "";
  if (profileImage.startsWith("http")) return profileImage;
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${profileImage}`;
}

function mapCarFromApi(car: any) {
  return {
    id: car._id,
    name: `${car.brand} ${car.model}`,
    year: car.year,
    price: car.pricePerDay,
    image: (car.images?.[0] || car.image)?.startsWith("http")
      ? car.images?.[0] || car.image
      : car.images?.[0] || car.image
        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${car.images?.[0] || car.image}`
        : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    location: car.location,
    fuelType: car.fuelType ?? "Gasoline",
    transmission: car.transmission ?? "Automatic",
    seats: car.seats ?? "—",
    owner: {
      name: car.owner?.username ?? "Owner",
      avatar: getAvatarUrl(car.owner?.profileImage),
    },
    likes: car.likes?.length ?? 0,
    likesIds: car.likes ?? [],
    commentsCount: car.commentsCount ?? 0,
  };
}

const carBrands = [
  "Audi",
  "BMW",
  "Bentley",
  "Cadillac",
  "Ferrari",
  "Ford",
  "Honda",
  "Jaguar",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Maserati",
  "McLaren",
  "Mercedes-Benz",
  "Porsche",
  "Rolls-Royce",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Other",
];

const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"];
const transmissionTypes = ["Manual", "Automatic", "CVT", "Robotic", "DCT"];

const brandOptions = carBrands.map((b) => ({ value: b, label: b }));
const fuelTypeOptions = fuelTypes.map((f) => ({ value: f, label: f }));
const transmissionOptions = transmissionTypes.map((t) => ({
  value: t,
  label: t,
}));
const seatOptions = [2, 4, 5, 6, 7, 8].map((n) => ({
  value: String(n),
  label: `${n} seats`,
}));
const minAgeOptions = [18, 21, 25, 30].map((age) => ({
  value: String(age),
  label: `${age}+`,
}));

const StableSelect = memo(function StableSelect({
  value,
  onValueChange,
  placeholder,
  triggerClassName,
  options,
}: {
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

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
];

function EditCarDialog({
  car,
  onSaved,
}: {
  car: any;
  onSaved: (updated: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const existingBrand = carBrands.includes(car.brand) ? car.brand : "Other";

  const [customBrand, setCustomBrand] = useState(
    existingBrand === "Other" ? (car.brand ?? "") : "",
  );

  const [form, setForm] = useState({
    brand: existingBrand,
    model: car.model ?? "",
    year: String(car.year ?? ""),
    fuelType: car.fuelType ?? "",
    transmission: car.transmission ?? "",
    seats: car.seats ? String(car.seats) : "",
    description: car.description ?? "",
    features: (car.features ?? []) as string[],
    rules: {
      noSmoking: car.rules?.noSmoking ?? true,
      noPets: car.rules?.noPets ?? false,
      minAge: String(car.rules?.minAge ?? "21"),
      cleanRecord: car.rules?.cleanRecord ?? true,
    },
    location: car.location ?? "",
    pricePerDay: String(car.pricePerDay ?? ""),
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const [existingImages, setExistingImages] = useState<string[]>(
    car.images?.length ? car.images : car.image ? [car.image] : [],
  );

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const onBrandChange = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, brand: value }));
    if (value !== "Other") setCustomBrand("");
  }, []);

  const onFuelTypeChange = useCallback(
    (value: string) => setForm((prev) => ({ ...prev, fuelType: value })),
    [],
  );

  const onTransmissionChange = useCallback(
    (value: string) => setForm((prev) => ({ ...prev, transmission: value })),
    [],
  );

  const onSeatsChange = useCallback(
    (value: string) => setForm((prev) => ({ ...prev, seats: value })),
    [],
  );

  const onMinAgeChange = useCallback(
    (value: string) =>
      setForm((prev) => ({ ...prev, rules: { ...prev.rules, minAge: value } })),
    [],
  );

  const handleChange = (field: string, value: string | string[] | boolean) => {
    if (field.startsWith("rules.")) {
      const ruleField = field.split(".")[1];
      setForm((prev) => ({
        ...prev,
        rules: { ...prev.rules, [ruleField]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value as any }));
    }
  };

  const setFeatureChecked = useCallback((feature: string) => {
    setForm((prev) => {
      const exists = prev.features.includes(feature);

      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      };
    });
  }, []);

  const validateForm = () => {
    if (
      !form.brand ||
      (form.brand === "Other" && !customBrand.trim()) ||
      !form.model.trim() ||
      !form.year ||
      form.year.length !== 4 ||
      !/^\d{4}$/.test(form.year) ||
      !form.fuelType ||
      !form.transmission ||
      !form.description.trim() ||
      !form.pricePerDay ||
      isNaN(Number(form.pricePerDay)) ||
      Number(form.pricePerDay) <= 0
    ) {
      setError(
        "Please complete all required fields correctly: Brand, Model, Year with exactly 4 digits, Fuel Type, Transmission, Description and Price.",
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const brandToSubmit =
        form.brand === "Other" ? customBrand.trim() : form.brand;

      const body = new FormData();

      body.append("title", `${brandToSubmit} ${form.model}`);
      body.append("brand", brandToSubmit);
      body.append("model", form.model);
      body.append("year", form.year);
      body.append("fuelType", form.fuelType);
      body.append("transmission", form.transmission);
      body.append("description", form.description);
      body.append("pricePerDay", form.pricePerDay);

      body.append("location", form.location);
      body.append("seats", form.seats);

      body.append("features", JSON.stringify(form.features));
      body.append("rules", JSON.stringify(form.rules));

      body.append("keepImages", JSON.stringify(existingImages));

      newImageFiles.forEach((file) => {
        body.append("images", file);
      });

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cars/${car._id}`,
        {
          method: "PUT",
          body,
        },
      );
      const text = await res.text();

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || "Failed to update car");
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to update car");
      }

      onSaved(data);
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-border"
        onClick={() => setOpen(true)}
      >
        <Edit2 className="w-3 h-3 mr-1" />
        Edit
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-[760px] max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Edit Car Listing</h2>
                <p className="text-sm text-muted-foreground">
                  Update your car details. Optional fields can stay empty.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand *</Label>
                  <StableSelect
                    value={form.brand}
                    onValueChange={onBrandChange}
                    placeholder="Select brand"
                    triggerClassName="bg-input border-border"
                    options={brandOptions}
                  />

                  {form.brand === "Other" && (
                    <Input
                      placeholder="Enter brand name"
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      className="bg-input border-border mt-2"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Model *</Label>
                  <Input
                    value={form.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Year *</Label>
                  <Input
                    value={form.year}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 4) {
                        handleChange("year", value);
                      }
                    }}
                    maxLength={4}
                    className="bg-input border-border"
                  />
                  {form.year && form.year.length !== 4 && (
                    <p className="text-sm text-destructive">
                      Year must be exactly 4 digits
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Price per Day *</Label>
                  <Input
                    type="number"
                    value={form.pricePerDay}
                    onChange={(e) =>
                      handleChange("pricePerDay", e.target.value)
                    }
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fuel Type *</Label>
                  <StableSelect
                    value={form.fuelType || undefined}
                    onValueChange={onFuelTypeChange}
                    placeholder="Select fuel type"
                    triggerClassName="bg-input border-border"
                    options={fuelTypeOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Transmission *</Label>
                  <StableSelect
                    value={form.transmission || undefined}
                    onValueChange={onTransmissionChange}
                    placeholder="Select transmission"
                    triggerClassName="bg-input border-border"
                    options={transmissionOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Number of Seats</Label>
                  <StableSelect
                    value={form.seats || undefined}
                    onValueChange={onSeatsChange}
                    placeholder="Select seats"
                    triggerClassName="bg-input border-border"
                    options={seatOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="bg-input border-border min-h-[120px]"
                />
              </div>

              <div className="space-y-4">
                <Label>Features</Label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {features.map((feature) => {
                    const checked = form.features.includes(feature);

                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => setFeatureChecked(feature)}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors text-left ${
                          checked
                            ? "bg-primary/10 border-primary"
                            : "bg-card border-border hover:border-primary/50"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border text-xs ${
                            checked
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border"
                          }`}
                        >
                          {checked ? "✓" : ""}
                        </span>

                        <span className="text-sm">{feature}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <Label>Rental Rules</Label>

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={form.rules.noSmoking}
                    onCheckedChange={(checked) =>
                      handleChange("rules.noSmoking", checked as boolean)
                    }
                  />
                  <span className="text-sm">No smoking in the vehicle</span>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={form.rules.noPets}
                    onCheckedChange={(checked) =>
                      handleChange("rules.noPets", checked as boolean)
                    }
                  />
                  <span className="text-sm">No pets allowed</span>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={form.rules.cleanRecord}
                    onCheckedChange={(checked) =>
                      handleChange("rules.cleanRecord", checked as boolean)
                    }
                  />
                  <span className="text-sm">Clean driving record required</span>
                </div>

                <div className="flex items-center gap-3">
                  <Label className="text-sm">Minimum driver age:</Label>
                  <StableSelect
                    value={form.rules.minAge}
                    onValueChange={onMinAgeChange}
                    triggerClassName="w-24 bg-input border-border"
                    options={minAgeOptions}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Car Images</Label>

                {existingImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {existingImages.map((image) => (
                      <div key={image} className="relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${image}`}
                          alt="Car"
                          className="h-24 w-full object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setExistingImages((prev) =>
                              prev.filter((item) => item !== image),
                            )
                          }
                          className="absolute top-2 right-2 rounded-full bg-destructive text-destructive-foreground w-6 h-6 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {newImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {newImagePreviews.map((preview, index) => (
                      <div key={preview} className="relative">
                        <img
                          src={preview}
                          alt="New car"
                          className="h-24 w-full object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewImageFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                            setNewImagePreviews((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                          className="absolute top-2 right-2 rounded-full bg-destructive text-destructive-foreground w-6 h-6 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="bg-input border-border"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const availableSlots =
                      8 - existingImages.length - newImageFiles.length;

                    if (availableSlots <= 0) {
                      e.target.value = "";
                      return;
                    }

                    const limitedFiles = files.slice(0, availableSlots);

                    setNewImageFiles((prev) => [...prev, ...limitedFiles]);
                    setNewImagePreviews((prev) => [
                      ...prev,
                      ...limitedFiles.map((file) => URL.createObjectURL(file)),
                    ]);

                    e.target.value = "";
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  You can keep, remove, or add images. Maximum 8 images.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function EditProfileDialog({
  user,
  onSaved,
}: {
  user: any;
  onSaved: (updated: any) => void;
}) {
  const [username, setUsername] = useState(user?.username ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const body = new FormData();
      body.append("username", username);
      if (fileRef.current?.files?.[0])
        body.append("profileImage", fileRef.current.files[0]);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body,
        },
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        onSaved(data);
        setOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your photo and display name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={getAvatarUrl(user?.profileImage)}
                alt={user?.username}
              />
              <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="border-border"
              onClick={() => fileRef.current?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Display Name</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-border"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type BookingRequest = {
  _id: string;
  status: "pending" | "approved" | "rejected";
  pickupDate: string;
  returnDate: string;
  car: {
    _id?: string;
    brand?: string;
    model?: string;
    title?: string;
  };
  renter: {
    username?: string;
    email?: string;
    profileImage?: string;
  };
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userCars, setUserCars] = useState<ReturnType<typeof mapCarFromApi>[]>(
    [],
  );
  const [rawCars, setRawCars] = useState<any[]>([]);
  const [favoriteCars, setFavoriteCars] = useState<
    ReturnType<typeof mapCarFromApi>[]
  >([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "cars";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (!stored) {
      window.location.href = "/login";
      return;
    }
    setUser(stored);

    const fetchData = async () => {
      try {
        const [userRes, carsRes, allCarsRes, bookingsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${stored._id}`),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${stored._id}/cars?limit=50`,
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars?limit=200`),
          authFetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/owner`),
        ]);
        const [userData, carsData, allCarsData, bookingsData] = await Promise.all([
          userRes.json(),
          carsRes.json(),
          allCarsRes.json(),
          bookingsRes.json(),
        ]);
        setUser(userData);
        setRawCars(carsData.cars);
        setUserCars(carsData.cars.map(mapCarFromApi));
        const liked = (allCarsData.cars ?? [])
          .filter((c: any) => c.likes?.includes(stored._id))
          .map(mapCarFromApi);
        setFavoriteCars(liked);
      const uniqueBookings = Array.from(
  new Map(
    (Array.isArray(bookingsData) ? bookingsData : []).map((b: any) => [b._id, b])
  ).values()
);

setBookingRequests(uniqueBookings);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCarUpdated = (updatedRaw: any) => {
    setRawCars((prev) =>
      prev.map((c) => (c._id === updatedRaw._id ? updatedRaw : c)),
    );
    setUserCars((prev) =>
      prev.map((c) =>
        c.id === updatedRaw._id ? mapCarFromApi(updatedRaw) : c,
      ),
    );
  };

  const handleLikeChange = (carId: string, isLiked: boolean) => {
    const userId = JSON.parse(localStorage.getItem("user") || "null")?._id;

    const updateCarLikes = (car: ReturnType<typeof mapCarFromApi>) => {
      if (car.id !== carId) return car;
      return {
        ...car,
        likes: isLiked ? car.likes + 1 : car.likes - 1,
        likesIds: isLiked
          ? [...(car.likesIds ?? []), userId]
          : (car.likesIds ?? []).filter((id: string) => id !== userId),
      };
    };

    setUserCars((prev) => prev.map(updateCarLikes));

    if (!isLiked) {
      setFavoriteCars((prev) => prev.filter((c) => c.id !== carId));
    } else {
      setFavoriteCars((prev) => {
        if (prev.some((c) => c.id === carId)) return prev.map(updateCarLikes);
        const carToAdd = userCars.find((c) => c.id === carId);
        if (!carToAdd) return prev;
        return [...prev, updateCarLikes(carToAdd)];
      });
    }
  };

  const handleCarDeleted = async (carId: string) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.ok) {
      setRawCars((prev) => prev.filter((c) => c._id !== carId));
      setUserCars((prev) => prev.filter((c) => c.id !== carId));
    }
  };

  const handleBookingStatus = async (
    bookingId: string,
    status: "approved" | "rejected",
  ) => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update booking");
      }

      setBookingRequests((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking,
        ),
      );

      setBookingMessage(`Booking ${status}`);
    } catch (err: any) {
      setBookingMessage(err.message || "Failed to update booking");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        isAuthenticated
        user={{
          name: user?.username,
          avatar: getAvatarUrl(user?.profileImage),
        }}
      />
      <main className="pt-16">
        {/* Profile Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage
                    src={getAvatarUrl(user?.profileImage)}
                    alt={user?.username}
                  />
                  <AvatarFallback className="text-4xl">
                    {user?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h1 className="font-serif text-3xl font-medium italic text-foreground">
                    <span className="text-primary">{user?.username}</span>
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since{" "}
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <EditProfileDialog user={user} onSaved={setUser} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userCars.length}
                </div>
                <div className="text-sm text-muted-foreground">Cars Listed</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userCars.reduce((sum, c) => sum + c.likes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs
            value={activeTab}
            onValueChange={(tab) =>
              window.history.replaceState(null, "", `?tab=${tab}`)
            }
            className="w-full"
          >
            <TabsList className="bg-card border border-border mb-8">
              <TabsTrigger value="cars" className="gap-2">
                <Car className="w-4 h-4" />
                My Cars ({userCars.length})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Bell className="w-4 h-4" />
                Requests ({bookingRequests.filter((b) => b.status === "pending").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars">
              {userCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCars.map((car) => {
                    const raw = rawCars.find((r) => r._id === car.id);
                    return (
                      <div key={car.id} className="flex flex-col">
                        <CarCard car={car} onLikeChange={handleLikeChange} />
                        <div className="flex gap-2 mt-2">
                          {raw && (
                            <EditCarDialog
                              car={raw}
                              onSaved={handleCarUpdated}
                            />
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleCarDeleted(car.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No cars listed yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Share your car and start earning
                  </p>
                  <Link href="/list-your-car">
                    <Button className="bg-primary text-primary-foreground">
                      List Your Car
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites">
              {favoriteCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onLikeChange={handleLikeChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring and save cars you love
                  </p>
                  <Link href="/cars">
                    <Button className="bg-primary text-primary-foreground">
                      Browse Cars
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>


            <TabsContent value="bookings">
              {bookingMessage && (
                <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
                  {bookingMessage}
                </div>
              )}

              {bookingRequests.length > 0 ? (
                <div className="space-y-4">
                  {bookingRequests.map((booking) => (
                    <Card key={booking._id} className="bg-card border-border">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {booking.car?.brand || booking.car?.title} {booking.car?.model}
                            </h3>

                            <p className="text-muted-foreground">
                              Requested by: {booking.renter?.username || booking.renter?.email || "User"}
                            </p>

                            <p className="text-muted-foreground">
                              From: {new Date(booking.pickupDate).toLocaleDateString()}
                            </p>

                            <p className="text-muted-foreground">
                              To: {new Date(booking.returnDate).toLocaleDateString()}
                            </p>

                            <p className="mt-2">
                              Status: <span className="font-semibold text-primary">{booking.status}</span>
                            </p>
                          </div>

                          {booking.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                className="bg-primary text-primary-foreground"
                                onClick={() => handleBookingStatus(booking._id, "approved")}
                              >
                                Approve
                              </Button>

                              <Button
                                variant="destructive"
                                onClick={() => handleBookingStatus(booking._id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No booking requests yet
                  </h3>
                  <p className="text-muted-foreground">
                    When someone wants to rent your car, the request will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
