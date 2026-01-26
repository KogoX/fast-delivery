"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      
      // Redirect to login page after logout
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 1500)
    }

    handleLogout()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <LogOut className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Logging Out</h1>
          <p className="text-muted-foreground text-center mb-6">Thank you for using BowRide. See you soon!</p>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[progress_2s_ease-in-out]"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
