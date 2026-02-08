"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Car,
  ShoppingBag,
  Package,
  Clock,
  Bell,
  Menu,
  MapPin,
  Search,
  User,
  Home,
  Settings,
  LogOut,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  student_id: string | null
  avatar_url: string | null
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUserEmail(user.email || null)
        
        // Fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        if (profileData) {
          setProfile(profileData)
        } else {
          // Use metadata from auth if no profile exists
          setProfile({
            id: user.id,
            full_name: user.user_metadata?.full_name || null,
            phone: user.user_metadata?.phone || null,
            student_id: null,
            avatar_url: null
          })
        }
      }
    }

    fetchUserData()
  }, [])

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const displayName = profile?.full_name || userEmail?.split("@")[0] || "User"

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-muted">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between border-b border-emerald-500/30 text-white">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white hover:text-white/90 hover:bg-white/10"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-4 p-4 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=48&width=48"} />
                    <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-foreground">{displayName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile?.student_id ? `Student ID: ${profile.student_id}` : userEmail}
                    </p>
                  </div>
                </div>

                <nav className="flex-1 p-4">
                  <ul className="space-y-2">
                    <li>
                      <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted">
                        <Home className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted">
                        <User className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/history" className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Ride History</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted">
                        <Settings className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Settings</span>
                      </Link>
                    </li>
                  </ul>
                </nav>

                <div className="p-4 border-t">
                  <Link href="/logout">
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-2 bg-transparent">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-white">BaratonRide</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:text-white/90 hover:bg-white/10"
          >
            <Bell className="h-6 w-6 text-white" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-white text-green-700">
              3
            </Badge>
          </Button>
          <Avatar className="h-8 w-8 ring-2 ring-white/70">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=32&width=32"} />
            <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-green-600 to-emerald-500 text-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Welcome back</p>
              <h2 className="text-2xl font-semibold">{displayName}</h2>
              <p className="text-sm text-white/80 mt-1">Ready for your next ride or delivery?</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm">
              <MapPin className="h-4 w-4" />
              Bowen University
            </div>
          </CardContent>
        </Card>
        {/* Location Bar */}
        <div className="bg-background/90 backdrop-blur rounded-lg p-4 mb-4 flex items-center space-x-3 shadow-sm border border-green-100">
          <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Current Location</p>
            <p className="font-medium text-foreground">Bowen University, Main Campus</p>
          </div>
          <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/book-ride">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Book a Ride</h3>
                <p className="text-sm text-muted-foreground mt-1">Around campus</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/food-delivery">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Order Food</h3>
                <p className="text-sm text-muted-foreground mt-1">From cafeterias</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/package-delivery">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Send Package</h3>
                <p className="text-sm text-muted-foreground mt-1">Campus delivery</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/errand">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Run Errand</h3>
                <p className="text-sm text-muted-foreground mt-1">Request service</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Map Section */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="bg-muted h-48 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Campus Map View</p>
                <p className="text-sm text-muted-foreground">Shows nearby drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promotions */}
        <h2 className="text-lg font-semibold mb-3 text-foreground">Promotions</h2>
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 text-primary-foreground mb-6">
          <h3 className="font-bold text-lg">50% OFF Your First Ride!</h3>
          <p className="mt-1 mb-3">Use code: BOWFIRST</p>
          <Button variant="outline" className="bg-background text-primary hover:bg-background/90">
            Apply Code
          </Button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="bg-background border-t py-2">
        <Tabs defaultValue="home" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home" asChild>
              <Link href="/dashboard" className="flex flex-col items-center py-1">
                <Home className={`h-5 w-5 ${activeTab === "home" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs mt-1">Home</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="activity" asChild>
              <Link href="/history" className="flex flex-col items-center py-1">
                <Clock className={`h-5 w-5 ${activeTab === "activity" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs mt-1">Activity</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="wallet" asChild>
              <Link href="/orders" className="flex flex-col items-center py-1">
                <ShoppingBag className={`h-5 w-5 ${activeTab === "wallet" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs mt-1">Orders</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="profile" asChild>
              <Link href="/profile" className="flex flex-col items-center py-1">
                <User className={`h-5 w-5 ${activeTab === "profile" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs mt-1">Profile</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
