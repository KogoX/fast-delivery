"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Clock, Star, ShoppingCart, Plus, Minus, ChevronRight, Loader2, Smartphone, Wallet, Banknote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { initiateStkPush } from "@/app/actions/mpesa"

interface Restaurant {
  id: string
  name: string
  image_url: string | null
  rating: number
  delivery_time: string
  tags: string[]
}

interface MenuItem {
  id: string
  name: string
  price: number
  image_url: string | null
  description: string
  restaurant_id: string
}

interface CartItem extends MenuItem {
  quantity: number
}

const BARATON_DELIVERY_LOCATIONS = [
  "Baraton University Main Gate",
  "Baraton University Hostels - Male",
  "Baraton University Hostels - Female",
  "Baraton University Library",
  "Baraton University Cafeteria",
  "Baraton Shopping Center",
]

export default function FoodDelivery() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOrdering, setIsOrdering] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [deliveryLocation, setDeliveryLocation] = useState(BARATON_DELIVERY_LOCATIONS[0])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Fetch restaurants
      const { data: restaurantsData } = await supabase
        .from("restaurants")
        .select("*")
        .order("rating", { ascending: false })
      
      // Fetch menu items
      const { data: menuData } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
      
      if (restaurantsData) setRestaurants(restaurantsData)
      if (menuData) setMenuItems(menuData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [...prev, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === itemId)

      if (existingItem && existingItem.quantity > 1) {
        return prev.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
        )
      } else {
        return prev.filter((cartItem) => cartItem.id !== itemId)
      }
    })
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    if (paymentMethod === "mpesa" && !phoneNumber) {
      setError("Please enter your M-Pesa phone number")
      return
    }

    setIsOrdering(true)
    setError(null)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    const deliveryFee = 100
    const finalTotal = totalAmount + deliveryFee

    // Create food order
    const { data: order, error: orderError } = await supabase
      .from("food_orders")
      .insert({
        user_id: user.id,
        restaurant_id: cartItems[0].restaurant_id,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_amount: finalTotal,
        delivery_address: deliveryLocation,
        status: "pending",
        payment_method: paymentMethod,
        payment_status: paymentMethod === "cash" ? "pending" : "processing",
      })
      .select()
      .single()

    if (orderError) {
      setError(orderError.message)
      setIsOrdering(false)
      return
    }

    // If M-Pesa payment, initiate STK push
    if (paymentMethod === "mpesa") {
      const mpesaResult = await initiateStkPush({
        phoneNumber: phoneNumber,
        amount: finalTotal,
        orderId: order.id,
        orderType: "food_order",
        description: `Baraton Food Order - ${cartItems.length} items`,
      })

      if (!mpesaResult.success) {
        setError(mpesaResult.error || "Failed to initiate M-Pesa payment")
        await supabase
          .from("food_orders")
          .update({ payment_status: "failed" })
          .eq("id", order.id)
        setIsOrdering(false)
        return
      }
    }

    sessionStorage.setItem("currentFoodOrderId", order.id)
    router.push("/orders")
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-muted items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading menu...</p>
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
        <h1 className="text-xl font-semibold text-foreground">Food Delivery</h1>
        <div className="ml-auto relative">
          <Button variant="ghost" size="icon" onClick={() => totalItems > 0 && setShowCheckout(true)}>
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for food" 
            className="pl-10 py-6 border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="w-full flex justify-start overflow-x-auto py-1 space-x-2">
            <TabsTrigger value="all" className="rounded-full px-4">
              All
            </TabsTrigger>
            <TabsTrigger value="kenyan" className="rounded-full px-4">
              Kenyan
            </TabsTrigger>
            <TabsTrigger value="fastfood" className="rounded-full px-4">
              Fast Food
            </TabsTrigger>
            <TabsTrigger value="healthy" className="rounded-full px-4">
              Healthy
            </TabsTrigger>
            <TabsTrigger value="snacks" className="rounded-full px-4">
              Snacks
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Restaurants */}
        <h2 className="text-lg font-semibold mb-3 text-foreground">Popular at Baraton</h2>
        <div className="space-y-4 mb-6">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-20 h-20 bg-muted flex-shrink-0">
                    <img
                      src={restaurant.image_url || "/placeholder.svg?height=80&width=80"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-foreground">{restaurant.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-foreground">{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">{restaurant.delivery_time}</span>
                    </div>
                    <div className="flex mt-2 space-x-2">
                      {restaurant.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs bg-muted">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Menu Items */}
        <h2 className="text-lg font-semibold mb-3 text-foreground">Popular Meals</h2>
        <div className="space-y-4 mb-6">
          {filteredMenuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex">
                  <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                    <img
                      src={item.image_url || "/placeholder.svg?height=60&width=60"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <span className="font-medium text-foreground">KES {item.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>

                    <div className="flex justify-end mt-2">
                      {cartItems.find((cartItem) => cartItem.id === item.id) ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium text-foreground">
                            {cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0}
                          </span>
                          <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" onClick={() => addToCart(item)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary bg-transparent"
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && totalItems > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-background w-full rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Checkout</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
                Close
              </Button>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">KES {item.price} x {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">KES {item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Delivery Location */}
            <div className="mb-4">
              <Label className="text-sm font-medium text-foreground">Delivery Location</Label>
              <select
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full mt-2 p-3 border rounded-lg bg-background text-foreground"
              >
                {BARATON_DELIVERY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <Label className="text-sm font-medium text-foreground">Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center space-x-3 border rounded-lg p-3">
                  <RadioGroupItem value="mpesa" id="mpesa-checkout" />
                  <Label htmlFor="mpesa-checkout" className="flex items-center flex-1 cursor-pointer">
                    <Smartphone className="h-5 w-5 text-[#00A550] mr-3" />
                    <span className="font-medium text-foreground">M-Pesa</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-3">
                  <RadioGroupItem value="cash" id="cash-checkout" />
                  <Label htmlFor="cash-checkout" className="flex items-center flex-1 cursor-pointer">
                    <Banknote className="h-5 w-5 text-primary mr-3" />
                    <span className="font-medium text-foreground">Cash on Delivery</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* M-Pesa Phone Input */}
            {paymentMethod === "mpesa" && (
              <div className="mb-4">
                <Label className="text-sm font-medium text-foreground">M-Pesa Phone Number</Label>
                <div className="relative mt-2">
                  <Input
                    type="tel"
                    placeholder="254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                  <Smartphone className="absolute left-3 top-3 h-5 w-5 text-[#00A550]" />
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">KES {totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground">KES 100</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">KES {totalAmount + 100}</span>
              </div>
            </div>

            <Button 
              className="w-full mt-4 bg-primary hover:bg-primary/90"
              onClick={handleCheckout}
              disabled={isOrdering}
            >
              {isOrdering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {paymentMethod === "mpesa" ? "Sending M-Pesa Request..." : "Placing Order..."}
                </>
              ) : (
                <>
                  {paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Place Order"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Cart Summary (only show if items in cart and checkout not open) */}
      {totalItems > 0 && !showCheckout && (
        <div className="bg-background p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-foreground">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-muted-foreground">Delivery: KES 100</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">KES {totalAmount + 100}</p>
              <p className="text-xs text-muted-foreground">Total amount</p>
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
