"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Filter, ShoppingBag, Package, Loader2, User, Home, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

interface FoodOrder {
  id: string
  restaurant_id: string
  items: { name: string; price: number; quantity: number }[]
  total_amount: number
  status: string
  created_at: string
  type: "food"
}

interface PackageDelivery {
  id: string
  package_name: string
  pickup_location: string
  delivery_location: string
  recipient_name: string
  total_amount: number
  status: string
  created_at: string
  type: "package"
}

type Order = (FoodOrder | PackageDelivery) & { type: "food" | "package" }

export default function Orders() {
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Fetch food orders
      const { data: foodOrders } = await supabase
        .from("food_orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      // Fetch package deliveries
      const { data: packageDeliveries } = await supabase
        .from("package_deliveries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      const allOrders: Order[] = [
        ...(foodOrders?.map(o => ({ ...o, type: "food" as const })) || []),
        ...(packageDeliveries?.map(o => ({ ...o, type: "package" as const })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setOrders(allOrders)
      setIsLoading(false)
    }

    fetchOrders()
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

  const filteredOrders = orders
    .filter((order) => {
      if (activeTab === "all") return true
      return order.type === activeTab
    })
    .filter((order) => {
      if (order.type === "food") {
        const foodOrder = order as FoodOrder
        return foodOrder.items.some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      } else {
        const packageOrder = order as PackageDelivery
        return packageOrder.package_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               packageOrder.recipient_name.toLowerCase().includes(searchQuery.toLowerCase())
      }
    })

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-muted items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading orders...</p>
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
        <h1 className="text-xl font-semibold text-foreground">My Orders</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders" 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="package">Packages</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {orders.length === 0 
                  ? "Place your first order to see it here" 
                  : "Try a different filter or search term"}
              </p>
              {orders.length === 0 && (
                <div className="flex gap-2 justify-center mt-4">
                  <Link href="/food-delivery">
                    <Button className="bg-primary">Order Food</Button>
                  </Link>
                  <Link href="/package-delivery">
                    <Button variant="outline">Send Package</Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm text-muted-foreground">{formatDate(order.created_at)}</span>
                    <Badge
                      className={`${
                        order.status === "completed" || order.status === "delivered"
                          ? "bg-green-100 text-green-800" 
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  {order.type === "food" ? (
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Food Order</p>
                        <p className="text-sm text-muted-foreground">
                          {(order as FoodOrder).items.map(i => i.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{(order as PackageDelivery).package_name}</p>
                        <p className="text-sm text-muted-foreground">
                          To: {(order as PackageDelivery).recipient_name}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 mt-3 border-t">
                    {order.status === "cancelled" ? (
                      <div className="text-sm text-destructive">Order was cancelled</div>
                    ) : (
                      <Button variant="outline" size="sm" className="text-primary border-primary bg-transparent">
                        Reorder
                      </Button>
                    )}
                    <div className="font-semibold text-foreground">
                      N{order.type === "food" ? (order as FoodOrder).total_amount : (order as PackageDelivery).total_amount}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="bg-background border-t py-2">
        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home" asChild>
              <Link href="/dashboard" className="flex flex-col items-center py-1">
                <Home className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs mt-1">Home</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="activity" asChild>
              <Link href="/history" className="flex flex-col items-center py-1">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs mt-1">Activity</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="wallet" asChild>
              <Link href="/orders" className="flex flex-col items-center py-1">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="text-xs mt-1">Orders</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="profile" asChild>
              <Link href="/profile" className="flex flex-col items-center py-1">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs mt-1">Profile</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
