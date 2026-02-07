import { getUserBookings } from "@/actions/booking"
import { UserBookingsList } from "@/components/profile/user-bookings-list"
import { Separator } from "@/components/ui/separator"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile/profile-form"
import { getUserReviews } from "@/actions/review"
import { ReviewList } from "@/components/reviews/review-list"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })

    if (!user) {
        redirect("/login")
    }

    const [{ reviews, average, count }, bookings] = await Promise.all([
        getUserReviews(user.id),
        getUserBookings()
    ])

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <h1 className="text-3xl font-bold">My Profile</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Profile Info & Reviews */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <ProfileForm user={user} />
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Reviews</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{average}</span>
                                <div className="flex flex-col text-xs text-gray-500">
                                    <span>Average</span>
                                    <span>({count} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <ReviewList reviews={reviews} />
                    </div>
                </div>

                {/* Right Column: Bookings */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6 min-h-[500px]">
                        <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
                        <UserBookingsList bookings={bookings} />
                    </div>
                </div>
            </div>
        </div>
    )
}
