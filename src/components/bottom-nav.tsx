'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, PlusSquare, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()

    const links = [
        { href: "/", label: "Explore", icon: Compass },
        { href: "/host", label: "Host Now", icon: PlusSquare },
        { href: "/inbox", label: "Inbox", icon: MessageCircle },
        { href: "/profile", label: "Profile", icon: User },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden pb-safe">
            <div className="flex justify-around items-center h-16">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs",
                                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <Icon className="w-6 h-6" />
                            <span>{link.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
