import { BottomNav } from "@/components/bottom-nav"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <header className="hidden md:block bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl text-blue-600">EventHost</div>
                    <nav className="flex items-center space-x-6">
                        <a href="/" className="hover:text-blue-600">Explore</a>
                        <a href="/host" className="hover:text-blue-600">Host Now</a>
                        <a href="/inbox" className="hover:text-blue-600">Inbox</a>
                        <a href="/profile" className="hover:text-blue-600">Profile</a>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 md:py-8">
                {children}
            </main>

            <BottomNav />
        </div>
    )
}
