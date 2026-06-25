import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Eye, MousePointerClick, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdsPage() {
    const adsRaw = await db.advertisement.findMany({
        orderBy: { created_at: 'desc' },
    })

    const ads = adsRaw.map(a => ({
        ...a,
        created_at: a.created_at.toISOString(),
        start_date: a.start_date?.toISOString() ?? null,
        end_date: a.end_date?.toISOString() ?? null,
    }))

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-50 mb-2">Advertisement Management</h1>
                    <p className="text-dark-400">Manage ad placements and track performance</p>
                </div>
                <Link
                    href="/admin/ads/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Ad
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">Active Ads</p>
                            <p className="text-2xl font-bold text-dark-50">
                                {ads.filter(a => a.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Eye className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">Total Impressions</p>
                            <p className="text-2xl font-bold text-dark-50">
                                {ads.reduce((sum, ad) => sum + (ad.impressions_count || 0), 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                            <MousePointerClick className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">Total Clicks</p>
                            <p className="text-2xl font-bold text-dark-50">
                                {ads.reduce((sum, ad) => sum + (ad.clicks_count || 0), 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-800 border-b border-dark-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Ad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Impressions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Clicks</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">CTR</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-800">
                            {ads.length > 0 ? ads.map((ad) => {
                                const ctr = ad.impressions_count > 0
                                    ? ((ad.clicks_count / ad.impressions_count) * 100).toFixed(2)
                                    : '0.00'

                                return (
                                    <tr key={ad.id} className="hover:bg-dark-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {ad.image_url && (
                                                    <img src={ad.image_url} alt={ad.title} className="w-12 h-12 object-cover rounded" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-dark-50">{ad.title}</p>
                                                    <p className="text-sm text-dark-400 truncate max-w-xs">{ad.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-dark-800 text-dark-300 rounded text-xs capitalize">
                                                {ad.position}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${ad.is_active
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {ad.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-dark-300">{ad.impressions_count.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-dark-300">{ad.clicks_count.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-dark-300">{ctr}%</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/ads/${ad.id}/edit`}
                                                className="text-primary-400 hover:text-primary-300 text-sm"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-dark-400">
                                        No advertisements yet. Create your first ad campaign!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
