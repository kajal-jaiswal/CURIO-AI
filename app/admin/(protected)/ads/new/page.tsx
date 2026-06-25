'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { createAd } from '@/app/actions/ads'

export default function NewAdPage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        position: 'sidebar' as 'sidebar' | 'header' | 'footer' | 'inline',
        is_active: true,
        start_date: '',
        end_date: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            await createAd({
                ...formData,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
            })

            toast.success('Advertisement created successfully')
            router.push('/admin/ads')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Failed to create advertisement')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/ads"
                    className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-dark-300 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold text-dark-50">Create Advertisement</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Image URL</label>
                        <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Target URL *</label>
                        <input
                            type="url"
                            value={formData.link_url}
                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="https://..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">Position *</label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value as typeof formData.position })}
                                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="sidebar">Sidebar</option>
                                <option value="header">Header</option>
                                <option value="footer">Footer</option>
                                <option value="inline">Inline</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">Status</label>
                            <select
                                value={formData.is_active ? 'active' : 'inactive'}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">End Date</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Creating...' : 'Create Ad'}
                    </button>
                    <Link
                        href="/admin/ads"
                        className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-300 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}
