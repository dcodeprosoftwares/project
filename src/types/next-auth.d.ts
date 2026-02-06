import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            mobile: string
            isVerified: boolean
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        isVerified: boolean
        mobile?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        isVerified: boolean
        mobile: string
    }
}
