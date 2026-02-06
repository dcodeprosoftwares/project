import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 })
    }

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase Environment Variables')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = file.name.split('.').pop()
        const filename = `${uniqueSuffix}.${ext}`

        const { data: uploadData, error } = await supabase
            .storage
            .from('events') // Ensure this bucket exists in Supabase
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (error) {
            throw error
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from('events')
            .getPublicUrl(filename)

        return NextResponse.json({ success: true, url: publicUrl })

    } catch (e) {
        console.error("Error uploading file", e)
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 })
    }
}
