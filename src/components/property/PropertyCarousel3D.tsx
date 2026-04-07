'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Property } from '@/types'
import { urlFor } from '@/lib/sanity-image'
import { formatPrice, statusLabels, typeLabels } from '@/lib/utils'

interface PropertyCarousel3DProps {
    properties: Property[]
}

const STATUS_COLORS: Record<string, string> = {
    satilik: '#4a6741',
    kiralik: '#b07050',
    satildi: '#8fa888',
    kiralandi: '#6b8f62',
}

export function PropertyCarousel3D({ properties }: PropertyCarousel3DProps) {
    const [active, setActive] = useState(0)
    const [dragging, setDragging] = useState(false)
    const [dragStart, setDragStart] = useState(0)
    const [autoplay, setAutoplay] = useState(true)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const count = properties.length

    const next = useCallback(() => setActive(a => (a + 1) % count), [count])
    const prev = useCallback(() => setActive(a => (a - 1 + count) % count), [count])

    useEffect(() => {
        if (!autoplay) return
        intervalRef.current = setInterval(next, 4500)
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [autoplay, next])

    const pause = () => { setAutoplay(false); if (intervalRef.current) clearInterval(intervalRef.current) }
    const resume = () => setAutoplay(true)

    const onDragStart = (x: number) => { pause(); setDragging(true); setDragStart(x) }
    const onDragEnd = (x: number) => {
        if (!dragging) return
        setDragging(false)
        const delta = dragStart - x
        if (Math.abs(delta) > 40) delta > 0 ? next() : prev()
        setTimeout(resume, 2000)
    }

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') { pause(); next(); setTimeout(resume, 2000) }
            if (e.key === 'ArrowLeft') { pause(); prev(); setTimeout(resume, 2000) }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [next, prev])

    const getCardStyle = (index: number) => {
        const total = count
        let offset = index - active
        if (offset > total / 2) offset -= total
        if (offset < -total / 2) offset += total
        const absOffset = Math.abs(offset)

        if (absOffset > 3) return {
            transform: `translateX(0px) translateZ(-1200px) scale(0.3)`,
            opacity: 0, zIndex: 0, pointerEvents: 'none' as const,
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }

        const orbitRadius = 520
        const angleStep = 38
        const angleDeg = offset * angleStep
        const angleRad = (angleDeg * Math.PI) / 180
        const xPos = Math.sin(angleRad) * orbitRadius
        const zPos = (Math.cos(angleRad) - 1) * orbitRadius * 0.55
        const yPos = (1 - Math.cos(angleRad)) * 80 * 0.4
        const rotateY = -angleDeg * 0.45
        const scale = 1 - absOffset * 0.1
        const opacity = Math.max(0, 1 - absOffset * 0.28)
        const blur = absOffset * 1.8

        return {
            transform: `translateX(${xPos}px) translateZ(${zPos}px) translateY(${yPos}px) scale(${scale}) rotateY(${rotateY}deg)`,
            opacity,
            zIndex: 100 - absOffset * 10,
            filter: blur > 0 ? `blur(${blur}px)` : 'none',
            transition: 'all 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }
    }

    if (!properties.length) return null

    return (
        <div className="relative w-full overflow-hidden select-none" style={{ height: '520px' }}>

            {/* Decorative orbit ring */}
            {[900, 700].map((w, i) => (
                <div key={w} className="absolute pointer-events-none" style={{
                    left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%) rotateX(75deg)',
                    width: `${w}px`, height: `${w * 0.33}px`,
                    border: `1px solid rgba(198,217,194,${i === 0 ? 0.1 : 0.06})`,
                    borderRadius: '50%', zIndex: 0,
                }} />
            ))}

            {/* 3D perspective container */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ perspective: '1400px', perspectiveOrigin: '50% 42%' }}
                onMouseLeave={resume}
                onMouseDown={e => onDragStart(e.clientX)}
                onMouseUp={e => onDragEnd(e.clientX)}
                onTouchStart={e => onDragStart(e.touches[0].clientX)}
                onTouchEnd={e => onDragEnd(e.changedTouches[0].clientX)}
            >
                <div className="relative w-72" style={{ height: '420px' }}>
                    {properties.map((property, index) => {
                        const style = getCardStyle(index)
                        const isActive = index === active
                        const imgUrl = property.mainImage
                            ? urlFor(property.mainImage).width(600).height(800).fit('crop').url()
                            : null
                        const statusColor = STATUS_COLORS[property.status] || 'var(--green)'

                        return (
                            <div key={property._id} className="absolute inset-0" style={style}
                                onMouseEnter={() => isActive && pause()}>
                                <div
                                    className="w-72 rounded-xl overflow-hidden cursor-pointer group"
                                    style={{
                                        height: '420px',
                                        boxShadow: isActive
                                            ? '0 48px 96px -24px rgba(46,61,42,0.7), 0 0 0 1px rgba(198,217,194,0.12), inset 0 1px 0 rgba(240,235,224,0.06)'
                                            : '0 20px 40px -10px rgba(46,61,42,0.5)',
                                        transition: 'box-shadow 0.6s ease',
                                    }}
                                    onClick={() => {
                                        if (!isActive) { pause(); setActive(index); setTimeout(resume, 3000) }
                                    }}
                                >
                                    <div className="relative w-full h-full" style={{ background: '#2e3d2a' }}>
                                        {imgUrl ? (
                                            <Image src={imgUrl} alt={property.title} fill
                                                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                                sizes="288px" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"
                                                style={{ background: 'linear-gradient(135deg, #2e3d2a 0%, #1e2d1a 100%)' }}>
                                                <svg className="w-16 h-16" style={{ color: 'rgba(198,217,194,0.25)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0"
                                            style={{ background: 'linear-gradient(to top, rgba(20,30,18,0.95) 0%, rgba(20,30,18,0.25) 45%, transparent 75%)' }} />

                                        {/* Active top line */}
                                        {isActive && (
                                            <div className="absolute top-0 left-0 right-0 h-px"
                                                style={{ background: 'linear-gradient(90deg, transparent, rgba(198,217,194,0.5), transparent)' }} />
                                        )}

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                            <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full"
                                                style={{ background: statusColor, letterSpacing: '0.04em' }}>
                                                {statusLabels[property.status]}
                                            </span>
                                            <span className="text-xs font-medium px-3 py-1.5 rounded-full"
                                                style={{ background: 'rgba(46,61,42,0.65)', backdropFilter: 'blur(12px)', color: 'rgba(198,217,194,0.85)', border: '1px solid rgba(198,217,194,0.15)', letterSpacing: '0.04em' }}>
                                                {typeLabels[property.type]}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <h3 className="font-bold text-white leading-tight line-clamp-2 mb-1"
                                                style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '20px', fontWeight: 700 }}>
                                                {property.title}
                                            </h3>
                                            {property.location && (
                                                <p className="text-xs mb-3 line-clamp-1"
                                                    style={{ color: 'rgba(198,217,194,0.55)' }}>
                                                    {[property.location.neighborhood, property.location.district, property.location.city].filter(Boolean).join(', ')}
                                                </p>
                                            )}
                                            {property.details && (
                                                <div className="flex items-center gap-2 mb-3">
                                                    {property.details.rooms && (
                                                        <span className="text-xs px-2 py-1 rounded-lg"
                                                            style={{ background: 'rgba(74,103,65,0.25)', color: 'rgba(198,217,194,0.75)', border: '1px solid rgba(198,217,194,0.12)' }}>
                                                            {property.details.rooms}
                                                        </span>
                                                    )}
                                                    {property.details.area && (
                                                        <span className="text-xs px-2 py-1 rounded-lg"
                                                            style={{ background: 'rgba(74,103,65,0.25)', color: 'rgba(198,217,194,0.75)', border: '1px solid rgba(198,217,194,0.12)' }}>
                                                            {property.details.area} m²
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="font-black text-white"
                                                    style={{
                                                        fontFamily: "'Playfair Display',Georgia,serif",
                                                        fontSize: '22px',
                                                        background: 'linear-gradient(135deg, #f0ebe0, #c6d9c2)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        backgroundClip: 'text',
                                                    }}>
                                                    {formatPrice(property.price)}
                                                </span>
                                                {isActive && (
                                                    <Link
                                                        href={`/ilanlar/${property.slug.current}`}
                                                        className="text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:opacity-90"
                                                        style={{ background: 'var(--green)', color: '#f7f4ef', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(74,103,65,0.35)' }}
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        İncele →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Arrow buttons */}
            {[
                { dir: 'prev', action: () => { pause(); prev(); setTimeout(resume, 2500) }, pos: 'left-4 lg:left-8', icon: 'M15 19l-7-7 7-7' },
                { dir: 'next', action: () => { pause(); next(); setTimeout(resume, 2500) }, pos: 'right-4 lg:right-8', icon: 'M9 5l7 7-7 7' },
            ].map(btn => (
                <button key={btn.dir} onClick={btn.action}
                    className={`hidden sm:flex absolute ${btn.pos} top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full items-center justify-center transition-all duration-200 hover:scale-105`}
                    style={{ background: 'rgba(46,61,42,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(198,217,194,0.15)', color: 'rgba(198,217,194,0.8)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.icon} />
                    </svg>
                </button>
            ))}

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {properties.map((_, i) => (
                    <button key={i}
                        onClick={() => { pause(); setActive(i); setTimeout(resume, 2500) }}
                        className="transition-all duration-500 rounded-full"
                        style={{
                            width: i === active ? '28px' : '6px',
                            height: '4px',
                            background: i === active
                                ? 'linear-gradient(90deg, #c6d9c2, #4a6741)'
                                : 'rgba(198,217,194,0.2)',
                        }}
                    />
                ))}
            </div>

            {/* Progress bar */}
            {autoplay && (
                <div className="absolute bottom-0 left-0 right-0 h-px z-50 overflow-hidden"
                    style={{ background: 'rgba(198,217,194,0.08)' }}>
                    <div className="h-full" style={{
                        background: 'linear-gradient(90deg, var(--green), var(--green-light))',
                        animation: 'carousel-progress 4.5s linear infinite',
                        transformOrigin: 'left',
                    }} />
                </div>
            )}

            <style>{`
        @keyframes carousel-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
        </div>
    )
}