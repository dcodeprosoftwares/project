'use server'

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const messageSchema = z.object({
    receiverId: z.string(),
    content: z.string().min(1, "Message cannot be empty"),
})

export async function sendMessage(data: z.infer<typeof messageSchema>) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return { error: "Unauthorized" }
    }

    // Prevent sending message to self
    if (session.user.id === data.receiverId) {
        return { error: "Cannot send message to yourself" }
    }

    try {
        const message = await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId: data.receiverId,
                content: data.content,
            },
        })

        revalidatePath(`/inbox/${data.receiverId}`)
        revalidatePath('/inbox')
        return { success: true, message }
    } catch (error) {
        console.error("Send message error", error)
        return { error: "Failed to send message" }
    }
}

export async function getConversations() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return []
    }

    const userId = session.user.id

    // Fetch all messages involving the user
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId },
                { receiverId: userId },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            sender: { select: { id: true, name: true, profilePic: true } },
            receiver: { select: { id: true, name: true, profilePic: true } },
        },
    })

    // Group by other user to get unique conversations
    const conversationsMap = new Map<string, any>()

    for (const msg of messages) {
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender
        if (!conversationsMap.has(otherUser.id)) {
            conversationsMap.set(otherUser.id, {
                user: otherUser,
                lastMessage: msg.content,
                timestamp: msg.createdAt,
            })
        }
    }

    return Array.from(conversationsMap.values())
}

export async function getMessages(otherUserId: string) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return []
    }

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: session.user.id, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: session.user.id },
            ],
        },
        orderBy: {
            createdAt: 'asc',
        },
    })

    return messages
}
