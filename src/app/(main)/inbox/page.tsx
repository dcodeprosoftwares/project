import { getConversations } from "@/actions/chat"
import { ChatList } from "@/components/chat/chat-list"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function InboxPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    const conversations = await getConversations()

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Inbox</h1>
            <ChatList conversations={conversations} />
        </div>
    )
}
