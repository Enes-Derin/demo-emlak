import { client } from '@/sanity/client'
import { propertiesQuery } from '@/sanity/queries'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { ScrollReveal } from '@/components/ScrollReveal'
import type { Property } from '@/types'

export const revalidate = 60

interface PageProps {
    searchParams: Promise<{ status?: string; type?: string; city?: string; view?: string }>
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

    const isMapView = params.view === 'map'

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

            {/* Header */}
            <div style={{ background: '#3a5432' }} className="pt-28 pb-12 px-6 lg:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 mb-5 animate-fade-in">
                        <span className="w-7 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.4)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            Tüm İlanlar
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-fade-in-up">
                        <div>
                            <h1 style={{
                                fontFamily: "'Playfair Display',Georgia,serif",
                                fontSize: 'clamp(44px,6vw,88px)',
                                fontWeight: 700,
                                color: '#f0ebe0',
                                lineHeight: 0.98,
                                letterSpacing: '-0.01em',
                            }}>
                                İlanlar
                            </h1>
                            <p className="mt-2" style={{ color: 'rgba(198,217,194,0.45)', fontFamily: "'DM Mono',monospace", fontSize: '12px' }}>
                                {filtered.length} ilan listeleniyor
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                    <aside className="w-full lg:w-64 xl:w-72 shrink-0">
                        <PropertyFilters />
                    </aside>

                    <div className="flex-1 min-w-0">

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filtered.map((property, i) => (
                                <ScrollReveal key={property._id} type="up" delay={Math.min(i * 50, 300)}>
                                    <PropertyCard property={property} />
                                </ScrollReveal>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}