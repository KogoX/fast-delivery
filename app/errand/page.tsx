"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Clock, ChevronRight, Smartphone, CreditCard, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { initiatePayment } from "@/app/actions/mpesa"

const BARATON_LOCATIONS = [
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

export default function Errand() {
  const [errandType, setErrandType] = useState("pickup")
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [urgency, setUrgency] = useState("standard")
  const [userLocation, setUserLocation] = useState("Baraton University Main Gate")
  const [errandLocation, setErrandLocation] = useState("")
  const [description, setDescription] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [mpesaPhone, setMpesaPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)
  const [showErrandSuggestions, setShowErrandSuggestions] = useState(false)
  const router = useRouter()

  const serviceFee = urgency === "urgent" ? 350 : 200
  const platformFee = 20
  const total = serviceFee + platformFee
  const estimatedTime = urgency === "urgent" ? "30 mins" : "1 hour"

  const filteredUserLocations = BARATON_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(userLocation.toLowerCase())
  )

  const filteredErrandLocations = BARATON_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(errandLocation.toLowerCase())
  )

  const handleConfirmErrand = async () => {
    if (!errandLocation) {
      setError("Please enter the errand location")
      return
    }
    if (!description) {
      setError("Please describe your errand")
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
      .from("errands")
      .insert({
        user_id: user.id,
        errand_type: errandType,
        user_location: userLocation,
        errand_location: errandLocation,
        description: description,
        additional_notes: additionalNotes || null,
        urgency: urgency,
        scheduled_time: urgency === "scheduled" && scheduledTime ? scheduledTime : null,
        fee: total,
        payment_method: paymentMethod, // 'mpesa' or 'card'
        status: "pending",
        payment_status: "pending",
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
        type: "errand",
        description: `Baraton Errand: ${errandType}`,
      })

      if (mpesaResult.error) {
        setError(mpesaResult.error || "Failed to initiate M-Pesa payment")
        await supabase
          .from("errands")
          .update({ payment_status: "failed" })
          .eq("id", data.id)
        setIsLoading(false)
        return
      }
    }

    sessionStorage.setItem("currentErrandId", data.id)
    router.push("/errand-confirmation")
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
        <h1 className="text-xl font-semibold text-foreground">Request Errand</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Location Input */}
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
                    placeholder="Your location"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    onFocus={() => setShowUserSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowUserSuggestions(false), 200)}
                    className="pl-10 border-border"
                  />
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary" />
                  {showUserSuggestions && filteredUserLocations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredUserLocations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            setUserLocation(loc)
                            setShowUserSuggestions(false)
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
                    placeholder="Errand location" 
                    className="pl-10 border-border"
                    value={errandLocation}
                    onChange={(e) => setErrandLocation(e.target.value)}
                    onFocus={() => setShowErrandSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowErrandSuggestions(false), 200)}
                  />
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-destructive" />
                  {showErrandSuggestions && filteredErrandLocations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredErrandLocations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            setErrandLocation(loc)
                            setShowErrandSuggestions(false)
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

        {/* Errand Details */}
        <h2 className="text-lg font-semibold mb-3 text-foreground">Errand Details</h2>
        <Card className="mb-6">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="errand-type" className="block mb-2 text-foreground">
                Errand Type
              </Label>
              <Select defaultValue="pickup" onValueChange={setErrandType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select errand type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup & Delivery</SelectItem>
                  <SelectItem value="purchase">Purchase & Delivery</SelectItem>
                  <SelectItem value="queue">Queue on My Behalf</SelectItem>
                  <SelectItem value="other">Other Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="errand-description" className="block mb-2 text-foreground">
                Errand Description
              </Label>
              <Textarea
                id="errand-description"
                placeholder="Describe what you need help with..."
                className="border-border resize-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="urgency" className="block mb-2 text-foreground">
                Urgency
              </Label>
              <Select defaultValue="standard" onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Within 1 hour) - KES 200</SelectItem>
                  <SelectItem value="urgent">Urgent (Within 30 mins) - KES 350</SelectItem>
                  <SelectItem value="scheduled">Scheduled for Later</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {urgency === "scheduled" && (
              <div>
                <Label htmlFor="scheduled-time" className="block mb-2 text-foreground">
                  Scheduled Time
                </Label>
                <Input 
                  type="datetime-local" 
                  id="scheduled-time" 
                  className="border-border"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="additional-notes" className="block mb-2 text-foreground">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="additional-notes"
                placeholder="Any special instructions for the runner"
                className="border-border resize-none"
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
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

        {/* Errand Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-foreground">Errand Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span className="text-foreground">KES {serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee</span>
                <span className="text-foreground">KES {platformFee}</span>
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
              Estimated time: <strong>{estimatedTime}</strong>
            </span>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">KES {total}</p>
            <p className="text-xs text-muted-foreground">Total amount</p>
          </div>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleConfirmErrand}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {paymentMethod === "mpesa" ? "Sending M-Pesa Request..." : "Processing..."}
            </>
          ) : (
            <>
              {paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Confirm Errand"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}