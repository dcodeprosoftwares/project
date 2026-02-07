import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function HostLoading() {
    return (
        <div className="max-w-2xl mx-auto space-y-10 pb-10">
            <div className="space-y-6">
                <div className="mb-6 space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                {/* Form Skeleton */}
                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <Skeleton className="h-8 w-40" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div>
            </div>
        </div>
    )
}
