'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity-image'
import type { SanityImage } from '@/types'

interface ImageGalleryProps {
    images: SanityImage[]
    title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    const prev = useCallback(() => setActiveIndex(i => Math.max(0, i - 1)), [])
    const next = useCallback(() => setActiveIndex(i => Math.min(images.length - 1, i + 1)), [images.length])

    // Keyboard navigation in lightbox
    useEffect(() => {
        if (!lightboxOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
            if (e.key === 'Escape') setLightboxOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightboxOpen, prev, next])

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-[16/9] rounded-xl flex items-center justify-center"
                style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
                <svg className="w-16 h-16" style={{ color: 'var(--bej)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
            </div>
        )
    }

    const activeImage = images[activeIndex]
    const activeUrl = urlFor(activeImage).width(1200).height(750).fit('crop').url()

    return (
        <>
            {/* Main image */}
            <div
                className="relative w-full aspect-[16/9] rounded-xl overflow-hidden cursor-zoom-in group"
                style={{ background: 'var(--bej-light)' }}
                onClick={() => setLightboxOpen(true)}
            >
                <Image
                    src={activeUrl}
                    alt={`${title} - ${activeIndex + 1}`}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(46,61,42,0.3), transparent)' }} />

                {/* Zoom hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
                        style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(12px)', color: 'var(--ink)', border: '1px solid var(--bej)' }}>
                        Büyüt
                    </span>
                </div>

                {/* Counter */}
                <div className="absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(46,61,42,0.72)', backdropFilter: 'blur(12px)', color: '#f0ebe0', fontFamily: "'DM Mono',monospace" }}>
                    {activeIndex + 1} / {images.length}
                </div>

                {/* Arrow nav on hover */}
                {images.length > 1 && (
                    <>
                        {activeIndex > 0 && (
                            <button
                                onClick={e => { e.stopPropagation(); prev() }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(12px)', color: 'var(--ink)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-sm)' }}>
                                ‹
                            </button>
                        )}
                        {activeIndex < images.length - 1 && (
                            <button
                                onClick={e => { e.stopPropagation(); next() }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(12px)', color: 'var(--ink)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-sm)' }}>
                                ›
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 snap-x">
                    {images.map((img, i) => {
                        const thumbUrl = urlFor(img).width(240).height(160).fit('crop').url()
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 snap-start`}
                                style={{
                                    border: `2px solid ${i === activeIndex ? 'var(--green)' : 'transparent'}`,
                                    opacity: i === activeIndex ? 1 : 0.5,
                                    transform: i === activeIndex ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: i === activeIndex ? 'var(--shadow-sm)' : 'none',
                                }}
                            >
                                <Image src={thumbUrl} alt={`${i + 1}`} fill className="object-cover object-center" sizes="96px" />
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
                    style={{ background: 'rgba(46,61,42,0.97)' }}
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close */}
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all duration-200 hover:scale-110"
                        style={{ background: 'rgba(240,235,224,0.1)', border: '1px solid rgba(240,235,224,0.15)', color: '#f0ebe0' }}>
                        ✕
                    </button>

                    {activeIndex > 0 && (
                        <button
                            onClick={e => { e.stopPropagation(); prev() }}
                            className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110"
                            style={{ background: 'rgba(240,235,224,0.1)', border: '1px solid rgba(240,235,224,0.15)', color: '#f0ebe0' }}>
                            ‹
                        </button>
                    )}

                    <div
                        className="relative w-full max-w-5xl mx-10 aspect-[16/9] animate-scale-in"
                        onClick={e => e.stopPropagation()}
                    >
                        <Image
                            src={urlFor(images[activeIndex]).width(1920).height(1080).fit('clip').url()}
                            alt={`${title} - ${activeIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>

                    {activeIndex < images.length - 1 && (
                        <button
                            onClick={e => { e.stopPropagation(); next() }}
                            className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110"
                            style={{ background: 'rgba(240,235,224,0.1)', border: '1px solid rgba(240,235,224,0.15)', color: '#f0ebe0' }}>
                            ›
                        </button>
                    )}

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm px-4 py-2 rounded-full"
                        style={{ background: 'rgba(240,235,224,0.1)', backdropFilter: 'blur(12px)', color: '#f0ebe0', fontFamily: "'DM Mono',monospace", fontSize: '11px' }}>
                        {activeIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    )
}