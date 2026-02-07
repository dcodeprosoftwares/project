import { getHostedEvents } from "@/actions/booking"
import { HostEventsList } from "@/components/host/host-events-list"
import { Separator } from "@/components/ui/separator"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HostEventForm } from "@/components/host/host-event-form"

export default async function HostPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    const events = await getHostedEvents()

    return (
        <div className="max-w-2xl mx-auto space-y-10 pb-10">
            <div className="space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Host an Event</h1>
                    <p className="text-gray-500">Create a memorable experience for others.</p>
                </div>
                <HostEventForm />
            </div>

            <Separator />

            <HostEventsList events={events} />
        </div>
    )
}
