'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { Property } from '@/types'

const PropertyMap = dynamic(
    () => import('@/components/map/PropertyMap').then(m => m.PropertyMap),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[600px] rounded-xl flex items-center justify-center"
                style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full animate-spin"
                        style={{ border: '2px solid var(--bej)', borderTopColor: 'var(--green)' }} />
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                        Harita yükleniyor
                    </span>
                </div>
            </div>
        ),
    }
)

export function MapToggle({ isMapView }: { isMapView: boolean }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const toggle = () => {
        const params = new URLSearchParams(searchParams.toString())
        isMapView ? params.delete('view') : params.set('view', 'map')
        router.push(`/ilanlar?${params.toString()}`)
    }

    const btnStyle = (active: boolean) => ({
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px',
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
        transition: 'all 0.2s',
        background: active ? '#f0ebe0' : 'transparent',
        color: active ? '#2e3d2a' : 'rgba(240,235,224,0.4)',
        border: 'none', cursor: 'pointer',
    })

    return (
        <div className="flex items-center p-1 rounded-lg" style={{ border: '1px solid rgba(198,217,194,0.2)' }}>
            <button onClick={() => { if (isMapView) toggle() }} style={btnStyle(!isMapView)}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Liste
            </button>
            <button onClick={() => { if (!isMapView) toggle() }} style={btnStyle(isMapView)}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Harita
            </button>
        </div>
    )
}

export function MapView({ properties }: { properties: Property[] }) {
    return (
        <div className="space-y-3">
            <PropertyMap properties={properties} height="600px" />
            <p className="text-center" style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', color: 'var(--ink-muted)' }}>
                * Haritada yalnızca koordinat bilgisi girilmiş ilanlar görünür.
            </p>
        </div>
    )
}