'use client'

import { useState } from 'react'
import type { Property } from '@/types'

export function AIComparisonAnalysis({ properties }: { properties: Property[] }) {
    const [analysis, setAnalysis] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const analyze = async () => {
        setLoading(true); setOpen(true)
        try {
            const res = await fetch('/api/karsilastir-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ properties }),
            })
            const data = await res.json()
            setAnalysis(data.analysis || data.error || 'Analiz yapılamadı.')
        } catch {
            setAnalysis('Bir hata oluştu. Lütfen tekrar deneyin.')
        }
        setLoading(false)
    }

    if (properties.length < 2) return null

    return (
        <div>
            {!open ? (
                <button
                    onClick={analyze}
                    className="group w-full flex flex-col sm:flex-row items-center justify-center gap-5 py-10 px-8 transition-all duration-300"
                    style={{ border: '1px dashed #c6d9c2', background: '#edf3ec' }}
                    onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = '#e4ede3'
                        el.style.borderColor = '#4a6741'
                    }}
                    onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = '#edf3ec'
                        el.style.borderColor = '#c6d9c2'
                    }}
                >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: '#1e2d1a', boxShadow: '0 8px 24px rgba(30,45,26,0.25)' }}>
                        <span style={{ color: '#c6d9c2', fontSize: '22px' }}>✦</span>
                    </div>
                    <div className="text-center sm:text-left">
                        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: '18px', color: '#2c2b28', marginBottom: '5px' }}>
                            Yapay Zeka ile Analiz Et
                        </p>
                        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: '#a09d98', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            {properties.length} ilan · Hangisi size uygun?
                        </p>
                    </div>
                    <div className="sm:ml-auto shrink-0 flex items-center gap-3 px-6 py-3 transition-all duration-300 group-hover:gap-4"
                        style={{ background: '#1e2d1a', color: '#ede8dc' }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                            Analiz Başlat
                        </span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </button>
            ) : (
                <div className="overflow-hidden" style={{ border: '1px solid #c6d9c2' }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5"
                        style={{ background: '#1e2d1a', borderBottom: '1px solid rgba(198,217,194,0.1)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(198,217,194,0.12)', border: '1px solid rgba(198,217,194,0.18)' }}>
                                <span style={{ color: '#c6d9c2', fontSize: '16px' }}>✦</span>
                            </div>
                            <div>
                                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: '#ede8dc', fontSize: '15px' }}>
                                    AI Karşılaştırma Analizi
                                </p>
                                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgba(198,217,194,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '2px' }}>
                                    {properties.length} ilan değerlendiriliyor
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setOpen(false); setAnalysis('') }}
                            style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgba(198,217,194,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(198,217,194,0.65)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(198,217,194,0.3)'}
                        >
                            Kapat ✕
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6" style={{ background: '#ffffff' }}>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-14 gap-6">
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 rounded-full animate-spin"
                                        style={{ border: '2px solid #e8e3d8', borderTopColor: '#4a6741' }} />
                                    <div className="absolute inset-2 rounded-full animate-spin"
                                        style={{ border: '2px solid transparent', borderTopColor: '#c6d9c2', animationDuration: '0.6s', animationDirection: 'reverse' }} />
                                    <div className="absolute inset-0 flex items-center justify-center"
                                        style={{ color: '#4a6741', fontSize: '18px' }}>✦</div>
                                </div>
                                <div className="text-center">
                                    <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 600, color: '#2c2b28', fontSize: '16px', marginBottom: '8px' }}>
                                        İlanlar analiz ediliyor...
                                    </p>
                                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: '#a09d98', letterSpacing: '0.1em' }}>
                                        Fiyat · Özellik · Konum karşılaştırılıyor
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm leading-relaxed whitespace-pre-line"
                                style={{ color: '#6b6760', lineHeight: 1.9, fontSize: '14px' }}>
                                {analysis}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 flex items-start gap-2"
                        style={{ background: '#f7f4ef', borderTop: '1px solid #e8e3d8' }}>
                        <span style={{ fontSize: '11px', color: '#b07050', flexShrink: 0 }}>⚠</span>
                        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: '#a09d98', letterSpacing: '0.07em', lineHeight: 1.65 }}>
                            Bu analiz yapay zeka tarafından üretilmiştir ve yatırım tavsiyesi niteliği taşımaz. Karar vermeden önce bir emlak danışmanına başvurun.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}