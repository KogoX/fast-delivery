"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bell, CheckCircle } from "lucide-react"
import { createNotification } from "@/app/actions/notifications"

export default function AdminNotifications() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [targetUserId, setTargetUserId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccess(null)
    setError(null)

    const result = await createNotification({
      title,
      body,
      targetUserId: targetUserId.trim() ? targetUserId.trim() : null,
    })

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    setTitle("")
    setBody("")
    setTargetUserId("")
    setSuccess("Notification created successfully.")
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-white">
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Admin Notifications</h1>
      </header>

      <main className="flex-1 p-4">
        <Card className="shadow-sm border-green-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Send a notification</h2>
                <p className="text-sm text-muted-foreground">
                  Create a broadcast notification or target a specific user.
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Service update"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Write the notification message..."
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target user (optional)</Label>
                <Input
                  id="target"
                  placeholder="User UUID for targeted notification"
                  value={targetUserId}
                  onChange={(event) => setTargetUserId(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to send to all users.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Create Notification"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
