"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Star, CreditCard, MessageSquare, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function RideDetails({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the ride details based on the ID
  // For now, we'll use mock data
  const ride = {
    id: params.id,
    date: "May 7, 2025",
    time: "2:30 PM",
    pickup: "Bowen University, Main Gate",
    destination: "Female Hostel",
    amount: "₦550",
    paymentMethod: "BowWallet",
    status: "completed",
    driver: {
      name: "John Driver",
      rating: 4.8,
      image: "/placeholder.svg?height=64&width=64",
      carModel: "Toyota Camry",
      licensePlate: "BU-123-XY",
    },
    rideDetails: {
      distance: "2.3 km",
      duration: "12 mins",
      rideType: "Car",
    },
    userRating: 5,
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/history">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Ride Details</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Status Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">{ride.date}</p>
                <p className="font-medium">{ride.time}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>

            <div className="flex items-start space-x-3 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{ride.pickup}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{ride.destination}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div>
                <p className="text-xs text-gray-500">Distance</p>
                <p className="font-medium">{ride.rideDetails.distance}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium">{ride.rideDetails.duration}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Ride Type</p>
                <p className="font-medium">{ride.rideDetails.rideType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Card */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Driver Information</h3>

            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16 border-2 border-green-100">
                <AvatarImage src={ride.driver.image || "/placeholder.svg"} />
                <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <h4 className="font-medium">{ride.driver.name}</h4>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm">{ride.driver.rating} Rating</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {ride.driver.carModel} • {ride.driver.licensePlate}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Payment Details</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Ride fare</span>
                <span>₦500</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Service fee</span>
                <span>₦50</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{ride.amount}</span>
              </div>

              <div className="flex items-center pt-2">
                <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Paid with {ride.paymentMethod}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rating */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Your Rating</h3>

            <div className="flex flex-col items-center">
              <div className="flex space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 ${star <= ride.userRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-500">You rated this ride {ride.userRating} stars</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            Get Receipt
          </Button>
          <Button variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
            Report Issue
          </Button>
        </div>
      </main>
    </div>
  )
}
