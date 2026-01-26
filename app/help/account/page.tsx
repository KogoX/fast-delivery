"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, User, Lock, CreditCard, Bell } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AccountHelp() {
  const faqs = [
    {
      question: "How do I update my profile information?",
      answer:
        "To update your profile information, go to Settings > Personal Information. From there, you can edit your name, email, phone number, and other details. Tap 'Save Changes' when you're done.",
    },
    {
      question: "How do I change my password?",
      answer:
        "To change your password, go to Settings > Security > Change Password. You'll need to enter your current password and then your new password twice to confirm.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "To delete your account, go to Settings > Privacy Settings > Data Management > Delete My Account. Please note that this action is permanent and will delete all your data from our systems.",
    },
    {
      question: "How do I link my student ID?",
      answer:
        "To link your student ID, go to Settings > Personal Information > Link Student ID. You'll need to enter your student ID number and verify it with your university email address.",
    },
    {
      question: "How do I manage notification settings?",
      answer:
        "To manage your notification settings, go to Settings > Preferences > Notifications. From there, you can toggle notifications for rides, deliveries, promotions, and more.",
    },
  ]

  const helpTopics = [
    {
      icon: <User className="h-5 w-5 text-green-600" />,
      title: "Profile Management",
      link: "/help/account/profile",
    },
    {
      icon: <Lock className="h-5 w-5 text-green-600" />,
      title: "Account Security",
      link: "/help/account/security",
    },
    {
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      title: "Payment Methods",
      link: "/help/account/payment",
    },
    {
      icon: <Bell className="h-5 w-5 text-green-600" />,
      title: "Notifications",
      link: "/help/account/notifications",
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
        <h1 className="text-xl font-semibold">Account & Profile Help</h1>
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
            <p className="text-gray-600 mb-4">Still need help with your account?</p>
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
