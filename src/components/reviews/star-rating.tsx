'use client'

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function StarRating({ rating, onRatingChange, readonly = false }: { rating: number, onRatingChange?: (r: number) => void, readonly?: boolean }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readonly && onRatingChange?.(star)}
                    disabled={readonly}
                    className={cn(
                        "focus:outline-none transition-colors",
                        readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                    )}
                >
                    <Star
                        className={cn(
                            "w-5 h-5",
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        )}
                    />
                </button>
            ))}
        </div>
    )
}
