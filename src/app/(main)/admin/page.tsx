import { getUsers, verifyUser } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShieldCheck, ShieldAlert, Check, X } from "lucide-react"
import AdminVerifyButton from "@/components/admin/verify-button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const location = typeof searchParams.loc === 'string' ? searchParams.loc : undefined
    const gender = typeof searchParams.gender === 'string' ? searchParams.gender : undefined

    // Simple age calculation for display or filter parsing could be more robust
    const users = await getUsers({ location, gender })

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex gap-4">
                <form className="flex gap-4 w-full">
                    <Input name="loc" placeholder="Filter by Location" defaultValue={location} />
                    <Input name="gender" placeholder="Filter by Gender" defaultValue={gender} />
                    <Button type="submit">Filter</Button>
                    <Button variant="ghost" asChild>
                        <Link href="/admin">Clear</Link>
                    </Button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Govt ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.profilePic || ""} />
                                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.mobile}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.location || "-"}</TableCell>
                                <TableCell>{user.gender || "-"}</TableCell>
                                <TableCell>
                                    {user.govtId ? (
                                        <a href={user.govtId} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                                            View ID
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not Uploaded</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {user.isVerified ? (
                                        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">Verified</Badge>
                                    ) : (
                                        <Badge variant="secondary">Unverified</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <AdminVerifyButton userId={user.id} isVerified={user.isVerified} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
