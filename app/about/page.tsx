"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Github, Twitter, Instagram, Mail, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">About BowRide</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* App Info */}
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">BR</span>
            </div>
            <h2 className="text-2xl font-bold text-green-800">BowRide</h2>
            <p className="text-gray-500">Version 1.0.0</p>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                BowRide is Bowen University's official campus transportation and delivery app, designed to make getting
                around campus and receiving deliveries easier for students and staff.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Features</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Campus Rides</p>
                  <p className="text-sm text-gray-500">Quick and affordable rides around campus</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Food Delivery</p>
                  <p className="text-sm text-gray-500">Order food from campus cafeterias</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Package Delivery</p>
                  <p className="text-sm text-gray-500">Send packages to friends on campus</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">Errand Running</p>
                  <p className="text-sm text-gray-500">Get help with errands around campus</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Development Team</h2>
            <p className="text-sm text-gray-600 mb-4">
              BowRide was developed by the Bowen University Computer Science Department in collaboration with the
              Student Affairs Office.
            </p>

            <Link href="/team" className="block">
              <Button variant="outline" className="w-full">
                Meet the Team
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Connect With Us</h2>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="icon" className="h-12 w-full">
                <Twitter className="h-5 w-5 text-blue-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-full">
                <Instagram className="h-5 w-5 text-pink-500" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-full">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-full">
                <Mail className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal */}
        <div className="space-y-2">
          <Link href="/terms" className="block">
            <Button variant="ghost" className="w-full justify-start">
              Terms of Service
            </Button>
          </Link>
          <Link href="/privacy-policy" className="block">
            <Button variant="ghost" className="w-full justify-start">
              Privacy Policy
            </Button>
          </Link>
          <Link href="/licenses" className="block">
            <Button variant="ghost" className="w-full justify-start">
              Licenses
            </Button>
          </Link>
        </div>

        <Separator />

        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Bowen University</p>
          <p>All rights reserved</p>
        </div>
      </main>
    </div>
  )
}
