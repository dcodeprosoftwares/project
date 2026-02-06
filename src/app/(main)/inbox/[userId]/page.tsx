import { getMessages } from "@/actions/chat"
import { ChatWindow } from "@/components/chat/chat-window"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReviewDialog } from "@/components/reviews/review-dialog"
import { Button } from "@/components/ui/button"

export default async function ChatPage({ params }: { params: { userId: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    const otherUser = await prisma.user.findUnique({
        where: { id: params.userId },
        select: { id: true, name: true, profilePic: true }
    })

    if (!otherUser) {
        return <div>User not found</div>
    }

    const messages = await getMessages(params.userId)

    // Check for eligible review
    // 1. Find booking between them (either direction) with STATUS approved
    const bookingToReview = await prisma.booking.findFirst({
        where: {
            status: 'APPROVED',
            OR: [
                {
                    guestId: session.user.id,
                    event: { hostId: otherUser.id }
                },
                {
                    guestId: otherUser.id,
                    event: { hostId: session.user.id }
                }
            ],
            // Ensure currentUser hasn't reviewed this booking yet
            reviews: {
                none: {
                    reviewerId: session.user.id
                }
            }
        },
        select: { id: true }
    })

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {bookingToReview && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-blue-900">How was your experience?</h3>
                        <p className="text-sm text-blue-700">You recently interacted with {otherUser.name}. Leave a review!</p>
                    </div>
                    <ReviewDialog
                        bookingId={bookingToReview.id}
                        trigger={<Button variant="default">Leave Review</Button>}
                    />
                </div>
            )}
            <ChatWindow
                messages={messages}
                currentUser={{ id: session.user.id }}
                otherUser={otherUser}
            />
        </div>
    )
}
