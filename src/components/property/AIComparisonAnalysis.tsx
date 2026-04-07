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
            const res = await fetch('/api/karsilastir-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ properties }) })
            const data = await res.json()
            setAnalysis(data.analysis || data.error || 'Analiz yapılamadı.')
        } catch { setAnalysis('Bir hata oluştu. Lütfen tekrar deneyin.') }
        setLoading(false)
    }

    if (properties.length < 2) return null

    return (
        <div className="mt-8">
            {!open ? (
                <button onClick={analyze}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-200 hover:scale-[1.01]"
                    style={{ border: '1px dashed var(--green-light)', background: 'var(--green-pale)', color: 'var(--green)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--green-light)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)'}
                >
                    <span>🤖</span>
                    AI ile Karşılaştır — Hangisi Daha İyi?
                </button>
            ) : (
                <div className="rounded-xl p-6 animate-fade-in"
                    style={{ border: '1px solid var(--green-light)', background: 'var(--green-pale)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '16px' }}>
                                AI Karşılaştırma Analizi
                            </span>
                        </div>
                        <button onClick={() => { setOpen(false); setAnalysis('') }}
                            className="text-xs font-bold tracking-widest uppercase transition-colors duration-200 px-3 py-1.5 rounded-lg"
                            style={{ color: 'var(--ink-muted)', border: '1px solid var(--green-light)' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--green-light)'; el.style.color = 'var(--green)' }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--ink-muted)' }}
                        >
                            Kapat
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-3 py-4" style={{ color: 'var(--green)' }}>
                            <div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid var(--green-light)', borderTopColor: 'var(--green)' }} />
                            <span className="text-sm">İlanlar analiz ediliyor...</span>
                        </div>
                    ) : (
                        <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--ink-soft)' }}>
                            {analysis}
                        </div>
                    )}

                    <p className="text-xs mt-4 pt-3" style={{ color: 'var(--ink-muted)', borderTop: '1px solid var(--green-light)' }}>
                        ⚠️ Bu analiz yapay zeka tarafından üretilmiştir, yatırım tavsiyesi değildir.
                    </p>
                </div>
            )}
        </div>
    )
}