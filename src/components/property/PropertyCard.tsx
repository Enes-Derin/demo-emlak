import Link from 'next/link'
import Image from 'next/image'
import type { Property } from '@/types'
import { urlFor } from '@/lib/sanity-image'
import { formatPrice, statusLabels, typeLabels } from '@/lib/utils'
import { FavoriteButton } from './FavoriteButton'
import { CompareButton } from './CompareButton'
import { QuickShareButton } from './QuickShareButton'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    satilik: { bg: '#4a6741', color: '#f7f4ef' },
    kiralik: { bg: '#b07050', color: '#f7f4ef' },
    satildi: { bg: '#8fa888', color: '#f7f4ef' },
    kiralandi: { bg: '#6b8f62', color: '#f7f4ef' },
}

interface PropertyCardProps {
    property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
    const { title, slug, status, type, price, mainImage, location, details } = property

    const imageUrl = mainImage
        ? urlFor(mainImage).width(800).height(600).fit('crop').url()
        : null

    const statusStyle = STATUS_STYLES[status] || { bg: 'var(--green)', color: '#f7f4ef' }

    return (
        <Link href={`/ilanlar/${slug.current}`} className="group block card-lift rounded-xl">
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-sm)' }}>

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'var(--bej-light)' }}>
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--bej)' }}>
                            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(to top, rgba(46,61,42,0.45), transparent 60%)' }} />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{ background: statusStyle.bg, color: statusStyle.color, letterSpacing: '0.04em' }}>
                            {statusLabels[status]}
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(8px)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>
                            {typeLabels[type]}
                        </span>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <CompareButton propertyId={property._id} />
                        <div className="flex items-center gap-2">
                            <QuickShareButton slug={slug.current} title={title} />
                            <FavoriteButton propertyId={property._id} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-bold leading-snug line-clamp-2 mb-2 transition-colors duration-200 group-hover:text-[#4a6741]"
                        style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '16px', color: 'var(--ink)' }}>
                        {title}
                    </h3>

                    {location && (
                        <p className="flex items-center gap-1.5 mb-3" style={{ color: 'var(--ink-soft)', fontSize: '13px' }}>
                            <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--terra)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-1">
                                {[location.neighborhood, location.district, location.city].filter(Boolean).join(', ')}
                            </span>
                        </p>
                    )}

                    {details && (
                        <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--bg-alt)' }}>
                            {details.rooms && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                                    style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>
                                    🛏 <span className="font-semibold">{details.rooms}</span>
                                </span>
                            )}
                            {details.area && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                                    style={{ background: 'var(--bej-light)', color: 'var(--ink-soft)', border: '1px solid var(--bej)' }}>
                                    📐 <span className="font-semibold">{details.area} m²</span>
                                </span>
                            )}
                            {details.floor != null && details.totalFloors && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                                    style={{ background: 'var(--bej-light)', color: 'var(--ink-soft)', border: '1px solid var(--bej)' }}>
                                    🏢 <span className="font-semibold">{details.floor}/{details.totalFloors}</span>
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div>
                            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
                                {formatPrice(price)}
                            </span>
                            {status === 'kiralik' && (
                                <span className="ml-1" style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: "'DM Mono',monospace" }}>/ ay</span>
                            )}
                        </div>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 hover:bg-[var(--green-light)]"
                            style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)' }}
                        >
                            <svg className="w-4 h-4" style={{ color: 'var(--green)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}