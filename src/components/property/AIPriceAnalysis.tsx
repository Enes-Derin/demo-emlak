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
            const res = await fetch('/api/fiyat-analizi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ property }) })
            const data = await res.json()
            setAnalysis(data.analysis || data.error || 'Analiz yapılamadı.')
        } catch { setAnalysis('Bir hata oluştu. Lütfen tekrar deneyin.') }
        setLoading(false)
    }

    return (
        <div className="mt-5">
            {!open ? (
                <button onClick={analyze}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:bg-[var(--terra-light)] hover:border-[var(--terra-light)]"
                    style={{ border: '1px dashed var(--bej)', background: 'var(--bej-light)', color: 'var(--terra)' }}
                >
                    <span>🤖</span>
                    AI Fiyat Analizi Yap
                </button>
            ) : (
                <div className="rounded-xl p-4 animate-fade-in"
                    style={{ border: '1px solid var(--terra-light)', background: '#fdf6f1' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-base">🤖</span>
                            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '14px' }}>
                                AI Fiyat Analizi
                            </span>
                        </div>
                        <button onClick={() => { setOpen(false); setAnalysis('') }}
                            className="text-xs transition-colors duration-200 hover:text-[var(--terra)]"
                            style={{ color: 'var(--ink-muted)' }}
                        >
                            Kapat
                        </button>
                    </div>
                    {loading ? (
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--terra)' }}>
                            <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid var(--terra-light)', borderTopColor: 'var(--terra)' }} />
                            Analiz yapılıyor...
                        </div>
                    ) : (
                        <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--ink-soft)' }}>
                            {analysis}
                        </div>
                    )}
                    <p className="text-xs mt-3 pt-2" style={{ color: 'var(--ink-muted)', borderTop: '1px solid var(--terra-light)' }}>
                        ⚠️ Bu analiz yapay zeka tarafından üretilmiştir, yatırım tavsiyesi değildir.
                    </p>
                </div>
            )}
        </div>
    )
}