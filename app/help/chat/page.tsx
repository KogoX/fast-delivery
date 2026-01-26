"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HelpChat() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "support",
      message: "Hello! How can I help you today?",
      time: "10:30 AM",
    },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message to chat
    const userMessage = {
      id: chatHistory.length + 1,
      sender: "user",
      message: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setChatHistory([...chatHistory, userMessage])
    setMessage("")

    // Simulate support response after a short delay
    setTimeout(() => {
      const supportMessage = {
        id: chatHistory.length + 2,
        sender: "support",
        message:
          "Thanks for your message. A support agent will respond shortly. Our typical response time is within 10 minutes.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setChatHistory((prev) => [...prev, supportMessage])
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link href="/help">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Chat with Support</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="space-y-4">
            {chatHistory.map((chat) => (
              <div key={chat.id} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start max-w-[80%]">
                  {chat.sender === "support" && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-green-600 text-white">BR</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      chat.sender === "user" ? "bg-green-600 text-white" : "bg-white border border-gray-200"
                    }`}
                  >
                    <p>{chat.message}</p>
                    <p className={`text-xs mt-1 ${chat.sender === "user" ? "text-green-100" : "text-gray-500"}`}>
                      {chat.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-3">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
