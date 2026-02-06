'use server'

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const reviewSchema = z.object({
    bookingId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
})

export async function submitReview(data: z.infer<typeof reviewSchema>) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return { error: "Unauthorized" }
    }

    const userId = session.user.id

    try {
        // 1. Fetch booking to verify relationship
        const booking = await prisma.booking.findUnique({
            where: { id: data.bookingId },
            include: { event: true }
        })

        if (!booking) {
            return { error: "Booking not found" }
        }

        // 2. Determine roles
        let revieweeId = ""
        if (booking.guestId === userId) {
            // Guest reviewing Host
            revieweeId = booking.event.hostId
        } else if (booking.event.hostId === userId) {
            // Host reviewing Guest
            revieweeId = booking.guestId
        } else {
            return { error: "You are not part of this booking" }
        }

        // 3. Create Review
        await prisma.review.create({
            data: {
                rating: data.rating,
                comment: data.comment,
                reviewerId: userId,
                revieweeId: revieweeId,
                bookingId: data.bookingId
            }
        })

        revalidatePath(`/profile/${revieweeId}`) // If we had public profile pages
        revalidatePath('/inbox')
        return { success: true }

    } catch (error) {
        console.error("Submit review error", error)
        return { error: "Failed to submit review" }
    }
}

export async function getUserReviews(userId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: { revieweeId: userId },
            include: { reviewer: { select: { name: true, profilePic: true } } },
            orderBy: { createdAt: 'desc' }
        })

        // Calculate average
        const total = reviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0)
        const average = reviews.length > 0 ? (total / reviews.length).toFixed(1) : "0"

        return { reviews, average, count: reviews.length }
    } catch (error) {
        return { reviews: [], average: "0", count: 0 }
    }
}
