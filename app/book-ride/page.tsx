"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  MapPin,
  LocateFixed,
  Clock,
  Car,
  Bike,
  Smartphone,
  CreditCard,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { initiatePayment } from "@/app/actions/mpesa"

const BARATON_LOCATIONS = [
  "Baraton University Main Gate",
  "Baraton University Library",
  "Baraton University Cafeteria",
  "Baraton University Chapel",
  "Baraton University Admin Block",
  "Baraton University Hostels",
  "Baraton Shopping Center",
  "Baraton Health Center",
  "Baraton Sports Complex",
  "Kapsabet Town",
  "Nandi Hills",
  "Eldoret Town",
]

export default function BookRide() {
  const [rideType, setRideType] = useState("car")
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [pickupLocation, setPickupLocation] = useState("Baraton University Main Gate")
  const [destination, setDestination] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const router = useRouter()

  const fare = rideType === "car" ? 200 : 100
  const serviceFee = 20
  const total = fare + serviceFee
  const eta = rideType === "car" ? 5 : 3

  const filteredPickupLocations = BARATON_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(pickupLocation.toLowerCase())
  )

  const filteredDestinations = BARATON_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(destination.toLowerCase())
  )

  const handleBookRide = async () => {
    if (!destination) {
      setError("Please enter a destination")
      return
    }

    if (paymentMethod === "mpesa" && !phoneNumber) {
      setError("Please enter your M-Pesa phone number")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    // Create the ride first
    const { data: rideData, error: insertError } = await supabase
      .from("rides")
      .insert({
        user_id: user.id,
        pickup_location: pickupLocation,
        destination: destination,
        ride_type: rideType,
        fare: total,
        payment_method: paymentMethod, // 'mpesa' or 'card'
        status: "pending",
        payment_status: "pending", // Both card and mpesa start as pending
        total_amount: total,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    // If M-Pesa payment, initiate STK push
    if (paymentMethod === "mpesa") {
      const mpesaResult = await initiatePayment({
        phoneNumber: phoneNumber,
        amount: total,
        referenceId: rideData.id, 
        type: "ride",
        description: `Baraton Ride`,
      })

      if (mpesaResult.error) {
        setError(mpesaResult.error || "Failed to initiate M-Pesa payment")
        await supabase
          .from("rides")
          .update({ payment_status: "failed" })
          .eq("id", rideData.id)
        setIsLoading(false)
        return
      }
    } else if (paymentMethod === "card") {
      // For Visa/Card, we just simulate success or redirect to a card gateway
      // Since no gateway is integrated yet, we just proceed
    }

    // Store ride ID in session storage for confirmation page
    sessionStorage.setItem("currentRideId", rideData.id)
    router.push("/ride-confirmation")
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background p-4 flex items-center border-b">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Book a Ride</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Location Inputs */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-0.5 h-12 bg-border my-1"></div>
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    onFocus={() => setShowPickupSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                    className="pl-10 border-border"
                  />
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary" />
                  {showPickupSuggestions && filteredPickupLocations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredPickupLocations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            setPickupLocation(loc)
                            setShowPickupSuggestions(false)
                          }}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Input 
                    placeholder="Where to?" 
                    className="pl-10 border-border"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setShowDestinationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                  />
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-destructive" />
                  {showDestinationSuggestions && filteredDestinations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredDestinations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            setDestination(loc)
                            setShowDestinationSuggestions(false)
                          }}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button variant="outline" size="icon" className="flex-shrink-0 bg-transparent">
                <LocateFixed className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map Preview */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="bg-muted h-40 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Baraton University Area</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ride Options */}
        <h2 className="text-lg font-semibold mb-3 text-foreground">Select Ride Type</h2>
        <RadioGroup
          defaultValue="car"
          className="grid grid-cols-2 gap-4 mb-6"
          value={rideType}
          onValueChange={setRideType}
        >
          <div className="relative">
            <RadioGroupItem value="car" id="car" className="sr-only" />
            <Label
              htmlFor="car"
              className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${rideType === "car" ? "border-primary bg-primary/10" : "border-border"}`}
            >
              <Car className={`h-8 w-8 mb-2 ${rideType === "car" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium text-foreground">Car</span>
              <span className="text-sm text-muted-foreground mt-1">KES 200 - 5 mins</span>
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem value="bike" id="bike" className="sr-only" />
            <Label
              htmlFor="bike"
              className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${rideType === "bike" ? "border-primary bg-primary/10" : "border-border"}`}
            >
              <Bike className={`h-8 w-8 mb-2 ${rideType === "bike" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium text-foreground">Boda Boda</span>
              <span className="text-sm text-muted-foreground mt-1">KES 100 - 3 mins</span>
            </Label>
          </div>
        </RadioGroup>

        {/* Payment Method */}
        <h2 className="text-lg font-semibold mb-3 text-foreground">Payment Method</h2>
        <RadioGroup
          defaultValue="mpesa"
          className="space-y-3 mb-6"
          value={paymentMethod}
          onValueChange={setPaymentMethod}
        >
          <div className="flex items-center space-x-3 border rounded-lg p-3 bg-background">
            <RadioGroupItem value="mpesa" id="mpesa" />
            <Label htmlFor="mpesa" className="flex items-center flex-1 cursor-pointer">
              <Smartphone className="h-5 w-5 text-[#00A550] mr-3" />
              <div>
                <p className="font-medium text-foreground">M-Pesa</p>
                <p className="text-sm text-muted-foreground">Pay via Safaricom M-Pesa</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 border rounded-lg p-3 bg-background">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
              <CreditCard className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="font-medium text-foreground">Visa / Mastercard</p>
                <p className="text-sm text-muted-foreground">Pay securely with card</p>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* M-Pesa Phone Number Input */}
        {paymentMethod === "mpesa" && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                M-Pesa Phone Number
              </Label>
              <div className="relative mt-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                />
                <Smartphone className="absolute left-3 top-3 h-5 w-5 text-[#00A550]" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter your Safaricom number starting with 254
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ride Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-foreground">Ride Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ride fare</span>
                <span className="text-foreground">KES {fare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span className="text-foreground">KES {serviceFee}</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">KES {total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Action */}
      <div className="bg-background p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-foreground">
              Estimated arrival: <strong>{eta} mins</strong>
            </span>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">KES {total}</p>
            <p className="text-xs text-muted-foreground">Total fare</p>
          </div>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleBookRide}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {paymentMethod === "mpesa" ? "Sending M-Pesa Request..." : "Booking..."}
            </>
          ) : (
            <>
              {paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Confirm Ride"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}