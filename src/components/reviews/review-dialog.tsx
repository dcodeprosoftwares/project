'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { StarRating } from "./star-rating"
import { submitReview } from "@/actions/review"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ReviewDialog({ bookingId, trigger }: { bookingId: string, trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }

        setSubmitting(true)
        const res = await submitReview({ bookingId, rating, comment })
        setSubmitting(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Review submitted!")
            setOpen(false)
            setRating(0)
            setComment("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Leave a Review</DialogTitle>
                    <DialogDescription>
                        How was your experience? Your feedback helps others.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center">
                        <StarRating rating={rating} onRatingChange={setRating} />
                    </div>
                    <Textarea
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
