'use client'

import { useState } from 'react'

interface ContactFormProps {
    propertyId?: string
    propertyTitle?: string
}

export function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
    const [form, setForm] = useState({
        name: '', phone: '', email: '', subject: '', message: ''
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

    const submit = async () => {
        if (!form.name || !form.phone) { setStatus('error'); return }
        setStatus('loading')
        try {
            const res = await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    propertyId,
                    propertyTitle,
                    source: propertyId ? 'ilan-formu' : 'iletisim-formu',
                })
            })
            const data = await res.json()
            if (res.ok) {
                setWhatsappUrl(data.whatsappUrl || null)
                setStatus('success')
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4 animate-scale-in">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)' }}>
                    ✅
                </div>
                <div>
                    <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '18px', marginBottom: '6px' }}>
                        Mesajınız Alındı!
                    </h3>
                    <p style={{ color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.6 }}>
                        En kısa sürede sizinle iletişime geçeceğiz.
                    </p>
                </div>

                {/* WhatsApp butonu — hızlı iletişim için */}
                {whatsappUrl && (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                        style={{ background: '#25D366', color: '#fff' }}
                    >
                        <WhatsAppIcon />
                        WhatsApp ile de Ulaşın
                    </a>
                )
                }

                <button
                    onClick={() => {
                        setStatus('idle')
                        setWhatsappUrl(null)
                        setForm({ name: '', phone: '', email: '', subject: '', message: '' })
                    }}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--ink-muted)', textDecoration: 'underline' }}>
                    Yeni mesaj gönder
                </button>
            </div >
        )
    }

    const inputBase = 'w-full text-sm py-3 px-3 rounded-lg outline-none transition-all duration-200'
    const inputStyle = { background: 'var(--bej-light)', border: '1px solid var(--bej)', color: 'var(--ink)' }
    const focusOn = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = 'var(--green-light)')
    const focusOff = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = 'var(--bej)')

    return (
        <div className="space-y-5">
            {propertyTitle && (
                <div className="px-3 py-2.5 rounded-lg text-sm"
                    style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)', color: 'var(--green)' }}>
                    📌 <span style={{ fontWeight: 600 }}>{propertyTitle}</span> hakkında
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {[
                    { key: 'name', label: 'Ad Soyad', placeholder: 'Adınız Soyadınız', required: true },
                    { key: 'phone', label: 'Telefon', placeholder: '+90 5XX XXX XX XX', required: true, type: 'tel' },
                ].map(f => (
                    <div key={f.key}>
                        <Label text={f.label} required={f.required} />
                        <input
                            value={(form as any)[f.key]}
                            onChange={e => set(f.key, e.target.value)}
                            type={f.type || 'text'}
                            placeholder={f.placeholder}
                            className={inputBase}
                            style={inputStyle}
                            onFocus={focusOn}
                            onBlur={focusOff}
                        />
                    </div>
                ))}
            </div>

            <div>
                <Label text="E-posta" />
                <input
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    type="email"
                    placeholder="ornek@email.com"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={focusOn}
                    onBlur={focusOff}
                />
            </div>

            {!propertyId && (
                <div>
                    <Label text="Konu" />
                    <select
                        value={form.subject}
                        onChange={e => set('subject', e.target.value)}
                        className={inputBase}
                        style={inputStyle}
                    >
                        <option value="">Seçiniz</option>
                        <option value="Satın Alma">Satın Alma</option>
                        <option value="Kiralama">Kiralama</option>
                        <option value="Değerleme">Değerleme</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>
            )}

            <div>
                <Label text="Mesajınız" />
                <textarea
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    rows={4}
                    placeholder="Mesajınızı buraya yazın..."
                    className={`${inputBase} resize-none`}
                    style={inputStyle}
                    onFocus={focusOn}
                    onBlur={focusOff}
                />
            </div>

            {status === 'error' && (
                <p className="text-sm px-3 py-2.5 rounded-lg animate-fade-in"
                    style={{ color: 'var(--terra)', background: '#fdf0eb', border: '1px solid var(--terra-light)' }}>
                    Ad ve telefon alanları zorunludur.
                </p>
            )}

            <button
                onClick={submit}
                disabled={status === 'loading'}
                className="w-full py-3.5 rounded-lg font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 hover:scale-[1.01]"
                style={{ background: 'var(--green)', color: '#f7f4ef' }}
                onMouseEnter={e => { if (status !== 'loading') (e.currentTarget as HTMLElement).style.background = '#3a5432' }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--green)'}
            >
                {status === 'loading' ? (
                    <>
                        <div className="w-4 h-4 border-2 rounded-full animate-spin"
                            style={{ borderColor: 'rgba(247,244,239,0.3)', borderTopColor: '#f7f4ef' }} />
                        Gönderiliyor...
                    </>
                ) : 'Gönder'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--ink-muted)' }}>
                Bilgileriniz yalnızca sizinle iletişim kurmak için kullanılır.
            </p>
        </div>
    )
}

function Label({ text, required }: { text: string; required?: boolean }) {
    return (
        <label style={{
            display: 'block',
            fontFamily: "'DM Mono',monospace",
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--ink-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px',
        }}>
            {text} {required && <span style={{ color: 'var(--terra)' }}>*</span>}
        </label>
    )
}

function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.442A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.031-1.378l-.361-.214-3.741.981.997-3.648-.235-.374A9.862 9.862 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106c5.42 0 9.894 4.474 9.894 9.894 0 5.42-4.474 9.894-9.894 9.894z" />
        </svg>
    )
}