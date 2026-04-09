import { client } from '@/sanity/client'
import { propertiesQuery } from '@/sanity/queries'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { ScrollReveal } from '@/components/ScrollReveal'
import type { Property } from '@/types'

export const revalidate = 60

interface PageProps {
    searchParams: Promise<{ status?: string; type?: string; city?: string }>
}

export default async function IlanlarPage({ searchParams }: PageProps) {
    const params = await searchParams
    const allProperties: Property[] = await client.fetch(propertiesQuery)

    const filtered = allProperties.filter((p) => {
        if (params.status && p.status !== params.status) return false
        if (params.type && p.type !== params.type) return false
        if (params.city && !p.location?.city?.toLowerCase().includes(params.city.toLowerCase())) return false
        return true
    })

    return (
        <div className="min-h-screen" style={{ background: '#f7f4ef' }}>

            {/* Header */}
            <div className="relative overflow-hidden" style={{ background: '#1e2d1a', paddingTop: '7rem', paddingBottom: '4rem' }}>
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #c6d9c2 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                    }}
                />
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px" style={{ background: 'rgba(198,217,194,0.3)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.35)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            Tüm İlanlar
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(48px,7vw,96px)', fontWeight: 700, color: '#ede8dc', lineHeight: 0.92, letterSpacing: '-0.02em' }}>
                                İlanlar
                            </h1>
                            <p className="mt-3" style={{ color: 'rgba(198,217,194,0.35)', fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em' }}>
                                {filtered.length} ilan listeleniyor
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="w-full lg:w-60 xl:w-68 shrink-0">
                        <PropertyFilters />
                    </aside>
                    <div className="flex-1 min-w-0">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="text-4xl mb-4 opacity-20">🏠</div>
                                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '22px', fontWeight: 600, color: '#2c2b28', marginBottom: '8px' }}>
                                    Sonuç bulunamadı
                                </p>
                                <p style={{ color: '#a09d98', fontSize: '14px' }}>Filtrelerinizi değiştirmeyi deneyin.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filtered.map((property, i) => (
                                    <ScrollReveal key={property._id} type="up" delay={Math.min(i * 40, 280)}>
                                        <PropertyCard property={property} />
                                    </ScrollReveal>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}