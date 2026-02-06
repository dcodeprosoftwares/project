'use server'

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const eventSchema = z.object({
    name: z.string().min(3, "Event name must be at least 3 characters"),
    details: z.string().min(10, "Details must be at least 10 characters"),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    price: z.coerce.number().min(0, "Price must be 0 or more"),
    location: z.string().min(3, "Location is required"),
    photos: z.array(z.string()).optional(), // Array of URLs
    autoApprove: z.boolean().default(true),
})

export async function createEvent(data: z.infer<typeof eventSchema>) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return { error: "Unauthorized" }
    }

    try {
        const event = await prisma.event.create({
            data: {
                hostId: session.user.id,
                name: data.name,
                details: data.details,
                capacity: data.capacity,
                price: data.price,
                location: data.location,
                photos: data.photos ? JSON.stringify(data.photos) : undefined,
                autoApprove: data.autoApprove,
            },
        })

        revalidatePath('/') // Updates Explore page
        revalidatePath('/host')
        return { success: true, event }
    } catch (error) {
        console.error("Create event error", error)
        return { error: "Failed to create event" }
    }
}
