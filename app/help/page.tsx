"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Search, ChevronRight, MessageSquare, Phone, FileText, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("")

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
      question: "How do I add a payment method?",
      answer:
        "Go to Settings > Payment Methods > Add Card. Enter your card details and save to add a new payment method.",
    },
    {
      question: "How do I report an issue with my ride?",
      answer:
        "You can report an issue by going to your ride history, selecting the ride, and tapping on 'Report Issue'. Provide details about the issue and submit your report.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Help Center</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for help"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Contact Options */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Contact Support</h2>
            <div className="space-y-3">
              <Link href="/help/chat" className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Chat with Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Link href="/help/call" className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Call Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Link href="/help/report" className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Submit a Report</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Frequently Asked Questions</h2>
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="bg-white rounded-lg border">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="px-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-medium text-gray-500">No results found</h3>
                <p className="text-sm text-gray-400 mt-1">Try a different search term or contact support</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Help Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/help/account">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 text-center">
                  <h3 className="font-medium">Account & Profile</h3>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/rides">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 text-center">
                  <h3 className="font-medium">Rides & Bookings</h3>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/payments">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 text-center">
                  <h3 className="font-medium">Payments & Billing</h3>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/safety">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 text-center">
                  <h3 className="font-medium">Safety & Security</h3>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
