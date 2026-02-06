import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, DollarSign, MessageCircle } from "lucide-react"
import { EventWithHost } from "@/actions/get-events"
import { BookButton } from "./book-button"

export function EventCard({ event }: { event: EventWithHost }) {
    let coverPhoto = null
    try {
        if (event.photos) {
            const parsed = JSON.parse(event.photos)
            if (Array.isArray(parsed) && parsed.length > 0) {
                coverPhoto = parsed[0]
            } else if (typeof parsed === 'string') {
                coverPhoto = parsed
            }
        }
    } catch (e) {
        coverPhoto = event.photos
    }

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full bg-gray-200">
                {coverPhoto ? (
                    <Image
                        src={coverPhoto}
                        alt={event.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-xl font-bold">No Image</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
                        {event.autoApprove ? "Instant Book" : "Request"}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg leading-tight mb-1">{event.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-lg">${event.price}</span>
                        <span className="text-xs text-gray-400">/person</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.details}</p>

                <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={event.host.profilePic || ""} />
                        <AvatarFallback>{event.host.name?.charAt(0) || "H"}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">
                        Hosted by <span className="font-semibold text-gray-900">{event.host.name || "Unknown"}</span>
                    </span>
                    {event.host.isVerified && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 text-green-600 border-green-600">Verified</Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
                <BookButton eventId={event.id} price={event.price} autoApprove={event.autoApprove} />
                <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                    <Link href={`/inbox/${event.hostId}`}>
                        <MessageCircle className="w-4 h-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
