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

    const specRows = [
        { label: 'Oda', icon: '🛏', fn: (p: Property) => p.details?.rooms || '—' },
        { label: 'Brüt m²', icon: '📐', fn: (p: Property) => p.details?.area ? `${p.details.area} m²` : '—' },
        { label: 'Net m²', icon: '📏', fn: (p: Property) => p.details?.netArea ? `${p.details.netArea} m²` : '—' },
        { label: 'Kat', icon: '🏢', fn: (p: Property) => p.details?.floor != null ? `${p.details.floor}. Kat` : '—' },
        { label: 'Bina Yaşı', icon: '📅', fn: (p: Property) => p.details?.buildingAge != null ? `${p.details.buildingAge} Yıl` : '—' },
        { label: 'Isıtma', icon: '🌡', fn: (p: Property) => p.details?.heating || '—' },
        { label: 'Otopark', icon: '🚗', fn: (p: Property) => p.details?.parking ? 'Var' : 'Yok' },
        { label: 'Eşyalı', icon: '🛋', fn: (p: Property) => p.details?.furnished ? 'Evet' : 'Hayır' },
        { label: 'Asansör', icon: '🛗', fn: (p: Property) => p.details?.elevator ? 'Var' : 'Yok' },
    ]

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

            {/* ── HERO HEADER ── */}
            <div className="relative overflow-hidden pt-24 pb-16 px-6 lg:px-16"
                style={{ background: 'linear-gradient(160deg, #1e2e1a 0%, #2d4227 50%, #3a5432 100%)' }}>
                {/* Decorative grain overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: '200px' }} />

                {/* Decorative circle */}
                <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full pointer-events-none opacity-10"
                    style={{ background: 'radial-gradient(circle, #c6d9c2 0%, transparent 70%)' }} />

                <div className="max-w-[1400px] mx-auto relative">
                    <Link href="/ilanlar"
                        className="inline-flex items-center gap-2 mb-10 transition-opacity duration-200 hover:opacity-60"
                        style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgba(198,217,194,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        Tüm İlanlar
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        <div>
                            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgba(198,217,194,0.35)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                ── Yan Yana Analiz
                            </p>
                            <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(38px,6vw,72px)', fontWeight: 700, color: '#f0ebe0', lineHeight: 1.0, letterSpacing: '-0.01em' }}>
                                {properties.length} İlan
                                <br />
                                <em style={{ fontStyle: 'italic', color: 'rgba(240,235,224,0.2)' }}>Karşılaştırılıyor</em>
                            </h1>
                        </div>

                        {properties.length >= 2 && (
                            <div className="flex gap-3 flex-wrap">
                                {properties.map((p, i) => (
                                    <div key={p._id} className="flex items-center gap-2 px-3 py-2 rounded-full"
                                        style={{ border: '1px solid rgba(198,217,194,0.15)', background: 'rgba(198,217,194,0.05)' }}>
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                                            style={{ background: 'var(--green)', color: '#f7f4ef', fontSize: '10px' }}>
                                            {i + 1}
                                        </span>
                                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgba(240,235,224,0.5)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">

                {properties.length < 2 ? (

                    /* ── EMPTY STATE ── */
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
                            style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
                            <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10m0-10a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
                            </svg>
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '28px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                            Karşılaştırma için ilan seçin
                        </h2>
                        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginBottom: '32px', maxWidth: '320px' }}>
                            İlan listesinden en az 2 ilan seçerek detaylı bir karşılaştırma yapabilirsiniz.
                        </p>
                        <Link href="/ilanlar"
                            className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:scale-[1.02]"
                            style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                            İlanlara Git
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                ) : (
                    <>
                        {/* ── PROPERTY CARDS GRID ── */}
                        <div className={`grid gap-5 mb-12 ${properties.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : properties.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                            {properties.map((p, idx) => {
                                const imgUrl = p.mainImage ? urlFor(p.mainImage).width(900).height(600).fit('crop').url() : null
                                return (
                                    <div key={p._id} className="group overflow-hidden rounded-2xl"
                                        style={{ border: '1px solid var(--bej)', background: 'var(--surface)', boxShadow: 'var(--shadow-md)' }}>

                                        {/* Image */}
                                        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: 'var(--bej-light)' }}>
                                            {imgUrl && (
                                                <Image src={imgUrl} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                                            )}
                                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,46,26,0.85) 0%, rgba(30,46,26,0.2) 50%, transparent 100%)' }} />

                                            {/* Index badge */}
                                            <div className="absolute top-4 left-4">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black"
                                                    style={{ background: 'var(--green)', color: '#f7f4ef', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                                                    {idx + 1}
                                                </div>
                                            </div>

                                            {/* Status pill */}
                                            <div className="absolute top-4 right-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                                    style={{ background: 'rgba(240,235,224,0.12)', color: '#f0ebe0', backdropFilter: 'blur(8px)', border: '1px solid rgba(240,235,224,0.15)', fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                                    {statusLabels[p.status]}
                                                </span>
                                            </div>

                                            {/* Price on image */}
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: '#f0ebe0', fontSize: 'clamp(18px,3vw,24px)', lineHeight: 1.1, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                                                    {formatPrice(p.price)}
                                                </p>
                                                {p.status === 'kiralik' && (
                                                    <p style={{ color: 'rgba(240,235,224,0.5)', fontSize: '11px', fontFamily: "'DM Mono',monospace" }}>/ aylık</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="mb-1">
                                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'var(--ink-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                                                    {typeLabels[p.type]}
                                                </span>
                                            </div>
                                            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '15px', lineHeight: 1.35, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {p.title}
                                            </h3>
                                            {p.location && (
                                                <p className="flex items-center gap-1.5 mb-5" style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                                                    <svg className="w-3 h-3 shrink-0" style={{ color: 'var(--terra)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {[p.location.district, p.location.city].filter(Boolean).join(', ')}
                                                </p>
                                            )}

                                            {/* Spec pills */}
                                            <div className="flex flex-wrap gap-1.5 mb-5">
                                                {p.details?.rooms && (
                                                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ background: 'var(--bej-light)', color: 'var(--ink-soft)', border: '1px solid var(--bej)' }}>
                                                        🛏 {p.details.rooms}
                                                    </span>
                                                )}
                                                {p.details?.area && (
                                                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ background: 'var(--bej-light)', color: 'var(--ink-soft)', border: '1px solid var(--bej)' }}>
                                                        📐 {p.details.area} m²
                                                    </span>
                                                )}
                                                {p.details?.floor != null && (
                                                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ background: 'var(--bej-light)', color: 'var(--ink-soft)', border: '1px solid var(--bej)' }}>
                                                        🏢 {p.details.floor}. Kat
                                                    </span>
                                                )}
                                            </div>

                                            <Link href={`/ilanlar/${p.slug.current}`}
                                                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
                                                style={{ background: 'var(--green)', color: '#f7f4ef' }}>
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

                        {/* ── SPECS COMPARISON TABLE ── */}
                        <div className="rounded-2xl overflow-hidden mb-12"
                            style={{ border: '1px solid var(--bej)', boxShadow: 'var(--shadow-md)' }}>

                            {/* Table header */}
                            <div style={{ background: '#2d4227', padding: '20px 24px' }}>
                                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgba(198,217,194,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                    Detaylı Özellik Karşılaştırması
                                </p>
                            </div>

                            {/* Desktop grid */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '500px' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--bej-light)', borderBottom: '1px solid var(--bej)' }}>
                                            <th className="text-left p-4 w-32" style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'var(--ink-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                                                Özellik
                                            </th>
                                            {properties.map((p, i) => (
                                                <th key={p._id} className="text-left p-4" style={{ borderLeft: '1px solid var(--bej)' }}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                                                            style={{ background: 'var(--green)', color: '#f7f4ef', fontSize: '10px' }}>
                                                            {i + 1}
                                                        </div>
                                                        <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 600, fontSize: '13px', color: 'var(--ink)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {p.title}
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Price row — highlighted */}
                                        <tr style={{ background: 'var(--green-pale)', borderBottom: '1px solid var(--green-light)' }}>
                                            <td className="p-4" style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'var(--green)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                                                💰 Fiyat
                                            </td>
                                            {properties.map((p) => (
                                                <td key={p._id} className="p-4" style={{ borderLeft: '1px solid var(--green-light)' }}>
                                                    <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: '15px', color: 'var(--green)' }}>
                                                        {formatPrice(p.price)}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>

                                        {specRows.map((row, ri) => (
                                            <tr key={row.label}
                                                style={{ borderBottom: '1px solid var(--bg-alt)', background: ri % 2 === 0 ? 'var(--surface)' : 'var(--bej-light)' }}>
                                                <td className="p-4" style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'var(--ink-muted)', letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                    {row.icon} {row.label}
                                                </td>
                                                {properties.map((p) => {
                                                    const val = row.fn(p)
                                                    const isPositive = val === 'Var' || val === 'Evet'
                                                    const isNegative = val === 'Yok' || val === 'Hayır'
                                                    return (
                                                        <td key={p._id} className="p-4" style={{ borderLeft: '1px solid var(--bej)' }}>
                                                            <span style={{
                                                                fontSize: '13px', fontWeight: 600,
                                                                color: isPositive ? 'var(--green)' : isNegative ? 'var(--ink-muted)' : 'var(--ink)'
                                                            }}>
                                                                {isPositive ? '✓ ' : isNegative ? '✗ ' : ''}{val}
                                                            </span>
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile: per-property spec cards */}
                            <div className="sm:hidden divide-y" style={{ borderColor: 'var(--bej)' }}>
                                {properties.map((p, idx) => (
                                    <div key={p._id} className="p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                                                style={{ background: 'var(--green)', color: '#f7f4ef', fontSize: '11px' }}>
                                                {idx + 1}
                                            </div>
                                            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                                                {p.title}
                                            </span>
                                        </div>
                                        <div className="mb-3 p-3 rounded-lg" style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)' }}>
                                            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'var(--green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>Fiyat</p>
                                            <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: '18px', color: 'var(--green)' }}>{formatPrice(p.price)}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {specRows.map(row => {
                                                const val = row.fn(p)
                                                const isPositive = val === 'Var' || val === 'Evet'
                                                const isNegative = val === 'Yok' || val === 'Hayır'
                                                return (
                                                    <div key={row.label} className="p-2.5 rounded-lg" style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
                                                        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', color: 'var(--ink-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '3px' }}>
                                                            {row.icon} {row.label}
                                                        </p>
                                                        <p style={{ fontSize: '12px', fontWeight: 700, color: isPositive ? 'var(--green)' : isNegative ? 'var(--ink-muted)' : 'var(--ink)' }}>
                                                            {isPositive ? '✓ ' : isNegative ? '✗ ' : ''}{val}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── AI ANALYSIS ── */}
                        <AIComparisonAnalysis properties={properties} />
                    </>
                )}
            </div>
        </div>
    )
}