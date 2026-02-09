"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Package, ChevronRight, Smartphone, CreditCard, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { initiatePayment } from "@/app/actions/mpesa"
import { getPricingLocationsSettings } from "@/app/actions/app-settings"

const DEFAULT_LOCATIONS = [
  "Baraton University Main Gate",
  "Baraton University Library",
  "Baraton University Cafeteria",
  "Baraton University Chapel",
  "Baraton University Admin Block",
  "Baraton University Hostels - Male",
  "Baraton University Hostels - Female",
  "Baraton Shopping Center",
  "Baraton Health Center",
  "Baraton Sports Complex",
  "Kapsabet Town",
  "Nandi Hills",
  "Eldoret Town",
]

export default function PackageDelivery() {
  const [packageSize, setPackageSize] = useState("small")
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [deliveryTime, setDeliveryTime] = useState("standard")
  const [pickupLocation, setPickupLocation] = useState("Baraton University Main Gate")
  const [deliveryLocation, setDeliveryLocation] = useState("")
  const [packageName, setPackageName] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [mpesaPhone, setMpesaPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDeliverySuggestions, setShowDeliverySuggestions] = useState(false)
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS)
  const router = useRouter()

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getPricingLocationsSettings()
      if (data.locations.length > 0) {
        setLocations(data.locations)
        setPickupLocation(data.locations[0])
      }
    }

    loadSettings()
  }, [])

  const getDeliveryFee = () => {
    const baseFees: Record<string, number> = {
      small: 150,
      medium: 250,
      large: 400,
      "extra-large": 600,
    }
    const expressFee = deliveryTime === "express" ? 100 : 0
    return baseFees[packageSize] + expressFee
  }

  const serviceFee = 20
  const deliveryFee = getDeliveryFee()
  const total = deliveryFee + serviceFee

  const getEstimatedTime = () => {
    if (deliveryTime === "express") return "15-30 mins"
    if (deliveryTime === "scheduled") return "As scheduled"
    return "30-60 mins"
  }

  const filteredPickupLocations = locations.filter(loc =>
    loc.toLowerCase().includes(pickupLocation.toLowerCase())
  )

  const filteredDeliveryLocations = locations.filter(loc =>
    loc.toLowerCase().includes(deliveryLocation.toLowerCase())
  )

  const handleUseGps = (setter: (value: string) => void) => {
    if (!navigator.geolocation) {
      setError("GPS is not supported on this device")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
        setter(coords)
      },
      () => {
        setError("Unable to access your location. Please enter it manually.")
      }
    )
  }

  const handleConfirmDelivery = async () => {
    if (!deliveryLocation) {
      setError("Please enter the delivery location")
      return
    }
    if (!packageName) {
      setError("Please enter the package name")
      return
    }
    if (!recipientName) {
      setError("Please enter the recipient name")
      return
    }
    if (!recipientPhone) {
      setError("Please enter the recipient phone number")
      return
    }
    if (paymentMethod === "mpesa" && !mpesaPhone) {
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

    const { data, error: insertError } = await supabase
      .from("package_deliveries")
      .insert({
        user_id: user.id,
        pickup_location: pickupLocation,
        delivery_location: deliveryLocation,
        package_name: packageName,
        package_size: packageSize,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        delivery_notes: notes || null,
        delivery_time: deliveryTime,
        fee: total,
        payment_method: paymentMethod, // 'mpesa' or 'card'
        status: "pending",
        payment_status: "pending", 
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
        phoneNumber: mpesaPhone,
        amount: total,
        referenceId: data.id,
        type: "package_delivery",
        description: `Baraton Package Delivery: ${packageName}`,
      })

      if (mpesaResult.error) {
        setError(mpesaResult.error || "Failed to initiate M-Pesa payment")
        await supabase
          .from("package_deliveries")
          .update({ payment_status: "failed" })
          .eq("id", data.id)
        setIsLoading(false)
        return
      }
    }

    sessionStorage.setItem("currentPackageId", data.id)
    router.push("/orders")
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
        <h1 className="text-xl font-semibold text-foreground">Send Package</h1>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-7 text-xs text-primary"
                    onClick={() => handleUseGps(setPickupLocation)}
                  >
                    Use GPS
                  </Button>
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
                    placeholder="Delivery location" 
                    className="pl-10 border-border"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    onFocus={() => setShowDeliverySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDeliverySuggestions(false), 200)}
                  />
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-destructive" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-7 text-xs text-destructive"
                    onClick={() => handleUseGps(setDeliveryLocation)}
                  >
                    Use GPS
                  </Button>
                  {showDeliverySuggestions && filteredDeliveryLocations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredDeliveryLocations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            setDeliveryLocation(loc)
                            setShowDeliverySuggestions(false)
                          }}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Details */}
        <h2 className="text-lg font-semibold mb-3 text-foreground">Package Details</h2>
        <Card className="mb-6">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="package-name" className="block mb-2 text-foreground">
                Package Name
              </Label>
              <Input 
                id="package-name" 
                placeholder="e.g. Textbooks, Laptop, etc." 
                className="border-border"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="package-size" className="block mb-2 text-foreground">
                Package Size
              </Label>
              <Select defaultValue="small" onValueChange={setPackageSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (less than 1kg) - KES 150</SelectItem>
                  <SelectItem value="medium">Medium (1-3kg) - KES 250</SelectItem>
                  <SelectItem value="large">Large (3-5kg) - KES 400</SelectItem>
                  <SelectItem value="extra-large">Extra Large (more than 5kg) - KES 600</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipient-name" className="block mb-2 text-foreground">
                Recipient Name
              </Label>
              <Input 
                id="recipient-name" 
                placeholder="Enter recipient name" 
                className="border-border"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="recipient-phone" className="block mb-2 text-foreground">
                Recipient Phone
              </Label>
              <Input 
                id="recipient-phone" 
                placeholder="e.g. 0712345678" 
                className="border-border"
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="delivery-time" className="block mb-2 text-foreground">
                Delivery Time
              </Label>
              <Select defaultValue="standard" onValueChange={setDeliveryTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (30-60 mins)</SelectItem>
                  <SelectItem value="express">Express (15-30 mins) +KES 100</SelectItem>
                  <SelectItem value="scheduled">Scheduled Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="package-notes" className="block mb-2 text-foreground">
                Delivery Notes (Optional)
              </Label>
              <Textarea
                id="package-notes"
                placeholder="Any special instructions for the delivery"
                className="border-border resize-none"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

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

        {/* M-Pesa Phone Input */}
        {paymentMethod === "mpesa" && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Label htmlFor="mpesa-phone" className="text-sm font-medium text-foreground">
                M-Pesa Phone Number
              </Label>
              <div className="relative mt-2">
                <Input
                  id="mpesa-phone"
                  type="tel"
                  placeholder="254712345678"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
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

        {/* Delivery Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-foreground">Delivery Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span className="text-foreground">KES {deliveryFee}</span>
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
            <Package className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-foreground">
              Estimated delivery: <strong>{getEstimatedTime()}</strong>
            </span>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">KES {total}</p>
            <p className="text-xs text-muted-foreground">Total amount</p>
          </div>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleConfirmDelivery}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {paymentMethod === "mpesa" ? "Sending M-Pesa Request..." : "Processing..."}
            </>
          ) : (
            <>
              {paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Confirm Delivery"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
