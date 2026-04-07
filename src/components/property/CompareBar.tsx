// CompareBar.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function CompareBar() {
    const [ids, setIds] = useState<string[]>([])
    const router = useRouter()

    useEffect(() => {
        const sync = () => {
            const stored = JSON.parse(localStorage.getItem('emlak_compare') || '[]')
            setIds(stored)
        }
        sync()
        window.addEventListener('storage', sync)
        const interval = setInterval(sync, 500)
        return () => { window.removeEventListener('storage', sync); clearInterval(interval) }
    }, [])

    if (ids.length === 0) return null

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-5 py-3 rounded-xl animate-fade-in-up"
            style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                    {ids.length}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>ilan seçildi</span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => { if (ids.length < 2) { alert('En az 2 ilan seçin.'); return }; router.push(`/karsilastir?ids=${ids.join(',')}`); }}
                    disabled={ids.length < 2}
                    className="text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-40 hover:bg-[#3a5432]"
                    style={{ background: 'var(--green)', color: '#f7f4ef' }}
                >
                    Karşılaştır
                </button>
                <button onClick={() => { localStorage.removeItem('emlak_compare'); setIds([]) }}
                    className="text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-alt)]"
                    style={{ border: '1px solid var(--bej)', color: 'var(--ink-soft)' }}
                >
                    Temizle
                </button>
            </div>
        </div>
    )
}