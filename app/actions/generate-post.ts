'use server'

import { generateBlogPost } from '@/lib/ai-service'

export async function generatePostAction(formData: FormData) {
    const topic = formData.get('topic') as string
    const tone = formData.get('tone') as string
    const category = formData.get('category') as string

    if (!topic) {
        return { success: false, error: 'Topic is required' }
    }

    try {
        const result = await generateBlogPost({
            topic,
            tone,
            category
        })

        // Return in format expected by PostEditor
        if (result.success) {
            return {
                success: true,
                title: result.title,
                content: result.content_md,
            }
        } else {
            return {
                success: false,
                error: result.error || 'Failed to generate post'
            }
        }
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to generate post' }
    }
}
