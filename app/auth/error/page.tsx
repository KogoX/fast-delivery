import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function AuthError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Authentication Error</h1>
          <p className="text-muted-foreground text-center mb-6">
            There was a problem with your authentication. Please try again.
          </p>

          <Link href="/login" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
