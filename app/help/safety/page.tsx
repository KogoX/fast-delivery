"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, Shield, AlertTriangle, Phone, Users } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SafetyHelp() {
  const faqs = [
    {
      question: "What safety features does BaratonRide have?",
      answer:
        "BaratonRide includes several safety features such as driver verification, real-time ride tracking, emergency assistance button, and the ability to share your ride details with trusted contacts.",
    },
    {
      question: "How do I use the SOS button?",
      answer:
        "The SOS button is available during active rides. To use it, tap on the SOS button in the ride confirmation screen. This will alert our safety team and provide options to contact emergency services.",
    },
    {
      question: "How are drivers verified?",
      answer:
        "All drivers on BaratonRide are verified Bowen University community members. They undergo background checks, vehicle inspections, and must maintain good ratings to continue using the platform.",
    },
    {
      question: "How do I report a safety concern?",
      answer:
        "You can report a safety concern by going to Help > Submit a Report > Safety Issue. Provide details about your concern, and our safety team will investigate promptly.",
    },
    {
      question: "How do I share my ride details with others?",
      answer:
        "During an active ride, tap on the 'Share Ride' option in the ride confirmation screen. You can then share your ride details, including driver information and real-time location, via SMS or other messaging apps.",
    },
  ]

  const helpTopics = [
    {
      icon: <Shield className="h-5 w-5 text-green-600" />,
      title: "Safety Features",
      link: "/help/safety/features",
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-green-600" />,
      title: "Emergency Assistance",
      link: "/help/safety/emergency",
    },
    {
      icon: <Phone className="h-5 w-5 text-green-600" />,
      title: "Safety Contacts",
      link: "/help/safety/contacts",
    },
    {
      icon: <Users className="h-5 w-5 text-green-600" />,
      title: "Community Guidelines",
      link: "/help/safety/guidelines",
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
        <h1 className="text-xl font-semibold">Safety & Security Help</h1>
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

        {/* Emergency Contact */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold text-red-800 mb-2">Emergency Contact</h3>
            <p className="text-red-700 mb-4">For immediate assistance in emergencies:</p>
            <Button className="bg-red-600 hover:bg-red-700 mb-2 w-full">
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency Hotline
            </Button>
            <p className="text-sm text-red-600 mt-2">Campus Security: +234 801 234 5678 (24/7)</p>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-600 mb-4">Need more help with safety concerns?</p>
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
