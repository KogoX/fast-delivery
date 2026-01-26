"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Phone, Clock, Calendar, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function HelpCall() {
  const supportNumbers = [
    {
      title: "General Support",
      number: "+234 812 345 6789",
      hours: "Mon-Fri: 8:00 AM - 8:00 PM",
      description: "For general inquiries and assistance with the app",
    },
    {
      title: "Technical Support",
      number: "+234 809 876 5432",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      description: "For technical issues and app functionality problems",
    },
    {
      title: "Emergency Support",
      number: "+234 801 234 5678",
      hours: "24/7",
      description: "For urgent issues related to ongoing rides or deliveries",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/help">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Call Support</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-5 w-5 text-green-600" />
              <h2 className="font-semibold">Support Hours</h2>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
              <Calendar className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Our support team may have limited availability during university holidays and breaks.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {supportNumbers.map((support, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{support.title}</h3>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{support.hours}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{support.description}</p>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <div className="font-medium text-green-600">{support.number}</div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                Standard call rates may apply. For non-urgent issues, we recommend using the chat support or submitting
                a report.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
