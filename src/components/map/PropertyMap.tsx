'use client'

import { useEffect, useRef } from 'react'
import type { Property } from '@/types'
import { formatPrice, statusLabels, typeLabels } from '@/lib/utils'

interface PropertyMapProps {
    properties: Property[]
    center?: [number, number]
    zoom?: number
    height?: string
}

export function PropertyMap({ properties, center, zoom = 11, height = '500px' }: PropertyMapProps) {
    const mapRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return

        import('leaflet').then((L) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            })

            // ✅ Düzeltme: location?.lat kontrolü ile filtrele
            const validProps = properties.filter(
                (p): p is Property & { location: { lat: number; lng: number } } =>
                    typeof p.location?.lat === 'number' &&
                    typeof p.location?.lng === 'number'
            )

            // ✅ Düzeltme: artık location kesin tanımlı
            const defaultCenter: [number, number] = center ??
                (validProps.length > 0
                    ? [validProps[0].location.lat, validProps[0].location.lng]
                    : [41.015, 28.979])

            const map = L.map(containerRef.current!).setView(defaultCenter, zoom)
            mapRef.current = map

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map)

            const statusColorMap: Record<string, string> = {
                satilik: '#3b82f6',
                kiralik: '#10b981',
                satildi: '#ef4444',
                kiralandi: '#f59e0b',
            }

            validProps.forEach((p) => {
                const color = statusColorMap[p.status] || '#6b7280'
                const loc = [
                    p.location.neighborhood,
                    p.location.district,
                    p.location.city,
                ].filter(Boolean).join(', ')

                const icon = L.divIcon({
                    className: '',
                    html: `
                        <div style="
                            background:${color};color:#fff;
                            padding:4px 10px;border-radius:20px;
                            font-size:11px;font-weight:700;
                            white-space:nowrap;
                            box-shadow:0 2px 8px rgba(0,0,0,0.25);
                            border:2px solid #fff;
                        ">
                            ${formatPrice(p.price)}
                        </div>
                    `,
                    iconAnchor: [30, 16],
                })

                const popup = `
                    <div style="min-width:200px;font-family:system-ui,sans-serif">
                        <div style="font-weight:700;font-size:13px;color:#111;margin-bottom:4px;line-height:1.3">
                            ${p.title}
                        </div>
                        <div style="display:flex;gap:6px;margin-bottom:6px">
                            <span style="background:${color};color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px">
                                ${statusLabels[p.status] ?? p.status}
                            </span>
                            <span style="background:#f3f4f6;color:#374151;font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px">
                                ${typeLabels[p.type] ?? p.type}
                            </span>
                        </div>
                        <div style="font-size:14px;font-weight:800;color:#111;margin-bottom:4px">
                            ${formatPrice(p.price)}
                        </div>
                        ${loc ? `<div style="font-size:11px;color:#6b7280">📍 ${loc}</div>` : ''}
                        ${p.details?.area ? `<div style="font-size:11px;color:#6b7280;margin-top:2px">📐 ${p.details.area} m² ${p.details.rooms ? '• ' + p.details.rooms : ''}</div>` : ''}
                        <a href="/ilanlar/${p.slug.current}"
                            style="display:block;margin-top:8px;background:#111;color:#fff;
                            text-align:center;padding:6px;border-radius:6px;
                            font-size:11px;font-weight:600;text-decoration:none">
                            İlanı Gör →
                        </a>
                    </div>
                `

                L.marker([p.location.lat, p.location.lng], { icon })
                    .addTo(map)
                    .bindPopup(popup, { maxWidth: 240 })
            })

            if (validProps.length > 1) {
                const bounds = L.latLngBounds(
                    validProps.map((p) => [p.location.lat, p.location.lng] as [number, number])
                )
                map.fitBounds(bounds, { padding: [40, 40] })
            }
        })

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div
                ref={containerRef}
                style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}
            />
        </>
    )
}