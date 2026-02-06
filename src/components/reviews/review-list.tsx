import { StarRating } from "./star-rating"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

type ReviewWithReviewer = {
    id: string
    rating: number
    comment: string | null
    createdAt: Date
    reviewer: {
        name: string | null
        profilePic: string | null
    }
}

export function ReviewList({ reviews }: { reviews: ReviewWithReviewer[] }) {
    if (reviews.length === 0) {
        return (
            <div className="text-gray-500 text-sm py-4">No reviews yet.</div>
        )
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={review.reviewer.profilePic || ""} />
                                <AvatarFallback>{review.reviewer.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium">{review.reviewer.name || "Anonymous"}</div>
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    <div className="mb-2">
                        <StarRating rating={review.rating} readonly />
                    </div>

                    {review.comment && (
                        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    )}
                </div>
            ))}
        </div>
    )
}
