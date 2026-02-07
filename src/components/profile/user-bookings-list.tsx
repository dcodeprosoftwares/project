'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, isAfter, isBefore } from "date-fns"
import { Calendar, MapPin, Video } from "lucide-react"
import Link from "next/link"

type Host = {
    name: string | null
    profilePic: string | null
}

type Event = {
    id: string
    name: string
    date: Date
    location: string
    host: Host
}

type Booking = {
    id: string
    status: string
    event: Event
}

export function UserBookingsList({ bookings }: { bookings: Booking[] }) {
    const today = new Date()
    const upcoming = bookings.filter(b => isAfter(new Date(b.event.date), today))
    const past = bookings.filter(b => isBefore(new Date(b.event.date), today))

    if (bookings.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500">You haven't booked any events yet.</p>
                <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">Explore Events</Link>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {upcoming.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Upcoming Events
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {upcoming.map(booking => (
                            <EventCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-500">
                        <Calendar className="w-5 h-5" />
                        Past Events
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 opacity-80">
                        {past.map(booking => (
                            <EventCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function EventCard({ booking }: { booking: Booking }) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 p-4 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-semibold truncate" title={booking.event.name}>
                        {booking.event.name}
                    </CardTitle>
                    <Badge variant={booking.status === 'APPROVED' ? 'default' : 'secondary'} className="text-xs">
                        {booking.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex items-center text-gray-600 gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{format(new Date(booking.event.date), "PPP p")}</span>
                </div>
                <div className="flex items-center text-gray-600 gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{booking.event.location}</span>
                </div>
                <div className="pt-2 flex items-center gap-2 text-gray-500 border-t mt-2">
                    <span className="text-xs">Hosted by {booking.event.host.name || "Unknown"}</span>
                </div>
            </CardContent>
        </Card>
    )
}
