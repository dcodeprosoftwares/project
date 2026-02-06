'use server'

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function createBooking(eventId: string) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return { error: "Unauthorized" }
    }

    const userId = session.user.id

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) {
            return { error: "Event not found" }
        }

        if (event.hostId === userId) {
            return { error: "You cannot book your own event" }
        }

        // Check if already booked
        const existing = await prisma.booking.findFirst({
            where: {
                eventId,
                guestId: userId
            }
        })

        if (existing) {
            return { error: "You have already booked this event" }
        }

        // Determine status
        const status = event.autoApprove ? "APPROVED" : "PENDING"

        const booking = await prisma.booking.create({
            data: {
                eventId,
                guestId: userId,
                status
            }
        })

        revalidatePath('/')
        // revalidatePath('/bookings') // If we had a bookings page
        return { success: true, booking }
    } catch (error) {
        console.error("Create booking error", error)
        return { error: "Failed to book event" }
    }
}
