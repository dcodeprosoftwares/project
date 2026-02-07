import { Skeleton } from "@/components/ui/skeleton"

export default function InboxLoading() {
    return (
        <div className="max-w-2xl mx-auto">
            <Skeleton className="h-8 w-24 mb-6" />
            <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
