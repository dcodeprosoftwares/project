import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                mobile: { label: "Mobile", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.mobile || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { mobile: credentials.mobile },
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    mobile: user.mobile,
                    name: user.name || "",
                    role: user.role,
                    isVerified: user.isVerified,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.mobile = user.mobile as string
                token.isVerified = user.isVerified
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.role = token.role
                session.user.mobile = token.mobile
                session.user.isVerified = token.isVerified
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
