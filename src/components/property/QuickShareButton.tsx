// QuickShareButton.tsx
'use client'

import { useState } from 'react'

export function QuickShareButton({ slug, title }: { slug: string; title: string }) {
    const [copied, setCopied] = useState(false)

    const share = async (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation()
        const url = `${window.location.origin}/ilanlar/${slug}`
        if (navigator.share) {
            try { await navigator.share({ title, url }) } catch { /* iptal */ }
            return
        }
        await navigator.clipboard.writeText(url)
        setCopied(true); setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button onClick={share} title="Paylaş"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
            style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,201,179,0.5)', color: 'var(--ink-soft)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--green-light)'; el.style.color = 'var(--green)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(212,201,179,0.5)'; el.style.color = 'var(--ink-soft)' }}
        >
            {copied ? (
                <svg className="w-4 h-4" style={{ color: 'var(--green)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            )}
        </button>
    )
}