'use server'

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function registerUser(formData: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(formData)

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { mobile, password } = validatedFields.data

    try {
        const existingUser = await prisma.user.findUnique({
            where: { mobile },
        })

        if (existingUser) {
            return { error: "User already exists with this mobile number" }
        }

        const hashedPassword = await hash(password, 10)

        await prisma.user.create({
            data: {
                mobile,
                password: hashedPassword,
            },
        })

        return { success: "User created successfully" }
    } catch (error) {
        console.error("Registration error:", error)
        return { error: "Something went wrong" }
    }
}
