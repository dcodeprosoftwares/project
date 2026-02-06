'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { updateProfile } from "@/actions/profile"
import { Pencil, X, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"

type ProfileUser = {
    id: string
    mobile: string
    name: string | null
    gender: string | null
    dob: Date | null
    bio: string | null
    location: string | null
    profilePic: string | null
    govtId: string | null
    isVerified: boolean
    role: string
}

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    gender: z.string().optional(),
    dob: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    profilePic: z.string().optional(),
    govtId: z.string().optional(),
})

export function ProfileForm({ user }: { user: ProfileUser }) {
    const [isEditing, setIsEditing] = useState(false)
    const [uploading, setUploading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name || "",
            gender: user.gender || "male",
            dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
            bio: user.bio || "",
            location: user.location || "",
            profilePic: user.profilePic || "",
            govtId: user.govtId || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await updateProfile(values)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Profile updated!")
            setIsEditing(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "profilePic" | "govtId") => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()
            if (data.success) {
                form.setValue(fieldName, data.url)
                toast.success("File uploaded")
            } else {
                toast.error("Upload failed")
            }
        } catch (err) {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    if (!isEditing) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={user.profilePic || ""} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-bold">{user.name || "User"}</h2>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{user.mobile}</span>
                            {user.isVerified && <Badge variant="default" className="bg-green-600">Verified</Badge>}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{user.location}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsEditing(true)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div>
                        <span className="font-semibold block">Gender</span>
                        <span>{user.gender || "Not set"}</span>
                    </div>
                    <div>
                        <span className="font-semibold block">Date of Birth</span>
                        <span>{user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}</span>
                    </div>
                </div>

                <div>
                    <span className="font-semibold block mb-1">Bio</span>
                    <p className="text-sm text-gray-600">{user.bio || "No bio yet."}</p>
                </div>

                {/* Stats placeholder - backend logic needed for real numbers */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">0</div>
                        <div className="text-xs text-gray-600">Events Hosted</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">$0</div>
                        <div className="text-xs text-gray-600">Earned</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">0</div>
                        <div className="text-xs text-gray-600">Attended</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">$0</div>
                        <div className="text-xs text-gray-600">Spent</div>
                    </div>
                </div>

                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <span>Government ID</span>
                        {user.govtId ? (
                            <span className="text-green-600 text-sm font-medium">Uploaded</span>
                        ) : (
                            <span className="text-red-500 text-sm font-medium">Missing</span>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Edit Profile</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={form.watch("profilePic") || ""} />
                                <AvatarFallback>IMG</AvatarFallback>
                            </Avatar>
                            <Label htmlFor="pic-upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full border shadow cursor-pointer">
                                <Upload className="w-4 h-4" />
                            </Label>
                            <Input id="pic-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, "profilePic")} accept="image/*" />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="New York, USA" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Tell us about yourself" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <FormLabel>Government ID Proof</FormLabel>
                        <div className="flex items-center space-x-4">
                            <Input type="file" onChange={(e) => handleFileUpload(e, "govtId")} accept="image/*" />
                            {form.watch("govtId") && <span className="text-green-600 text-xs">Uploaded</span>}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={uploading}>
                        {uploading ? "Uploading..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
