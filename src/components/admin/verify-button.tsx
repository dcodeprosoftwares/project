'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { verifyUser } from "@/actions/admin"
import { toast } from "sonner"
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react"

export default function AdminVerifyButton({ userId, isVerified }: { userId: string, isVerified: boolean }) {
    const [loading, setLoading] = useState(false)

    async function handleVerify() {
        setLoading(true)
        try {
            const res = await verifyUser(userId, !isVerified)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success(isVerified ? "User Unverified" : "User Verified")
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant={isVerified ? "destructive" : "default"}
            size="sm"
            onClick={handleVerify}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isVerified ? (
                <>
                    <ShieldAlert className="w-4 h-4 mr-1" /> Revoke
                </>
            ) : (
                <>
                    <ShieldCheck className="w-4 h-4 mr-1" /> Verify
                </>
            )}
        </Button>
    )
}
