import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="flex flex-col items-center justify-center space-y-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-green-600 flex items-center justify-center mb-6 shadow-lg">
            <span className="text-4xl font-bold text-white">BR</span>
          </div>
          <h1 className="text-4xl font-bold text-green-800">BaratonRide</h1>
          <p className="text-xl text-green-700 mt-2 font-medium">Fast. Safe. Affordable.</p>
        </div>

        <div className="w-full space-y-4 mt-12">
          <Link href="/onboarding" className="w-full">
            <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700">
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="flex items-center justify-center space-x-2 mt-4">
            <Link href="/login" className="text-green-700 hover:text-green-800 font-medium">
              Already have an account? Login
            </Link>
          </div>
        </div>

        <p className="text-sm text-green-600 mt-8 text-center">
          Bowen University's Official Campus Ride & Delivery App
        </p>
      </div>
    </div>
  )
}
