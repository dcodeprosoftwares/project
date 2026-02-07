'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { sendMessage, getMessages } from "@/actions/chat"
import { Send, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Message = {
    id: string
    content: string
    senderId: string
    createdAt: Date
}

type User = {
    id: string
    name: string | null
    profilePic: string | null
}

// Helper for client-side time rendering
function MessageTime({ date }: { date: Date }) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    if (!mounted) return null

    return (
        <span className="text-[10px] block mt-1">
            {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
    )
}

export function ChatWindow({
    messages: initialMessages,
    currentUser,
    otherUser
}: {
    messages: Message[],
    currentUser: { id: string },
    otherUser: User
}) {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState("")
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        // Scroll to bottom on load and new message
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const newMessages = await getMessages(otherUser.id)
                if (newMessages) {
                    setMessages(prev => {
                        // Simple check to avoid re-renders if nothing changed
                        if (newMessages.length !== prev.length) {
                            return newMessages as Message[]
                        }
                        return prev
                    })
                }
            } catch (error) {
                console.error("Polling error", error)
            }
        }, 4000)

        return () => clearInterval(interval)
    }, [otherUser.id])

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || sending) return

        setSending(true)
        const content = input
        setInput("") // Optimistic clear

        // Optimistic update (optional, but good for UX)
        const optimisticMsg = {
            id: "temp-" + Date.now(),
            content: content,
            senderId: currentUser.id,
            createdAt: new Date()
        }
        setMessages(prev => [...prev, optimisticMsg])

        const res = await sendMessage({ receiverId: otherUser.id, content })

        if (res.error) {
            // Revert or show error
            console.error(res.error)
            // Remove optimistic message if needed
        } else {
            // In a real app with websockets we wouldn't need to do much, 
            // but with server actions revalidation happens on the server.
            // We might need to refresh to get the real ID, but for display it's fine.
            router.refresh()
        }
        setSending(false)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[600px] bg-gray-50 md:border md:rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-4 bg-white border-b shadow-sm">
                <Link href="/inbox" className="md:hidden mr-3">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={otherUser.profilePic || ""} />
                    <AvatarFallback>{otherUser.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{otherUser.name || "User"}</h3>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white border text-gray-800 rounded-bl-sm shadow-sm'
                                }`}>
                                <p>{msg.content}</p>
                                <div className={isMe ? 'text-blue-100' : 'text-gray-400'}>
                                    <MessageTime date={msg.createdAt} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={sending}
                    />
                    <Button type="submit" size="icon" disabled={sending || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
