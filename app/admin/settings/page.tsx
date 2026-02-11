"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  getPricingLocationsSettings,
  updatePricingLocationsSettings,
  type PricingLocationsSettings,
} from "@/app/actions/app-settings"

export default function AdminSettings() {
  const [settings, setSettings] = useState<PricingLocationsSettings | null>(null)
  const [locationsText, setLocationsText] = useState("")
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getPricingLocationsSettings()
      setSettings(data)
      setLocationsText(data.locations.join("\n"))
    }

    loadSettings()
  }, [])

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!settings) return

    setIsSaving(true)
    setSuccess(null)
    setError(null)

    const updatedSettings: PricingLocationsSettings = {
      ...settings,
      locations: locationsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }

    const result = await updatePricingLocationsSettings(updatedSettings)

    if (result.error) {
      setError(result.error)
      setIsSaving(false)
      return
    }

    setSuccess("Settings saved successfully.")
    setIsSaving(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-white">
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Admin Settings</h1>
      </header>

      <main className="flex-1 p-4">
        <Card className="shadow-sm border-green-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Pricing & Locations</h2>
                <p className="text-sm text-muted-foreground">
                  Update ride pricing and the list of selectable locations.
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 text-destructive px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-100 text-green-800 px-4 py-3 text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            {settings && (
              <form className="space-y-6" onSubmit={handleSave}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="carFare">Car fare</Label>
                    <Input
                      id="carFare"
                      type="number"
                      min="0"
                      value={settings.ridePricing.carFare}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          ridePricing: {
                            ...settings.ridePricing,
                            carFare: Number(event.target.value),
                          },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bikeFare">Bike fare</Label>
                    <Input
                      id="bikeFare"
                      type="number"
                      min="0"
                      value={settings.ridePricing.bikeFare}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          ridePricing: {
                            ...settings.ridePricing,
                            bikeFare: Number(event.target.value),
                          },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceFee">Service fee</Label>
                    <Input
                      id="serviceFee"
                      type="number"
                      min="0"
                      value={settings.ridePricing.serviceFee}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          ridePricing: {
                            ...settings.ridePricing,
                            serviceFee: Number(event.target.value),
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locations">Locations (one per line)</Label>
                  <Textarea
                    id="locations"
                    className="min-h-[180px]"
                    value={locationsText}
                    onChange={(event) => setLocationsText(event.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
