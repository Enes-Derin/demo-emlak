// ShareButtons.tsx
'use client'

import { useState, useEffect } from 'react'

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
    const [copied, setCopied] = useState(false)
    const [url, setUrl] = useState('')

    useEffect(() => { setUrl(`${window.location.origin}/ilanlar/${slug}`) }, [slug])

    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    const handleCopy = async () => {
        if (!url) return
        try { await navigator.clipboard.writeText(url) }
        catch { const i = document.createElement('input'); i.value = url; document.body.appendChild(i); i.select(); document.execCommand('copy'); document.body.removeChild(i) }
        setCopied(true); setTimeout(() => setCopied(false), 2000)
    }

    const btnBase = {
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
        padding: '8px 0', textAlign: 'center' as const, flex: 1, transition: 'all 0.2s',
        border: '1px solid var(--bej)', color: 'var(--ink-soft)', background: 'transparent', borderRadius: '8px',
    }

    return (
        <div className="flex gap-2">
            {[
                { label: 'Twitter', href: url ? `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` : '#' },
                { label: 'Facebook', href: url ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` : '#' },
            ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={btnBase}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--green-pale)'; el.style.borderColor = 'var(--green-light)'; el.style.color = 'var(--green)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'var(--bej)'; el.style.color = 'var(--ink-soft)' }}
                >
                    {s.label}
                </a>
            ))}
            <button onClick={() => { if (url) window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank') }}
                style={{ ...btnBase, color: '#4caf50', borderColor: '#c8e6c9' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#e8f5e9'; el.style.borderColor = '#a5d6a7' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = '#c8e6c9' }}
            >
                WhatsApp
            </button>
            <button onClick={handleCopy}
                style={copied
                    ? { ...btnBase, background: 'var(--green-pale)', borderColor: 'var(--green-light)', color: 'var(--green)' }
                    : btnBase
                }
                onMouseEnter={e => { if (!copied) { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--bej-light)' } }}
                onMouseLeave={e => { if (!copied) { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent' } }}
            >
                {copied ? '✓ Kopyalandı' : 'Kopyala'}
            </button>
        </div>
    )
}