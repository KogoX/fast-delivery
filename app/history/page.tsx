"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Calendar, Star, Filter, Loader2, Car } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

interface Ride {
  id: string
  pickup_location: string
  destination: string
  fare: number
  status: string
  ride_type: string
  created_at: string
}

export default function History() {
  const [activeTab, setActiveTab] = useState("all")
  const [rides, setRides] = useState<Ride[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchRides = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setRides(data)
      }
      setIsLoading(false)
    }

    fetchRides()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    }
  }

  const filteredRides = rides
    .filter((ride) => {
      if (activeTab === "all") return true
      if (activeTab === "completed") return ride.status === "completed"
      if (activeTab === "cancelled") return ride.status === "cancelled"
      return true
    })
    .filter((ride) => 
      ride.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchQuery.toLowerCase())
    )

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-muted items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading ride history...</p>
      </div>
    )
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
        <h1 className="text-xl font-semibold text-foreground">Ride History</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search rides" 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Ride History List */}
        <div className="space-y-4">
          {filteredRides.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground">No rides found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {rides.length === 0 
                  ? "Book your first ride to see it here" 
                  : "Try a different filter or search term"}
              </p>
              {rides.length === 0 && (
                <Link href="/book-ride">
                  <Button className="mt-4 bg-primary">Book a Ride</Button>
                </Link>
              )}
            </div>
          ) : (
            filteredRides.map((ride) => (
              <Link href={`/history/${ride.id}`} key={ride.id}>
                <Card className="hover:shadow-md transition-shadow mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm text-muted-foreground">{formatDate(ride.created_at)}</span>
                      <Badge
                        className={`${
                          ride.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : ride.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <div className="w-0.5 h-10 bg-border my-1"></div>
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      </div>

                      <div className="flex-1">
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="font-medium text-foreground">{ride.pickup_location}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">To</p>
                          <p className="font-medium text-foreground">{ride.destination}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>D</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">{ride.ride_type} Ride</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="text-xs text-muted-foreground">4.8</span>
                          </div>
                        </div>
                      </div>

                      <div className="font-semibold text-foreground">N{ride.fare}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
