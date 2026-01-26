"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "fr", name: "French", native: "Français" },
    { code: "es", name: "Spanish", native: "Español" },
    { code: "yo", name: "Yoruba", native: "Yorùbá" },
    { code: "ig", name: "Igbo", native: "Igbo" },
    { code: "ha", name: "Hausa", native: "Hausa" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Language</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
              {languages.map((language) => (
                <div key={language.code} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={language.code} id={language.code} />
                    <Label htmlFor={language.code} className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{language.name}</p>
                        <p className="text-sm text-gray-500">{language.native}</p>
                      </div>
                    </Label>
                  </div>
                  {selectedLanguage === language.code && <Check className="h-5 w-5 text-green-600" />}
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Language preferences will be applied to all BowRide services.</p>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700">Save Changes</Button>
      </main>
    </div>
  )
}
