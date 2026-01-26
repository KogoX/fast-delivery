"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, Car, Clock, MapPin, AlertTriangle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function RidesHelp() {
  const faqs = [
    {
      question: "How do I book a ride?",
      answer:
        "To book a ride, go to the home screen and tap on 'Book a Ride'. Enter your pickup location and destination, select your preferred ride type, and confirm your booking.",
    },
    {
      question: "How do I cancel a ride?",
      answer:
        "You can cancel a ride by going to the ride confirmation screen and tapping on 'Cancel Ride'. Please note that cancellation fees may apply depending on how close you are to the pickup time.",
    },
    {
      question: "How do I contact my driver?",
      answer:
        "Once a driver has been assigned to your ride, you can contact them by tapping on the call or message icons on the ride confirmation screen.",
    },
    {
      question: "What if my driver doesn't arrive?",
      answer:
        "If your driver doesn't arrive within the estimated time, you can cancel the ride without any cancellation fee. You can also contact support for assistance.",
    },
    {
      question: "How do I report an issue with my ride?",
      answer:
        "You can report an issue by going to your ride history, selecting the ride, and tapping on 'Report Issue'. Provide details about the issue and submit your report.",
    },
  ]

  const helpTopics = [
    {
      icon: <Car className="h-5 w-5 text-green-600" />,
      title: "Booking Rides",
      link: "/help/rides/booking",
    },
    {
      icon: <Clock className="h-5 w-5 text-green-600" />,
      title: "Ride Scheduling",
      link: "/help/rides/scheduling",
    },
    {
      icon: <MapPin className="h-5 w-5 text-green-600" />,
      title: "Locations & Routes",
      link: "/help/rides/locations",
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-green-600" />,
      title: "Safety & Issues",
      link: "/help/rides/safety",
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
        <h1 className="text-xl font-semibold">Rides & Bookings Help</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Help Topics */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Help Topics</h2>
            <div className="space-y-2">
              {helpTopics.map((topic, index) => (
                <Link
                  key={index}
                  href={topic.link}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      {topic.icon}
                    </div>
                    <span>{topic.title}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="bg-white rounded-lg border">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-600 mb-4">Still need help with your rides?</p>
            <div className="flex space-x-3">
              <Link href="/help/chat" className="flex-1">
                <Button variant="outline" className="w-full">
                  Chat with Support
                </Button>
              </Link>
              <Link href="/help/report" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700">Submit a Report</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
