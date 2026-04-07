'use client'

import { useState } from 'react'
import type { Property } from '@/types'

export function AIComparisonAnalysis({ properties }: { properties: Property[] }) {
    const [analysis, setAnalysis] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const analyze = async () => {
        setLoading(true)
        setOpen(true)
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
                /* ── Trigger button ── */
                <button
                    onClick={analyze}
                    className="group w-full flex flex-col sm:flex-row items-center justify-center gap-4 py-8 px-6 rounded-2xl transition-all duration-300"
                    style={{
                        border: '1px dashed var(--green-light)',
                        background: 'var(--green-pale)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,103,65,0.08)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)' }}
                >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: 'var(--green)', boxShadow: '0 4px 20px rgba(74,103,65,0.3)' }}>
                        <span style={{ fontSize: '20px' }}>🤖</span>
                    </div>
                    <div className="text-center sm:text-left">
                        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: '17px', color: 'var(--ink)', marginBottom: '4px' }}>
                            Yapay Zeka ile Analiz Et
                        </p>
                        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Hangi ilan size daha uygun? — AI değerlendirmesi
                        </p>
                    </div>
                    <div className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
                        style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                            Analiz Başlat
                        </span>
                        <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </button>

            ) : (
                /* ── Analysis panel ── */
                <div className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid var(--green-light)', boxShadow: 'var(--shadow-md)' }}>

                    {/* Panel header */}
                    <div className="flex items-center justify-between px-6 py-5"
                        style={{ background: 'linear-gradient(135deg, #2d4227 0%, #3a5432 100%)', borderBottom: '1px solid rgba(198,217,194,0.1)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(198,217,194,0.15)', border: '1px solid rgba(198,217,194,0.2)' }}>
                                <span style={{ fontSize: '16px' }}>🤖</span>
                            </div>
                            <div>
                                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: '#f0ebe0', fontSize: '15px' }}>
                                    AI Karşılaştırma Analizi
                                </p>
                                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgba(198,217,194,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '2px' }}>
                                    {properties.length} ilan değerlendiriliyor
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setOpen(false); setAnalysis('') }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200"
                            style={{ color: 'rgba(198,217,194,0.4)', border: '1px solid rgba(198,217,194,0.1)', fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(198,217,194,0.08)'; el.style.color = 'rgba(198,217,194,0.7)' }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(198,217,194,0.4)' }}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Kapat
                        </button>
                    </div>

                    {/* Panel body */}
                    <div className="p-6" style={{ background: 'var(--surface)' }}>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-5">
                                {/* Spinner */}
                                <div className="relative w-14 h-14">
                                    <div className="absolute inset-0 rounded-full animate-spin"
                                        style={{ border: '2px solid var(--bej)', borderTopColor: 'var(--green)' }} />
                                    <div className="absolute inset-2 rounded-full flex items-center justify-center"
                                        style={{ background: 'var(--green-pale)' }}>
                                        <span style={{ fontSize: '16px' }}>🤖</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 600, color: 'var(--ink)', fontSize: '15px', marginBottom: '6px' }}>
                                        İlanlar analiz ediliyor...
                                    </p>
                                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>
                                        Fiyat, özellik ve konum karşılaştırılıyor
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Analysis text */}
                                <div className="text-sm leading-relaxed whitespace-pre-line mb-6"
                                    style={{ color: 'var(--ink-soft)', lineHeight: 1.85, fontSize: '14px' }}>
                                    {analysis}
                                </div>


                            </div>
                        )}
                    </div>

                    {/* Disclaimer footer */}
                    <div className="px-6 py-4 flex items-start gap-2"
                        style={{ background: 'var(--bej-light)', borderTop: '1px solid var(--bej)' }}>
                        <span style={{ fontSize: '12px', flexShrink: 0 }}>⚠️</span>
                        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'var(--ink-muted)', letterSpacing: '0.08em', lineHeight: 1.6 }}>
                            Bu analiz yapay zeka tarafından üretilmiştir ve yatırım tavsiyesi niteliği taşımaz. Karar vermeden önce bir emlak danışmanına başvurmanız önerilir.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}