"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Phone, MessageSquare, Star, Shield, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface ErrandData {
  id: string
  errand_type: string
  user_location: string
  errand_location: string
  description: string
  fee: number
  payment_method: string
  urgency: string
  status: string
}

export default function ErrandConfirmation() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Finding runner...")
  const [runnerFound, setRunnerFound] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [errandData, setErrandData] = useState<ErrandData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchErrandData = async () => {
      const errandId = sessionStorage.getItem("currentErrandId")
      if (!errandId) {
        router.push("/errand")
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from("errands")
        .select("*")
        .eq("id", errandId)
        .single()

      if (error || !data) {
        router.push("/errand")
        return
      }

      setErrandData(data)
    }

    fetchErrandData()
  }, [router])

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(30)
      setStatus("Runner found! Starting your errand soon...")
      setRunnerFound(true)
      
      // Update errand status in database
      const updateStatus = async () => {
        const errandId = sessionStorage.getItem("currentErrandId")
        if (errandId) {
          const supabase = createClient()
          await supabase
            .from("errands")
            .update({ status: "accepted" })
            .eq("id", errandId)
        }
      }
      updateStatus()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (runnerFound && !isCancelled) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 5
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [runnerFound, isCancelled])

  useEffect(() => {
    if (progress >= 40 && progress < 70) {
      setStatus("Runner is working on your errand")
    } else if (progress >= 70 && progress < 100) {
      setStatus("Runner is on the way back")
    } else if (progress >= 100) {
      setStatus("Errand completed")
    } else if (isCancelled) {
      setStatus("Errand Cancelled")
    }
  }, [progress, isCancelled])

  const handleButtonClick = async () => {
    const errandId = sessionStorage.getItem("currentErrandId")
    const supabase = createClient()

    if (progress >= 100) {
      // Complete the errand
      if (errandId) {
        await supabase
          .from("errands")
          .update({ status: "completed" })
          .eq("id", errandId)
      }
      sessionStorage.removeItem("currentErrandId")
      router.push("/dashboard")
    } else {
      // Cancel the errand
      if (errandId) {
        await supabase
          .from("errands")
          .update({ status: "cancelled" })
          .eq("id", errandId)
      }
      setIsCancelled(true)
      setStatus("Errand Cancelled")
      setTimeout(() => {
        sessionStorage.removeItem("currentErrandId")
        router.push("/dashboard")
      }, 2000)
    }
  }

  const eta = errandData?.urgency === "urgent" ? "30 mins" : "1 hour"

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background p-4 flex items-center border-b">
        <Link href="/errand">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Errand Status</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-primary">{status}</h2>
              <Progress value={progress} className="h-2 mt-2" />
            </div>

            {runnerFound ? (
              <div className="flex items-center space-x-4 mt-6">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Michael Runner</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-muted-foreground">4.9 (85+ errands)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Student - Computer Science</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center my-6">
                <div className="w-16 h-16 rounded-full border-4 border-t-primary border-muted animate-spin"></div>
              </div>
            )}

            {runnerFound && (
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

        {/* Errand Details */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Errand Details</h3>

            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-0.5 h-12 bg-border my-1"></div>
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <p className="font-medium text-foreground">Your Location</p>
                  <p className="text-sm text-muted-foreground">{errandData?.user_location || "Loading..."}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Errand Location</p>
                  <p className="text-sm text-muted-foreground">{errandData?.errand_location || "Loading..."}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium text-foreground">Errand Description</p>
              <p className="text-sm text-muted-foreground">
                {errandData?.description || "Loading..."}
              </p>
            </div>

            <div className="flex justify-between pt-2 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Fee</p>
                <p className="font-medium text-foreground">N{errandData?.fee || 0}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <p className="font-medium text-foreground capitalize">{errandData?.payment_method || "wallet"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">ETA</p>
                <p className="font-medium text-foreground">{eta}</p>
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
                  <p className="font-medium text-foreground">Verified Runner</p>
                  <p className="text-sm text-muted-foreground">All runners are verified Bowen community members</p>
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
        >
          {progress >= 100 ? "Complete Errand" : "Cancel Errand"}
        </Button>
      </div>
    </div>
  )
}
