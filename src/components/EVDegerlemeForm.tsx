'use client'

import { useState } from 'react'

interface FormData {
    city: string; district: string; neighborhood: string; type: string
    rooms: string; area: string; floor: string; buildingAge: string
    parking: boolean; elevator: boolean; furnished: boolean
}

const INITIAL: FormData = {
    city: '', district: '', neighborhood: '', type: 'daire',
    rooms: '', area: '', floor: '', buildingAge: '',
    parking: false, elevator: false, furnished: false,
}

function formatAnalysis(text: string) {
    return text
        .replace(/## (.*)/g, '<h3 style="font-family:\'Playfair Display\',Georgia,serif;font-size:20px;font-weight:700;color:var(--ink);margin-top:32px;margin-bottom:12px;letter-spacing:-0.01em">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--ink);font-weight:700">$1</strong>')
        .replace(/✅ (.*)/g, '<div style="display:flex;align-items:flex-start;gap:8px;color:#4a6741;margin:6px 0"><span>✅</span><span>$1</span></div>')
        .replace(/⚠️ (.*)/g, '<div style="display:flex;align-items:flex-start;gap:8px;color:var(--terra);margin:6px 0"><span>⚠️</span><span>$1</span></div>')
        .replace(/\n/g, '<br/>')
}

export function EVDegerlemeForm() {
    const [form, setForm] = useState<FormData>(INITIAL)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [step, setStep] = useState<'form' | 'result'>('form')

    const set = (k: keyof FormData, v: any) => setForm(f => ({ ...f, [k]: v }))

    const submit = async () => {
        if (!form.city || !form.type) { setError('En az şehir ve mülk tipi giriniz.'); return }
        setError(''); setLoading(true); setStep('result')
        try {
            const res = await fetch('/api/ev-degerleme', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const data = await res.json()
            if (data.error) { setError(data.error); setStep('form') }
            else setResult(data.analysis)
        } catch { setError('Bağlantı hatası.'); setStep('form') }
        setLoading(false)
    }

    const reset = () => { setForm(INITIAL); setResult(''); setError(''); setStep('form') }

    const inputClass = 'w-full bg-transparent outline-none text-sm py-3 transition-colors duration-200 placeholder:opacity-40'

    if (step === 'result') {
        return (
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
                {loading ? (
                    <div className="max-w-2xl mx-auto text-center py-24">
                        {/* Animated rings */}
                        <div className="relative w-20 h-20 mx-auto mb-10">
                            <div className="absolute inset-0 rounded-full" style={{ border: '2px solid var(--bej)' }} />
                            <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: 'var(--green)' }} />
                            <div className="absolute inset-2 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: 'var(--terra)', animationDuration: '0.7s', animationDirection: 'reverse' }} />
                            <div className="absolute inset-0 flex items-center justify-center text-xl">🏠</div>
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '28px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                            Araştırılıyor...
                        </h2>
                        <p style={{ color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.8, marginBottom: '36px' }}>
                            Yapay zeka güncel emlak sitelerini tarayıp<br />benzer ilanları analiz ediyor.
                        </p>
                        <div className="space-y-3 text-left max-w-sm mx-auto">
                            {[
                                { label: 'Bölge analiz ediliyor...', delay: 0 },
                                { label: 'Benzer ilanlar karşılaştırılıyor...', delay: 800 },
                                { label: 'm² fiyatları hesaplanıyor...', delay: 2000 },
                                { label: 'Değer aralığı oluşturuluyor...', delay: 4000 },
                            ].map(s => (
                                <div key={s.label}
                                    className="flex items-center gap-3 text-sm opacity-0 animate-fade-in-up"
                                    style={{ animationDelay: `${s.delay}ms`, animationFillMode: 'forwards', color: 'var(--ink-soft)' }}>
                                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green)', animationDelay: `${s.delay}ms` }} />
                                    {s.label}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Summary sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24">
                                <div className="rounded-xl p-8" style={{ border: '1px solid var(--bej)', background: 'var(--bej-light)' }}>
                                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '20px' }}>
                                        Değerlenen Mülk
                                    </p>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Tip', value: form.type },
                                            { label: 'Konum', value: [form.neighborhood, form.district, form.city].filter(Boolean).join(', ') },
                                            { label: 'Oda', value: form.rooms || '—' },
                                            { label: 'Alan', value: form.area ? form.area + ' m²' : '—' },
                                            { label: 'Kat', value: form.floor || '—' },
                                            { label: 'Yaş', value: form.buildingAge ? form.buildingAge + ' yıl' : '—' },
                                        ].map(row => (
                                            <div key={row.label} className="flex justify-between pb-3" style={{ borderBottom: '1px solid var(--bej)' }}>
                                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                                    {row.label}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>{row.value}</span>
                                            </div>
                                        ))}
                                        {(form.parking || form.elevator || form.furnished) && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {form.parking && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>Otopark</span>}
                                                {form.elevator && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>Asansör</span>}
                                                {form.furnished && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>Eşyalı</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button onClick={reset}
                                    className="mt-4 w-full text-xs font-bold tracking-widest uppercase py-4 transition-all duration-200"
                                    style={{ border: '1px solid var(--bej)', color: 'var(--ink-soft)' }}
                                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--green)'; el.style.color = '#f7f4ef'; el.style.borderColor = 'var(--green)' }}
                                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--ink-soft)'; el.style.borderColor = 'var(--bej)' }}
                                >
                                    Yeniden Hesapla
                                </button>

                                <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                                    ⚠️ Bu değerleme yapay zeka tarafından oluşturulmuştur. Kesin değer için danışmanımızla iletişime geçin.
                                </p>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="lg:col-span-8">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="w-7 h-px" style={{ background: 'var(--bej)' }} />
                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                                    AI Analiz Sonucu
                                </span>
                            </div>
                            <div className="prose max-w-none text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}
                                dangerouslySetInnerHTML={{ __html: formatAnalysis(result) }} />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

                {/* Form */}
                <div>
                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-7 h-px" style={{ background: 'var(--bej)' }} />
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            Mülk Bilgileri
                        </span>
                    </div>

                    <div className="space-y-10">
                        {/* Konum */}
                        <div>
                            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
                                Konum
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { key: 'city', label: 'Şehir *', placeholder: 'İstanbul' },
                                    { key: 'district', label: 'İlçe', placeholder: 'Kadıköy' },
                                    { key: 'neighborhood', label: 'Mahalle', placeholder: 'Moda' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={{ display: 'block', fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                            {f.label}
                                        </label>
                                        <input
                                            value={(form as any)[f.key]}
                                            onChange={e => set(f.key as keyof FormData, e.target.value)}
                                            placeholder={f.placeholder}
                                            className={inputClass}
                                            style={{ borderBottom: '1px solid var(--bej)', color: 'var(--ink)' }}
                                            onFocus={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--green)'}
                                            onBlur={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--bej)'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
                                Mülk Tipi
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['daire', 'villa', 'mustakil', 'arsa', 'ofis', 'dukkan'].map(t => (
                                    <button key={t} onClick={() => set('type', t)}
                                        className="text-xs font-bold tracking-widest uppercase px-4 py-2.5 transition-all duration-200"
                                        style={form.type === t
                                            ? { background: 'var(--green)', color: '#f7f4ef', border: '1px solid var(--green)' }
                                            : { border: '1px solid var(--bej)', color: 'var(--ink-soft)' }
                                        }
                                        onMouseEnter={e => { if (form.type !== t) (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-light)' }}
                                        onMouseLeave={e => { if (form.type !== t) (e.currentTarget as HTMLElement).style.borderColor = 'var(--bej)' }}
                                    >
                                        {t === 'mustakil' ? 'Müstakil' : t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
                                Detaylar
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { key: 'rooms', label: 'Oda', placeholder: '3+1' },
                                    { key: 'area', label: 'Alan (m²)', placeholder: '120' },
                                    { key: 'floor', label: 'Kat', placeholder: '4' },
                                    { key: 'buildingAge', label: 'Bina Yaşı', placeholder: '10' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={{ display: 'block', fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                            {f.label}
                                        </label>
                                        <input
                                            value={(form as any)[f.key]}
                                            onChange={e => set(f.key as keyof FormData, e.target.value)}
                                            placeholder={f.placeholder}
                                            className={inputClass}
                                            style={{ borderBottom: '1px solid var(--bej)', color: 'var(--ink)' }}
                                            onFocus={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--green)'}
                                            onBlur={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--bej)'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
                                Özellikler
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { key: 'parking', label: 'Otopark' },
                                    { key: 'elevator', label: 'Asansör' },
                                    { key: 'furnished', label: 'Eşyalı' },
                                ].map(f => (
                                    <button key={f.key} onClick={() => set(f.key as keyof FormData, !(form as any)[f.key])}
                                        className="text-xs font-bold tracking-widest uppercase px-4 py-2.5 transition-all duration-200"
                                        style={(form as any)[f.key]
                                            ? { background: 'var(--green)', color: '#f7f4ef', border: '1px solid var(--green)' }
                                            : { border: '1px solid var(--bej)', color: 'var(--ink-soft)' }
                                        }>
                                        {(form as any)[f.key] ? '✓ ' : ''}{f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm" style={{ color: 'var(--terra)', fontWeight: 600 }}>{error}</p>
                        )}

                        <button onClick={submit} disabled={loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-4 text-xs font-bold tracking-widest uppercase px-10 py-5 transition-all duration-300 group disabled:opacity-50"
                            style={{ background: 'var(--green)', color: '#f7f4ef' }}
                            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#3a5432' }}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--green)'}
                        >
                            Değer Hesapla
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right — How it works */}
                <div className="hidden lg:block">
                    <div className="sticky top-24">
                        <div className="flex items-center gap-3 mb-10">
                            <span className="w-7 h-px" style={{ background: 'var(--bej)' }} />
                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                                Nasıl Çalışır?
                            </span>
                        </div>
                        <div className="space-y-px" style={{ background: 'var(--bej)' }}>
                            {[
                                { num: '01', title: 'Bilgileri Girin', desc: 'Mülkünüzün konumunu ve özelliklerini girin.' },
                                { num: '02', title: 'AI Araştırır', desc: 'Yapay zeka Sahibinden, Hepsiemlak ve diğer emlak sitelerini tarar.' },
                                { num: '03', title: 'Analiz Edilir', desc: 'Benzer ilanlar karşılaştırılır, m² fiyatları hesaplanır.' },
                                { num: '04', title: 'Rapor Alın', desc: 'Detaylı değer aralığı ve piyasa analizi sunulur.' },
                            ].map((item, i) => (
                                <div key={item.num} className="group p-6 transition-colors duration-200 cursor-default"
                                    style={{ background: 'var(--surface)' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                                >
                                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)' }}>{item.num}</span>
                                    <h4 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '16px', marginTop: '8px', marginBottom: '4px' }}>
                                        {item.title}
                                    </h4>
                                    <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-6 rounded-xl" style={{ background: '#2e3d2a' }}>
                            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'rgba(198,217,194,0.35)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                Güçlü Kaynaklardan
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Sahibinden.com', 'Hepsiemlak.com', 'Emlakjet.com', 'Remax', 'Century21'].map(s => (
                                    <span key={s} className="text-xs px-3 py-1.5"
                                        style={{ color: 'rgba(198,217,194,0.4)', border: '1px solid rgba(198,217,194,0.1)' }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}