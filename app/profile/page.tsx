"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Shield, Star, Car, CreditCard, Bell, Loader2, Package, ShoppingBag } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  student_id: string | null
  avatar_url: string | null
}

interface Stats {
  totalRides: number
  totalOrders: number
  totalPackages: number
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>({ totalRides: 0, totalOrders: 0, totalPackages: 0 })
  const [isLoading, setIsLoading] = useState(true)

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
          setProfile({
            id: user.id,
            full_name: user.user_metadata?.full_name || null,
            phone: user.user_metadata?.phone || null,
            student_id: null,
            avatar_url: null
          })
        }

        // Fetch stats
        const [ridesResult, ordersResult, packagesResult] = await Promise.all([
          supabase.from("rides").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("food_orders").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("package_deliveries").select("id", { count: "exact" }).eq("user_id", user.id)
        ])

        setStats({
          totalRides: ridesResult.count || 0,
          totalOrders: ordersResult.count || 0,
          totalPackages: packagesResult.count || 0
        })
      }
      setIsLoading(false)
    }

    fetchUserData()
  }, [])

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-muted items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  const displayName = profile?.full_name || userEmail?.split("@")[0] || "User"

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background p-4 flex items-center border-b">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">My Profile</h1>
        <div className="ml-auto">
          <Link href="/profile/edit">
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=96&width=96"} />
                <AvatarFallback className="text-2xl">{getInitials(profile?.full_name)}</AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-bold mt-4 text-foreground">{displayName}</h2>
              <p className="text-muted-foreground">Student</p>

              <div className="flex items-center mt-2">
                <Shield className="h-4 w-4 text-primary mr-1" />
                <span className="text-sm text-primary font-medium">Verified Account</span>
              </div>

              <Link href="/settings">
                <Button variant="outline" className="mt-4 bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Personal Information</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground">{profile?.full_name || "Not set"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium text-foreground">{userEmail || "Not set"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium text-foreground">{profile?.phone || "Not set"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium text-foreground">{profile?.student_id || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalRides}</p>
              <p className="text-xs text-muted-foreground">Rides</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalPackages}</p>
              <p className="text-xs text-muted-foreground">Packages</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>

            <div className="space-y-2">
              <Link
                href="/payment-methods"
                className="flex items-center justify-between p-3 hover:bg-muted rounded-md"
              >
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground">Payment Methods</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              </Link>

              <Link
                href="/settings"
                className="flex items-center justify-between p-3 hover:bg-muted rounded-md"
              >
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground">Notifications</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              </Link>

              <Link href="/history" className="flex items-center justify-between p-3 hover:bg-muted rounded-md">
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground">Ride History</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>BaratonRide v1.0.0</p>
          <p>2025 Bowen University</p>
        </div>
      </main>
    </div>
  )
}
