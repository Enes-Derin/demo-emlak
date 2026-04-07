'use client'

import { useState } from 'react'
import { set, useFormValue } from 'sanity'
import type { ArrayOfObjectsInputProps } from 'sanity'

export function AIDescriptionInput(props: ArrayOfObjectsInputProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Sanity'nin resmi hook'u — üst document'teki tüm alanlara erişim
    const title = useFormValue(['title']) as string
    const type = useFormValue(['type']) as string
    const status = useFormValue(['status']) as string
    const location = useFormValue(['location']) as any
    const details = useFormValue(['details']) as any

    const generate = async () => {
        setLoading(true)
        setError('')

        try {
            const payload = {
                title: title || '',
                type: type || '',
                status: status || '',
                location: location || {},
                details: details || {},
            }

            const res = await fetch('/api/aciklama-yaz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (data.error) {
                setError('Hata: ' + data.error)
                return
            }

            const paragraphs = (data.description as string)
                .split('\n')
                .filter((p) => p.trim().length > 0)
                .map((text) => ({
                    _type: 'block',
                    _key: Math.random().toString(36).slice(2, 9),
                    style: 'normal',
                    markDefs: [],
                    children: [{
                        _type: 'span',
                        _key: Math.random().toString(36).slice(2, 9),
                        text: text.trim(),
                        marks: [],
                    }],
                }))

            props.onChange(set(paragraphs))
        } catch {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.')
        }

        setLoading(false)
    }

    // Mevcut bilgilerin özeti — kullanıcıya göster
    const summary = [
        title && `"${title}"`,
        type && type,
        location?.city && location.city,
        location?.district && location.district,
        details?.rooms && `${details.rooms} oda`,
        details?.area && `${details.area}m²`,
        details?.floor != null && `${details.floor}. kat`,
    ].filter(Boolean).join(' · ')

    return (
        <div>
            {/* Mevcut bilgiler özeti */}
            {summary && (
                <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    marginBottom: '10px',
                    fontSize: '12px',
                    color: '#64748b',
                }}>
                    📋 Kullanılacak bilgiler: <strong style={{ color: '#334155' }}>{summary}</strong>
                </div>
            )}

            <button
                type="button"
                onClick={generate}
                disabled={loading}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    color: loading ? '#94a3b8' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '12px',
                    width: '100%',
                    justifyContent: 'center',
                }}
            >
                {loading ? (
                    <>
                        <span style={{
                            width: '14px', height: '14px',
                            border: '2px solid #94a3b8',
                            borderTopColor: '#475569',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        Açıklama yazılıyor...
                    </>
                ) : (
                    <>🤖 AI ile Açıklama Yaz</>
                )}
            </button>

            {error && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }}>
                    ❌ {error}
                </p>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {props.renderDefault(props)}
        </div>
    )
}