"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Privacy() {
  const [locationSharing, setLocationSharing] = useState(true)
  const [dataCollection, setDataCollection] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [activitySharing, setActivitySharing] = useState(true)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Privacy Settings</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <h2 className="font-semibold">Location Sharing</h2>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location-sharing" className="font-medium">
                    Share my location
                  </Label>
                  <p className="text-sm text-gray-500">Allow BaratonRide to access your location while using the app</p>
                </div>
                <Switch id="location-sharing" checked={locationSharing} onCheckedChange={setLocationSharing} />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h2 className="font-semibold">Data Collection</h2>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-collection" className="font-medium">
                    Usage data
                  </Label>
                  <p className="text-sm text-gray-500">Allow BaratonRide to collect data to improve your experience</p>
                </div>
                <Switch id="data-collection" checked={dataCollection} onCheckedChange={setDataCollection} />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h2 className="font-semibold">Communications</h2>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails" className="font-medium">
                    Marketing emails
                  </Label>
                  <p className="text-sm text-gray-500">Receive promotional emails and offers from BaratonRide</p>
                </div>
                <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h2 className="font-semibold">Activity Sharing</h2>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="activity-sharing" className="font-medium">
                    Share activity
                  </Label>
                  <p className="text-sm text-gray-500">Allow friends to see your ride activity</p>
                </div>
                <Switch id="activity-sharing" checked={activitySharing} onCheckedChange={setActivitySharing} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Data Management</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Download My Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600">
                Delete My Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            By using BaratonRide, you agree to our{" "}
            <Link href="/terms" className="text-green-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-green-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
