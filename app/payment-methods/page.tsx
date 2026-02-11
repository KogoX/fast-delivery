"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, CreditCard, Wallet, Trash2, Edit } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PaymentMethods() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState<number | null>(null)

  // Sample payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "card",
      name: "Visa",
      number: "•••• •••• •••• 4321",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      name: "Mastercard",
      number: "•••• •••• •••• 8765",
      expiry: "09/26",
      isDefault: false,
    },
  ])

  const handleDeleteCard = (id: number) => {
    setCardToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteCard = () => {
    if (cardToDelete !== null) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== cardToDelete))
      setDeleteDialogOpen(false)
      setCardToDelete(null)
    }
  }

  const handleSetDefault = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate and process the card details
    // For this demo, we'll just close the dialog
    setAddCardDialogOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Payment Methods</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Wallet */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Wallet</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Wallet className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Wallet Balance</p>
                    <p className="text-2xl font-bold text-green-600">₦2,500</p>
                  </div>
                </div>
                <Button variant="outline">Top Up</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Cards */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Payment Cards</h2>
            <Button variant="outline" size="sm" onClick={() => setAddCardDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Card
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {paymentMethods.map((method, index) => (
                <div key={method.id}>
                  {index > 0 && <Separator />}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{method.name}</p>
                            {method.isDefault && (
                              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{method.number}</p>
                          <p className="text-xs text-gray-500">Expires: {method.expiry}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCard(method.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>

                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-green-600"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {paymentMethods.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-gray-500">No payment cards added yet</p>
                  <Button variant="outline" className="mt-2" onClick={() => setAddCardDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Card
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Payment History</h2>
          <Card>
            <CardContent className="p-4">
              <Link href="/payment-history" className="block">
                <Button variant="outline" className="w-full">
                  View Payment History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Card Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCard}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Card Dialog */}
      <Dialog open={addCardDialogOpen} onOpenChange={setAddCardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Card</DialogTitle>
            <DialogDescription>Enter your card details to add a new payment method.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCard}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" type="password" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Add Card</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
