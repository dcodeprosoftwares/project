import { getEvents } from "@/actions/get-events"
import { EventCard } from "@/components/explore/event-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ExplorePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const query = typeof searchParams.q === 'string' ? searchParams.q : undefined
    const location = typeof searchParams.loc === 'string' ? searchParams.loc : undefined
    const maxPrice = typeof searchParams.price === 'string' ? parseInt(searchParams.price) : undefined

    const events = await getEvents({ query, location, maxPrice })

    return (
        <div className="pb-20">
            {/* Search Header */}
            <div className="bg-white sticky top-16 md:top-0 z-40 p-4 border-b shadow-sm">
                <form className="flex gap-2 max-w-4xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            name="q"
                            placeholder="Search events, parties..."
                            className="pl-8 bg-gray-50 border-gray-200"
                            defaultValue={query}
                        />
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl sm:side-right sm:h-full sm:rounded-none">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input name="loc" placeholder="Anywhere" defaultValue={location} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Max Price</Label>
                                        <span className="text-sm font-medium text-gray-500">${maxPrice || 1000}</span>
                                    </div>
                                    {/* Note: Slider component usually requires client-side state to update visual value 
                                For Server Component MVP, we might use simple input or a Client Filter Component.
                                I'll use a simple number input for now to avoid complexity of client state in server component wrapper 
                            */}
                                    <Input type="number" name="price" placeholder="1000" defaultValue={maxPrice} />
                                </div>
                            </div>
                            <SheetFooter>
                                <Button type="submit" className="w-full">Apply Filters</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </form>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-4 py-6">
                {events.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No events found.</p>
                        <Link href="/" className="text-blue-600 underline text-sm">Clear filters</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
