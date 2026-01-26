"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, CreditCard, Wallet, Receipt, DollarSign } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PaymentsHelp() {
  const faqs = [
    {
      question: "How do I add a payment method?",
      answer:
        "To add a payment method, go to Settings > Payment Methods > Add Card. Enter your card details and save to add a new payment method.",
    },
    {
      question: "How do I top up my BowWallet?",
      answer:
        "To top up your BowWallet, go to Settings > Payment Methods. Under the BowWallet section, tap on 'Top Up' and follow the instructions to add funds.",
    },
    {
      question: "Why was my payment declined?",
      answer:
        "Payments may be declined for various reasons, including insufficient funds, incorrect card details, or bank restrictions. Please check your card details and bank account, or try a different payment method.",
    },
    {
      question: "How do I get a receipt for my ride or delivery?",
      answer:
        "You can get a receipt by going to your ride or order history, selecting the specific ride or order, and tapping on 'Get Receipt'.",
    },
    {
      question: "How do I request a refund?",
      answer:
        "To request a refund, go to your ride or order history, select the specific ride or order, tap on 'Report Issue', and then select 'Request Refund'. Provide the necessary details and submit your request.",
    },
  ]

  const helpTopics = [
    {
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      title: "Payment Methods",
      link: "/help/payments/methods",
    },
    {
      icon: <Wallet className="h-5 w-5 text-green-600" />,
      title: "BowWallet",
      link: "/help/payments/wallet",
    },
    {
      icon: <Receipt className="h-5 w-5 text-green-600" />,
      title: "Receipts & Invoices",
      link: "/help/payments/receipts",
    },
    {
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      title: "Refunds & Disputes",
      link: "/help/payments/refunds",
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
        <h1 className="text-xl font-semibold">Payments & Billing Help</h1>
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
            <p className="text-gray-600 mb-4">Still need help with payments or billing?</p>
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
