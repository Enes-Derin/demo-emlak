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
        <div className="min-h-screen" style={{ background: '#f7f4ef' }}>

            {/* Header */}
            <div className="relative overflow-hidden" style={{ background: '#1e2d1a', paddingTop: '7rem', paddingBottom: '4.5rem' }}>
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px" style={{ background: 'rgba(198,217,194,0.3)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.35)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            Kaydedilenler
                        </span>
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(40px,6vw,76px)', fontWeight: 700, color: '#ede8dc', lineHeight: 1.0, letterSpacing: '-0.015em' }}>
                        Favori İlanlarım
                    </h1>
                    <p style={{ color: 'rgba(198,217,194,0.3)', fontSize: '12px', marginTop: '10px', fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em' }}>
                        {properties.length} ilan kaydedildi
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-20">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-72 rounded-xl shimmer" />
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-5xl mb-6 opacity-20">♡</div>
                        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '24px', fontWeight: 600, color: '#2c2b28', marginBottom: '10px' }}>
                            Henüz favori ilan eklemediniz
                        </p>
                        <p style={{ color: '#a09d98', fontSize: '14px', marginBottom: '32px' }}>
                            Beğendiğiniz ilanları kaydedin, kolayca ulaşın.
                        </p>
                        <Link href="/ilanlar"
                            className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.1em] uppercase transition-all duration-200"
                            style={{ background: '#2c2b28', color: '#ede8dc' }}>
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