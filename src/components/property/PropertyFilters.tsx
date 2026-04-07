'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function PropertyFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const setParam = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        value ? params.set(key, value) : params.delete(key)
        router.push(`/ilanlar?${params.toString()}`)
    }, [router, searchParams])

    const current = {
        status: searchParams.get('status') || '',
        type: searchParams.get('type') || '',
        city: searchParams.get('city') || '',
    }

    const hasFilters = current.status || current.type || current.city

    return (
        <div className="sticky top-20 rounded-xl p-5 space-y-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-sm)' }}>

            <div className="flex items-center justify-between">
                <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '16px' }}>
                    Filtrele
                </h3>
                {hasFilters && (
                    <button onClick={() => router.push('/ilanlar')}
                        className="text-xs font-bold tracking-widest uppercase transition-colors duration-200 hover:text-[#8a4530]"
                        style={{ color: 'var(--terra)', fontFamily: "'DM Mono',monospace" }}
                    >
                        Temizle
                    </button>
                )}
            </div>

            <div className="divider-sage" />

            {/* Status */}
            <div>
                <label style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                    Durum
                </label>
                <div className="space-y-1.5">
                    {[
                        { value: '', label: 'Tümü' },
                        { value: 'satilik', label: 'Satılık' },
                        { value: 'kiralik', label: 'Kiralık' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setParam('status', opt.value)}
                            className={
                                `w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all duration-200 ${current.status === opt.value ? '' : 'hover:bg-[var(--green-pale)]'}`
                            }
                            style={current.status === opt.value
                                ? { background: 'var(--green)', color: '#f7f4ef', fontWeight: 600 }
                                : { color: 'var(--ink-soft)', background: 'transparent' }
                            }
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="divider-sage" />

            {/* Type */}
            <div>
                <label style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                    Mülk Tipi
                </label>
                <div className="space-y-1.5">
                    {[
                        { value: '', label: 'Tümü' },
                        { value: 'daire', label: 'Daire' },
                        { value: 'villa', label: 'Villa' },
                        { value: 'mustakil', label: 'Müstakil Ev' },
                        { value: 'arsa', label: 'Arsa' },
                        { value: 'ofis', label: 'Ofis' },
                        { value: 'dukkan', label: 'Dükkan' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setParam('type', opt.value)}
                            className="w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all duration-200"
                            style={current.type === opt.value
                                ? { background: 'var(--green)', color: '#f7f4ef', fontWeight: 600 }
                                : { color: 'var(--ink-soft)', background: 'transparent' }
                            }
                            onMouseEnter={e => {
                                if (current.type !== opt.value)
                                    (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)'
                            }}
                            onMouseLeave={e => {
                                if (current.type !== opt.value)
                                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="divider-sage" />

            {/* City */}
            <div>
                <label style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                    Şehir
                </label>
                <input
                    type="text"
                    placeholder="İstanbul, Ankara..."
                    defaultValue={current.city}
                    onBlur={(e) => setParam('city', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setParam('city', (e.target as HTMLInputElement).value) }}
                    className="w-full text-sm py-3 px-0 bg-transparent outline-none transition-colors duration-200"
                    style={{
                        borderBottom: '1px solid var(--bej)',
                        color: 'var(--ink)',
                        caretColor: 'var(--green)',
                    }}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--green)'}
                    onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--bej)'}
                />
            </div>
        </div>
    )
}