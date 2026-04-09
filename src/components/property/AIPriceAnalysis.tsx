'use client'

import { useState } from 'react'
import type { Property } from '@/types'

export function AIPriceAnalysis({ property }: { property: Property }) {
    const [analysis, setAnalysis] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const analyze = async () => {
        setLoading(true); setOpen(true)
        try {
            const res = await fetch('/api/fiyat-analizi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ property }),
            })
            const data = await res.json()
            setAnalysis(data.analysis || data.error || 'Analiz yapılamadı.')
        } catch {
            setAnalysis('Bir hata oluştu. Lütfen tekrar deneyin.')
        }
        setLoading(false)
    }

    return (
        <div className="mt-5">
            {!open ? (
                <button
                    onClick={analyze}
                    className="group w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300"
                    style={{ border: '1px dashed #d4c9b3', background: '#f7f4ef', color: '#b07050' }}
                    onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = '#b07050'
                        el.style.background = '#fdf6f1'
                    }}
                    onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = '#d4c9b3'
                        el.style.background = '#f7f4ef'
                    }}
                >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                        style={{ background: '#b07050', color: '#fff' }}>
                        ✦
                    </div>
                    AI Fiyat Analizi Yap
                </button>
            ) : (
                <div className="rounded-xl overflow-hidden animate-fade-in"
                    style={{ border: '1px solid #dfc4b5' }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3"
                        style={{ background: '#2c1a10', borderBottom: '1px solid rgba(223,196,181,0.15)' }}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                                style={{ background: 'rgba(176,112,80,0.25)', border: '1px solid rgba(176,112,80,0.3)' }}>
                                ✦
                            </div>
                            <div>
                                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: '#ede8dc', fontSize: '13px' }}>
                                    AI Fiyat Analizi
                                </p>
                                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgba(223,196,181,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                    Piyasa değerlendirmesi
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setOpen(false); setAnalysis('') }}
                            style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgba(223,196,181,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(223,196,181,0.7)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(223,196,181,0.35)'}
                        >
                            Kapat ✕
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4" style={{ background: '#fdf6f1' }}>
                        {loading ? (
                            <div className="flex items-center gap-3 py-4">
                                <div className="w-5 h-5 rounded-full shrink-0 animate-spin"
                                    style={{ border: '2px solid #dfc4b5', borderTopColor: '#b07050' }} />
                                <p style={{ fontSize: '13px', color: '#6b6760', fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>
                                    Piyasa verileri analiz ediliyor...
                                </p>
                            </div>
                        ) : (
                            <div className="text-sm leading-relaxed whitespace-pre-line"
                                style={{ color: '#6b6760', lineHeight: 1.85 }}>
                                {analysis}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 flex items-start gap-2"
                        style={{ background: '#f7f4ef', borderTop: '1px solid #dfc4b5' }}>
                        <span style={{ fontSize: '11px', color: '#b07050', flexShrink: 0 }}>⚠</span>
                        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: '#a09d98', letterSpacing: '0.07em', lineHeight: 1.65 }}>
                            Yapay zeka tarafından üretilmiştir. Yatırım tavsiyesi değildir.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}