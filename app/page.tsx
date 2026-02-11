import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex flex-col items-center justify-center space-y-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-muted border flex items-center justify-center mb-6 shadow-sm">
            <span className="text-4xl font-bold text-foreground">BR</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">BaratonRide</h1>
          <p className="text-xl text-muted-foreground mt-2 font-medium">Fast. Safe. Affordable.</p>
        </div>

        <div className="w-full space-y-4 mt-12">
          <Link href="/onboarding" className="w-full">
            <Button variant="secondary" className="w-full py-6 text-lg">
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="flex items-center justify-center space-x-2 mt-4">
            <Link href="/login" className="text-foreground hover:text-foreground/80 font-medium">
              Already have an account? Login
            </Link>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-8 text-center">
          Baraton University's Official Campus Ride & Delivery App
        </p>
      </div>
    </div>
  )
}
