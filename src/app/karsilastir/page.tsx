import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity-image'
import { formatPrice, statusLabels, typeLabels } from '@/lib/utils'
import type { Property } from '@/types'
import { AIComparisonAnalysis } from '@/components/property/AIComparisonAnalysis'

interface PageProps { searchParams: Promise<{ ids?: string }> }

export default async function KarsilastirPage({ searchParams }: PageProps) {
    const { ids } = await searchParams
    const idList = ids?.split(',').filter(Boolean) || []

    const properties: Property[] = idList.length > 0
        ? await client.fetch(
            groq`*[_type == "property" && _id in $ids] {
          _id, title, slug, status, type, price, mainImage, location, details
        }`,
            { ids: idList }
        )
        : []

    const rows = [
        { label: 'Fiyat', key: 'price', fn: (p: Property) => formatPrice(p.price) },
        { label: 'Durum', key: 'status', fn: (p: Property) => statusLabels[p.status] || p.status },
        { label: 'Tip', key: 'type', fn: (p: Property) => typeLabels[p.type] || p.type },
        { label: 'Konum', key: 'location', fn: (p: Property) => [p.location?.district, p.location?.city].filter(Boolean).join(', ') || '—' },
        { label: 'Oda', key: 'rooms', fn: (p: Property) => p.details?.rooms || '—' },
        { label: 'Brüt m²', key: 'area', fn: (p: Property) => p.details?.area ? `${p.details.area} m²` : '—' },
        { label: 'Net m²', key: 'netArea', fn: (p: Property) => p.details?.netArea ? `${p.details.netArea} m²` : '—' },
        { label: 'Kat', key: 'floor', fn: (p: Property) => p.details?.floor != null ? `${p.details.floor}. Kat` : '—' },
        { label: 'Bina Yaşı', key: 'age', fn: (p: Property) => p.details?.buildingAge != null ? `${p.details.buildingAge} Yıl` : '—' },
        { label: 'Isıtma', key: 'heating', fn: (p: Property) => p.details?.heating || '—' },
        { label: 'Otopark', key: 'parking', fn: (p: Property) => p.details?.parking ? '✓ Var' : '✗ Yok' },
        { label: 'Eşyalı', key: 'furnished', fn: (p: Property) => p.details?.furnished ? '✓ Evet' : '✗ Hayır' },
        { label: 'Asansör', key: 'elevator', fn: (p: Property) => p.details?.elevator ? '✓ Var' : '✗ Yok' },
    ]

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

            {/* Header */}
            <div style={{ background: '#3a5432' }} className="pt-24 pb-12 px-6 lg:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-7 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.4)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            İlan Karşılaştırma
                        </span>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(34px,5vw,64px)', fontWeight: 700, color: '#f0ebe0', lineHeight: 1.05 }}>
                            {properties.length} İlan<br />
                            <em style={{ fontStyle: 'italic', color: 'rgba(240,235,224,0.25)' }}>Karşılaştırılıyor</em>
                        </h1>
                        <Link href="/ilanlar"
                            className="shrink-0 text-xs font-bold tracking-widest uppercase px-5 py-3 transition-all duration-200"
                            style={{ border: '1px solid rgba(198,217,194,0.2)', color: 'rgba(240,235,224,0.5)' }}>
                            ← Geri
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
                {properties.length < 2 ? (
                    <div className="text-center py-24">
                        <div className="text-5xl mb-6 opacity-20">⊞</div>
                        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '26px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                            Karşılaştırma için ilan seçin
                        </h2>
                        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginBottom: '28px' }}>En az 2 ilan seçmeniz gerekiyor.</p>
                        <Link href="/ilanlar"
                            className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all"
                            style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                            İlanlara Git
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Mobile cards */}
                        <div className="block lg:hidden space-y-6 mb-10">
                            {properties.map((p, idx) => {
                                const imgUrl = p.mainImage ? urlFor(p.mainImage).width(800).height(500).fit('crop').url() : null
                                return (
                                    <div key={p._id} className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--bej)' }}>
                                        <div className="relative aspect-[16/9]" style={{ background: 'var(--bg-alt)' }}>
                                            {imgUrl && <Image src={imgUrl} alt={p.title} fill className="object-cover" sizes="100vw" />}
                                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(44,43,40,0.65), transparent 60%)' }} />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgba(240,235,224,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                                    {statusLabels[p.status]}
                                                </span>
                                                <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: '#f0ebe0', fontSize: '20px', lineHeight: 1.2, marginTop: '4px' }}>
                                                    {p.title}
                                                </h3>
                                                <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: '#f0ebe0', fontSize: '18px' }}>
                                                    {formatPrice(p.price)}
                                                </span>
                                            </div>
                                            <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center text-xs font-black"
                                                style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                                                {idx + 1}
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid var(--bej)' }}>
                                            {rows.slice(1).map((row) => (
                                                <div key={row.key} className="flex items-center justify-between px-4 py-3"
                                                    style={{ borderBottom: '1px solid var(--bg-alt)' }}>
                                                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{row.label}</span>
                                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{row.fn(p)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4">
                                            <Link href={`/ilanlar/${p.slug.current}`}
                                                className="flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-200"
                                                style={{ border: '1px solid var(--green)', color: 'var(--green)' }}>
                                                İlanı İncele
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden lg:block">
                            <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--bej)' }}>

                                {/* Header */}
                                <div className="grid" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)`, borderBottom: '1px solid var(--bej)' }}>
                                    <div className="p-6 flex items-end" style={{ background: '#3a5432' }}>
                                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgba(198,217,194,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Özellik</span>
                                    </div>
                                    {properties.map((p, idx) => {
                                        const imgUrl = p.mainImage ? urlFor(p.mainImage).width(600).height(400).fit('crop').url() : null
                                        return (
                                            <div key={p._id} style={{ borderLeft: '1px solid var(--bej)' }}>
                                                <div className="relative aspect-[4/3]" style={{ background: 'var(--bg-alt)' }}>
                                                    {imgUrl && <Image src={imgUrl} alt={p.title} fill className="object-cover" sizes="300px" />}
                                                    <div className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center text-xs font-black"
                                                        style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <Link href={`/ilanlar/${p.slug.current}`}
                                                        style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '14px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {p.title}
                                                    </Link>
                                                    <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '17px', display: 'block', marginTop: '6px' }}>
                                                        {formatPrice(p.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Data rows */}
                                {rows.slice(1).map((row) => (
                                    <div key={row.key} className="grid"
                                        style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)`, borderBottom: '1px solid var(--bg-alt)' }}>
                                        <div className="p-5 flex items-center" style={{ background: 'var(--bej-light)', borderRight: '1px solid var(--bej)' }}>
                                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{row.label}</span>
                                        </div>
                                        {properties.map((p) => (
                                            <div key={p._id} className="p-5 flex items-center" style={{ borderLeft: '1px solid var(--bej)' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{row.fn(p)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* CTA row */}
                                <div className="grid" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)`, background: 'var(--bej-light)', borderTop: '1px solid var(--bej)' }}>
                                    <div className="p-5" />
                                    {properties.map((p) => (
                                        <div key={p._id} className="p-4" style={{ borderLeft: '1px solid var(--bej)' }}>
                                            <Link href={`/ilanlar/${p.slug.current}`}
                                                className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase py-3 transition-all duration-200 group"
                                                style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                                                İncele
                                                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI */}
                        <div className="mt-10 lg:mt-14">
                            <AIComparisonAnalysis properties={properties} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}