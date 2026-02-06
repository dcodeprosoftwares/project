'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBooking } from "@/actions/booking"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function BookButton({ eventId, price, autoApprove }: { eventId: string, price: number, autoApprove: boolean }) {
    const [loading, setLoading] = useState(false)

    async function handleBook() {
        setLoading(true)
        try {
            const res = await createBooking(eventId)
            if (res.error) {
                toast.error(res.error)
            } else {
                const statusMsg = res.booking?.status === 'APPROVED'
                    ? "Booking Confirmed!"
                    : "Request Sent! Waiting for approval."
                toast.success(statusMsg)
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 h-9 text-sm"
            onClick={handleBook}
            disabled={loading}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {autoApprove ? "Book Now" : "Request to Join"}
        </Button>
    )
}
