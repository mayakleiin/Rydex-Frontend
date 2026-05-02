"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type Booking = {
  _id: string
  status: "pending" | "approved" | "rejected"
  pickupDate: string
  returnDate: string
  car: {
    make?: string
    model?: string
    brand?: string
    title?: string
    year?: number
  }
  renter: {
    username?: string
    email?: string
  }
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const fetchBookings = async () => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      setMessage("Please login first")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/owner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to load bookings")
      }

      setBookings(data)
    } catch (err: any) {
      setMessage(err.message || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: "approved" | "rejected") => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      setMessage("Please login first")
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to update booking")
      }

      setMessage(`Booking ${status}`)
      fetchBookings()
    } catch (err: any) {
      setMessage(err.message || "Failed to update booking")
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (loading) {
    return <div className="min-h-screen p-10 text-white">Loading bookings...</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-10">
      <h1 className="text-3xl font-bold mb-6">Booking Requests</h1>

      {message && <p className="mb-4 text-primary">{message}</p>}

      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No booking requests yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-border rounded-xl p-5 bg-card"
            >
              <h2 className="text-xl font-semibold">
                {booking.car?.make || booking.car?.brand || booking.car?.title}{" "}
                {booking.car?.model}
              </h2>

              <p className="text-muted-foreground">
                Renter: {booking.renter?.username || booking.renter?.email}
              </p>

              <p className="text-muted-foreground">
                Pickup: {new Date(booking.pickupDate).toLocaleDateString()}
              </p>

              <p className="text-muted-foreground">
                Return: {new Date(booking.returnDate).toLocaleDateString()}
              </p>

              <p className="mt-2">
                Status: <span className="font-bold">{booking.status}</span>
              </p>

              {booking.status === "pending" && (
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => updateBookingStatus(booking._id, "approved")}>
                    Approve
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => updateBookingStatus(booking._id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}