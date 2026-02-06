import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HostEventForm } from "@/components/host/host-event-form"
import Link from "next/link"

export default async function HostPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    // Optional: Check if user is verified before allowing to host
    // if (!session.user.isVerified) {
    //   return (
    //      <div className="text-center p-8">
    //         <h1 className="text-2xl font-bold text-red-600 mb-2">Access Resticted</h1>
    //         <p className="text-gray-600 mb-4">You need to have a verified profile to host events.</p>
    //         <Link href="/profile" className="text-blue-600 underline">Go to Profile</Link>
    //      </div>
    //   )
    // }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Host an Event</h1>
                <p className="text-gray-500">Create a memorable experience for others.</p>
            </div>
            <HostEventForm />
        </div>
    )
}
