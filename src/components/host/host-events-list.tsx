'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Users, Calendar, MapPin } from "lucide-react"

type Guest = {
    id: string
    name: string | null
    profilePic: string | null
}

type Booking = {
    guest: Guest
    status: string
    createdAt: Date
}

type EventProps = {
    id: string
    name: string
    date: Date
    location: string
    bookings: Booking[]
}

export function HostEventsList({ events }: { events: EventProps[] }) {
    if (events.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500">You haven't hosted any events yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Hosted Events</h2>
            {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{event.name}</CardTitle>
                                <div className="flex items-center text-sm text-gray-500 gap-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(event.date), "PPP p")}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {event.location}
                                    </span>
                                </div>
                            </div>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.bookings.length} Guests
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {event.bookings.length > 0 ? (
                            <div className="divide-y">
                                {event.bookings.map((booking, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={booking.guest.profilePic || ""} />
                                                <AvatarFallback>{booking.guest.name?.charAt(0) || "G"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{booking.guest.name || "Guest"}</p>
                                                <p className="text-xs text-gray-500">Booked {format(new Date(booking.createdAt), "MMM d")}</p>
                                            </div>
                                        </div>
                                        <Badge variant={booking.status === 'APPROVED' ? 'default' : 'secondary'}>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-sm text-gray-500">
                                No bookings yet. Share your event link!
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
