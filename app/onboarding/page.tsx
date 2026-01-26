"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, ShoppingBag, Clock, Shield } from "lucide-react"

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      icon: <Car className="h-16 w-16 text-green-600" />,
      title: "Quick Campus Rides",
      description: "Book affordable rides to get around campus quickly and safely.",
    },
    {
      icon: <ShoppingBag className="h-16 w-16 text-green-600" />,
      title: "Food & Package Delivery",
      description: "Get food delivered from campus cafeterias or send packages to friends.",
    },
    {
      icon: <Clock className="h-16 w-16 text-green-600" />,
      title: "Real-time Tracking",
      description: "Track your ride or delivery in real-time with accurate ETAs.",
    },
    {
      icon: <Shield className="h-16 w-16 text-green-600" />,
      title: "Safe & Secure",
      description: "All drivers are verified Bowen community members for your safety.",
    },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-6">
      <div className="w-full flex justify-end">
        <Link href="/login" className="text-green-600 font-medium">
          Skip
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md">
        <div className="mb-12 flex flex-col items-center text-center">
          {slides[currentSlide].icon}
          <h2 className="text-2xl font-bold mt-6 text-green-800">{slides[currentSlide].title}</h2>
          <p className="text-gray-600 mt-3">{slides[currentSlide].description}</p>
        </div>

        <div className="flex space-x-2 mb-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-green-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md">
        {currentSlide < slides.length - 1 ? (
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="border-green-600 text-green-600"
            >
              Back
            </Button>
            <Button onClick={nextSlide} className="bg-green-600 hover:bg-green-700">
              Next
            </Button>
          </div>
        ) : (
          <Link href="/login" className="w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700">Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
