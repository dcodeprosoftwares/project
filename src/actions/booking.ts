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

export async function getHostedEvents() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return []
    }

    const userId = session.user.id

    try {
        const events = await prisma.event.findMany({
            where: {
                hostId: userId
            },
            include: {
                bookings: {
                    include: {
                        guest: {
                            select: {
                                id: true,
                                name: true,
                                profilePic: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: {
                date: 'desc'
            }
        })

        return events
    } catch (error) {
        console.error("Get hosted events error", error)
        return []
    }
}

export async function getUserBookings() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return []
    }

    const userId = session.user.id

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                guestId: userId
            },
            include: {
                event: {
                    include: {
                        host: {
                            select: {
                                name: true,
                                profilePic: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                event: {
                    date: 'asc' // Upcoming first (we'll filter in component or here)
                }
            }
        })

        return bookings
    } catch (error) {
        console.error("Get user bookings error", error)
        return []
    }
}
