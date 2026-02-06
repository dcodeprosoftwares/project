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

    const { reviews, average, count } = await getUserReviews(user.id)

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>
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
    )
}
