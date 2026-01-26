"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function HelpReport() {
  const [reportType, setReportType] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!reportType || !subject || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Simulate form submission
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Report Submitted",
        description: "We've received your report and will respond shortly.",
      })

      // Reset form
      setReportType("")
      setSubject("")
      setDescription("")
      setOrderNumber("")
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/help">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Submit a Report</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type" className="required">
                  Report Type
                </Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="ride">Ride Problem</SelectItem>
                    <SelectItem value="delivery">Delivery Problem</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="app">App Bug or Error</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-number">Order/Ride Number (if applicable)</Label>
                <Input
                  id="order-number"
                  placeholder="e.g. BRD12345"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="required">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="required">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please provide details about your issue"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (optional)</Label>
                <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-gray-400">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                  <Input id="attachments" type="file" className="hidden" />
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Our support team will review your report and respond within 24-48 hours.
                </p>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
