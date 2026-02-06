'use server'

import { prisma } from "@/lib/prisma"

export type EventFilter = {
    query?: string
    location?: string
    maxPrice?: number
}

export type EventWithHost = Awaited<ReturnType<typeof getEvents>>[0]

export async function getEvents(filter?: EventFilter) {
    const { query, location, maxPrice } = filter || {}

    const events = await prisma.event.findMany({
        where: {
            AND: [
                query ? {
                    OR: [
                        { name: { contains: query } }, // SQLite contains is case-sensitive by default usually, but Prisma handles it well often? Actually sqlite default is case insensitive for ASCII
                        { details: { contains: query } }
                    ]
                } : {},
                location ? { location: { contains: location } } : {},
                maxPrice !== undefined ? { price: { lte: maxPrice } } : {}
            ]
        },
        include: {
            host: {
                select: {
                    name: true,
                    profilePic: true,
                    isVerified: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return events
}
