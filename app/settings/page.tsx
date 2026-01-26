"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  User,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Moon,
  Languages,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Settings() {
  const router = useRouter()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you would apply the dark mode to the entire app
    // For this demo, we'll just toggle the state
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
    // In a real app, you would handle notification permissions here
  }

  const handleLogout = () => {
    // In a real app, you would handle the logout logic here
    // For now, we'll just redirect to the login page
    setLogoutDialogOpen(false)
    router.push("/login")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Account Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Account</h2>
          <Card>
            <CardContent className="p-0">
              <Link href="/profile" className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Personal Information</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Separator />

              <Link href="/payment-methods" className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Payment Methods</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Preferences</h2>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Bell className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Notifications</span>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Moon className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Dark Mode</span>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>

              <Separator />

              <Link href="/language" className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Languages className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Language</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">English</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Security */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Security</h2>
          <Card>
            <CardContent className="p-0">
              <Link href="/change-password" className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Change Password</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Separator />

              <Link href="/privacy" className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Privacy Settings</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Support</h2>
          <Card>
            <CardContent className="p-0">
              <Link href="/help" className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <HelpCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Help Center</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Separator />

              <Link href="/about" className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Info className="h-4 w-4 text-green-600" />
                  </div>
                  <span>About BowRide</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <Button variant="destructive" className="w-full mt-6" onClick={() => setLogoutDialogOpen(true)}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>

        {/* Version Info */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>BowRide v1.0.0</p>
          <p>© 2025 Bowen University</p>
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Logout from BowRide?</DialogTitle>
            <DialogDescription>You will need to login again to use the app.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
