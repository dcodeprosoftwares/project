'use client'

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect } from "react"

type Conversation = {
    user: {
        id: string
        name: string | null
        profilePic: string | null
    }
    lastMessage: string
    timestamp: Date
}

// Helper component for client-side date rendering
function RelativeTime({ date }: { date: Date }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
}

export function ChatList({ conversations }: { conversations: Conversation[] }) {
    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p>No messages yet.</p>
                <p className="text-sm">Start chatting by exploring events!</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {conversations.map((conv) => (
                <Link
                    key={conv.user.id}
                    href={`/inbox/${conv.user.id}`}
                    className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition"
                >
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.user.profilePic || ""} />
                        <AvatarFallback>{conv.user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-gray-900 truncate">{conv.user.name || "User"}</h3>
                            <RelativeTime date={conv.timestamp} />
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
