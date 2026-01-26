"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Phone, MessageSquare, Star, Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { checkPaymentStatus } from "@/app/actions/mpesa"

interface RideData {
  id: string
  pickup_location: string
  destination: string
  fare: number
  payment_method: string
  ride_type: string
  status: string
  payment_status: string
}

export default function RideConfirmation() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Processing payment...")
  const [driverFound, setDriverFound] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [rideData, setRideData] = useState<RideData | null>(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchRideData = async () => {
      const rideId = sessionStorage.getItem("currentRideId")
      if (!rideId) {
        router.push("/book-ride")
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("id", rideId)
        .single()

      if (error || !data) {
        router.push("/book-ride")
        return
      }

      setRideData(data)

      // If cash payment or wallet, skip payment confirmation
      if (data.payment_method === "cash" || data.payment_method === "wallet") {
        setPaymentConfirmed(true)
        setStatus("Finding driver...")
      }
    }

    fetchRideData()
  }, [router])

  // Poll for M-Pesa payment status
  useEffect(() => {
    if (!rideData || rideData.payment_method !== "mpesa" || paymentConfirmed) return

    const checkPayment = async () => {
      const result = await checkPaymentStatus(rideData.id, "ride")
      
      if (result.status === "completed") {
        setPaymentConfirmed(true)
        setStatus("Payment confirmed! Finding driver...")
        
        // Update local ride data
        setRideData(prev => prev ? { ...prev, payment_status: "completed" } : null)
      } else if (result.status === "failed") {
        setStatus("Payment failed. Please try again.")
        setTimeout(() => {
          sessionStorage.removeItem("currentRideId")
          router.push("/book-ride")
        }, 3000)
      }
    }

    // Check every 3 seconds
    const interval = setInterval(checkPayment, 3000)
    
    // Also check immediately
    checkPayment()

    return () => clearInterval(interval)
  }, [rideData, paymentConfirmed, router])

  // Find driver after payment is confirmed
  useEffect(() => {
    if (!paymentConfirmed) return

    const timer = setTimeout(() => {
      setProgress(30)
      setStatus("Driver found! Arriving soon...")
      setDriverFound(true)
      
      // Update ride status in database
      const updateStatus = async () => {
        const rideId = sessionStorage.getItem("currentRideId")
        if (rideId) {
          const supabase = createClient()
          await supabase
            .from("rides")
            .update({ status: "accepted" })
            .eq("id", rideId)
        }
      }
      updateStatus()
    }, 3000)

    return () => clearTimeout(timer)
  }, [paymentConfirmed])

  useEffect(() => {
    if (driverFound && !isCancelled) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [driverFound, isCancelled])

  useEffect(() => {
    if (progress >= 60 && progress < 100) {
      setStatus("Driver is nearby")
    } else if (progress >= 100) {
      setStatus("Driver has arrived")
    } else if (isCancelled) {
      setStatus("Ride Cancelled")
    }
  }, [progress, isCancelled])

  const handleButtonClick = async () => {
    const rideId = sessionStorage.getItem("currentRideId")
    const supabase = createClient()

    if (progress >= 100) {
      // Complete the ride
      if (rideId) {
        await supabase
          .from("rides")
          .update({ status: "completed" })
          .eq("id", rideId)
      }
      sessionStorage.removeItem("currentRideId")
      router.push("/dashboard")
    } else {
      // Cancel the ride
      if (rideId) {
        await supabase
          .from("rides")
          .update({ status: "cancelled" })
          .eq("id", rideId)
      }
      setIsCancelled(true)
      setStatus("Ride Cancelled")
      setTimeout(() => {
        sessionStorage.removeItem("currentRideId")
        router.push("/dashboard")
      }, 2000)
    }
  }

  const eta = rideData?.ride_type === "car" ? 5 : 3

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background p-4 flex items-center border-b">
        <Link href="/book-ride">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Ride Status</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Payment Status Card (for M-Pesa) */}
        {rideData?.payment_method === "mpesa" && !paymentConfirmed && (
          <Card className="mb-6 border-[#00A550]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-6 w-6 text-[#00A550] animate-spin" />
                <div>
                  <h3 className="font-semibold text-foreground">Waiting for M-Pesa Payment</h3>
                  <p className="text-sm text-muted-foreground">Check your phone and enter your M-Pesa PIN</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-primary">{status}</h2>
              <Progress value={progress} className="h-2 mt-2" />
            </div>

            {driverFound ? (
              <div className="flex items-center space-x-4 mt-6">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>JK</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">James Kiprop</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-muted-foreground">4.9 (150+ trips)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Toyota Probox - KCA 123A</p>
                </div>
              </div>
            ) : paymentConfirmed ? (
              <div className="flex justify-center my-6">
                <div className="w-16 h-16 rounded-full border-4 border-t-primary border-muted animate-spin"></div>
              </div>
            ) : (
              <div className="flex justify-center my-6">
                <div className="w-16 h-16 rounded-full bg-[#00A550]/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-[#00A550] animate-spin" />
                </div>
              </div>
            )}

            {driverFound && (
              <div className="flex justify-center space-x-4 mt-6">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-transparent">
                  <Phone className="h-6 w-6 text-primary" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-transparent">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ride Details */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Ride Details</h3>

            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-0.5 h-12 bg-border my-1"></div>
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <p className="font-medium text-foreground">Pickup</p>
                  <p className="text-sm text-muted-foreground">{rideData?.pickup_location || "Loading..."}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Destination</p>
                  <p className="text-sm text-muted-foreground">{rideData?.destination || "Loading..."}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Fare</p>
                <p className="font-medium text-foreground">KES {rideData?.fare || 0}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <div className="flex items-center">
                  {rideData?.payment_method === "mpesa" ? (
                    <>
                      <span className="font-medium text-foreground">M-Pesa</span>
                      {paymentConfirmed && <CheckCircle className="h-4 w-4 text-[#00A550] ml-1" />}
                    </>
                  ) : (
                    <span className="font-medium text-foreground capitalize">{rideData?.payment_method || "wallet"}</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">ETA</p>
                <p className="font-medium text-foreground">{eta} mins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Features */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Safety Features</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Verified Driver</p>
                  <p className="text-sm text-muted-foreground">All drivers are verified Baraton community members</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">SOS Button</p>
                  <p className="text-sm text-muted-foreground">Emergency assistance is one tap away</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Action */}
      <div className="bg-background p-4 border-t">
        <Button
          className={`w-full ${progress >= 100 ? "bg-primary hover:bg-primary/90" : "bg-destructive hover:bg-destructive/90"}`}
          onClick={handleButtonClick}
          disabled={!paymentConfirmed && rideData?.payment_method === "mpesa"}
        >
          {progress >= 100 ? "End Ride" : "Cancel Ride"}
        </Button>
      </div>
    </div>
  )
}
