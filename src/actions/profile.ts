'use server'

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
    name: z.string().min(2).optional(),
    gender: z.string().optional(),
    dob: z.string().optional(), // Expected ISO string or date string
    bio: z.string().optional(),
    location: z.string().optional(),
    profilePic: z.string().optional(),
    govtId: z.string().optional(),
})

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return { error: "Unauthorized" }
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                gender: data.gender,
                dob: data.dob ? new Date(data.dob) : undefined,
                bio: data.bio,
                location: data.location,
                profilePic: data.profilePic,
                govtId: data.govtId,
            },
        })

        revalidatePath('/profile')
        return { success: true, user: updatedUser }
    } catch (error) {
        console.error("Profile update error", error)
        return { error: "Failed to update profile" }
    }
}
