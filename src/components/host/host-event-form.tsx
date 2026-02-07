'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { createEvent } from "@/actions/event"
import { Upload, X, MapPin, Users, DollarSign, CloudLightning } from "lucide-react"
import Image from "next/image"

const formSchema = z.object({
    name: z.string().min(3, "Event name must be at least 3 characters"),
    details: z.string().min(10, "Details must be at least 10 characters"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    price: z.number().min(0, "Price must be 0 or more"),
    location: z.string().min(3, "Location is required"),
    date: z.string().or(z.date()), // Accepts string from input or Date object
    photos: z.array(z.string()).optional(),
    autoApprove: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export function HostEventForm() {
    const [uploading, setUploading] = useState(false)
    const [previews, setPreviews] = useState<string[]>([])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            details: "",
            capacity: 10,
            price: 0,
            location: "",
            date: new Date(),
            autoApprove: true,
            photos: [],
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await createEvent(values)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Event created successfully!")
            form.reset()
            setPreviews([])
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        const newUrls: string[] = []

        try {
            // Upload sequentially or parallel
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData()
                formData.append("file", file)
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })
                const data = await res.json()
                if (data.success) return data.url
                return null
            })

            const results = await Promise.all(uploadPromises)
            results.forEach(url => {
                if (url) newUrls.push(url)
            })

            if (newUrls.length > 0) {
                const current = form.getValues("photos") || []
                const updated = [...current, ...newUrls]
                form.setValue("photos", updated)
                setPreviews(updated)
                toast.success(`${newUrls.length} photo(s) uploaded`)
            } else {
                toast.error("Upload failed")
            }

        } catch (err) {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
            // Reset input so same files can be selected again if needed (though unlikely)
            e.target.value = ""
        }
    }

    const removePhoto = (index: number) => {
        const current = form.getValues("photos") || []
        const updated = current.filter((_, i) => i !== index)
        form.setValue("photos", updated)
        setPreviews(updated)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Saturday Night Mixer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Details</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe what's happening..." className="h-24" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Users className="w-4 h-4" /> Capacity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
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
                                <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Venue or Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <FormLabel>Event Photos</FormLabel>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {previews.map((url, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden h-24 border bg-gray-100 group">
                                    <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removePhoto(index)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}

                            <div className="border-2 border-dashed rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition" onClick={() => document.getElementById("event-photos-upload")?.click()}>
                                <Upload className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">{uploading ? "..." : "Add Photos"}</span>
                                <Input
                                    id="event-photos-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    multiple
                                    disabled={uploading}
                                />
                            </div>
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="autoApprove"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base flex items-center gap-2">
                                        <CloudLightning className="w-4 h-4 text-yellow-500" />
                                        Auto Approve
                                    </FormLabel>
                                    <FormDescription>
                                        Automatically accept booking requests.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Host Event</Button>
                </form>
            </Form>
        </div>
    )
}
