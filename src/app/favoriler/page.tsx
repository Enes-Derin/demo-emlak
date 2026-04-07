'use client'

import { useEffect, useState } from 'react'
import { client } from '@/sanity/client'
import { PropertyCard } from '@/components/property/PropertyCard'
import Link from 'next/link'
import { groq } from 'next-sanity'
import type { Property } from '@/types'

export default function FavorilerPage() {
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const stored = localStorage.getItem('emlak_favorites')
            const ids: string[] = stored ? JSON.parse(stored) : []
            if (ids.length === 0) { setLoading(false); return }
            client.fetch(
                groq`*[_type == "property" && _id in $ids] {
          _id, title, slug, status, type, price, mainImage, location, details, featured, publishedAt
        }`,
                { ids }
            ).then((data) => { setProperties(data); setLoading(false) })
        } catch { setLoading(false) }
    }, [])

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

            {/* Header */}
            <div style={{ background: '#3a5432', paddingTop: '6.5rem', paddingBottom: '3.5rem' }} className="px-6 lg:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="w-7 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.4)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            Kaydedilenler
                        </span>
                    </div>
                    <h1 style={{
                        fontFamily: "'Playfair Display',Georgia,serif",
                        fontSize: 'clamp(36px,5vw,70px)',
                        fontWeight: 700,
                        color: '#f0ebe0',
                        lineHeight: 1.05,
                    }}>
                        Favori İlanlarım
                    </h1>
                    <p style={{ color: 'rgba(198,217,194,0.45)', fontSize: '13px', marginTop: '8px', fontFamily: "'DM Mono',monospace" }}>
                        {properties.length} ilan kaydedildi
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-72 rounded-lg shimmer" />
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-28">
                        <div className="text-5xl mb-5 opacity-30">♡</div>
                        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '22px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
                            Henüz favori ilan eklemediniz
                        </p>
                        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginBottom: '28px' }}>
                            Beğendiğiniz ilanları kaydedin, buradan kolayca ulaşın.
                        </p>
                        <Link href="/ilanlar"
                            className="inline-flex items-center gap-2.5 px-6 py-3 text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-200"
                            style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                            İlanlara Göz At
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
                    </div>
                )}
            </div>
        </div>
    )
}