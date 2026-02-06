'use server'

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export type UserFilter = {
    location?: string
    gender?: string
    minAge?: number
    maxAge?: number
}

export async function getUsers(filter?: UserFilter) {
    const session = await getServerSession(authOptions)

    // In a real app, check for ADMIN role
    // if (session?.user?.role !== 'ADMIN') return []

    const { location, gender, minAge, maxAge } = filter || {}

    let dobFilter = {}
    if (minAge !== undefined || maxAge !== undefined) {
        const now = new Date()
        const maxDate = minAge ? new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate()) : undefined
        const minDate = maxAge ? new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate()) : undefined

        dobFilter = {
            dob: {
                lte: maxDate, // born before this date (older)
                gte: minDate  // born after this date (younger)
            }
        }
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    location ? { location: { contains: location } } : {},
                    gender ? { gender: { equals: gender } } : {}, // Assuming gender is exact match or simple string
                    dobFilter
                ]
            },
            orderBy: { createdAt: 'desc' }
        })
        return users
    } catch (error) {
        console.error("Get users error", error)
        return []
    }
}

export async function verifyUser(userId: string, isVerified: boolean) {
    const session = await getServerSession(authOptions)
    // Check admin role here

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isVerified }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        return { error: "Failed to verify user" }
    }
}
