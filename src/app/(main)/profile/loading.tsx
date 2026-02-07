import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <Skeleton className="h-10 w-48" />

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column Skeleton */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <div className="flex justify-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                        <div className="space-y-2 pt-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-10" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                </div>

                {/* Right Column Skeleton */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6 min-h-[500px]">
                        <Skeleton className="h-8 w-32 mb-6" />
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-40" />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-40" />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
