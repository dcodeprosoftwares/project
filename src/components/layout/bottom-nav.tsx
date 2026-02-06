'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusSquare, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { name: "Explore", href: "/", icon: Home },
        { name: "Host Now", href: "/host", icon: PlusSquare },
        { name: "Inbox", href: "/inbox", icon: MessageCircle },
        { name: "Profile", href: "/profile", icon: User },
    ]

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 lg:hidden">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group",
                                isActive ? "text-blue-600" : "text-gray-500"
                            )}
                        >
                            <Icon className={cn("w-6 h-6 mb-1", isActive ? "fill-current" : "")} />
                            <span className="text-xs">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
