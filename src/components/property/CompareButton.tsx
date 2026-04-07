// CompareButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function CompareButton({ propertyId }: { propertyId: string }) {
    const [selected, setSelected] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('emlak_compare') || '[]')
        setSelected(stored.includes(propertyId))
    }, [propertyId])

    const toggle = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation()
        const stored: string[] = JSON.parse(localStorage.getItem('emlak_compare') || '[]')
        if (stored.includes(propertyId)) {
            const updated = stored.filter(id => id !== propertyId)
            localStorage.setItem('emlak_compare', JSON.stringify(updated))
            setSelected(false)
        } else {
            if (stored.length >= 3) { alert('En fazla 3 ilan karşılaştırabilirsiniz.'); return }
            const updated = [...stored, propertyId]
            localStorage.setItem('emlak_compare', JSON.stringify(updated))
            setSelected(true)
        }
    }

    return (
        <button onClick={toggle}
            title={selected ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-lg transition-all duration-200"
            style={selected
                ? { background: 'var(--green)', color: '#f7f4ef', border: '1px solid var(--green)' }
                : { background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(8px)', color: 'var(--ink-soft)', border: '1px solid rgba(212,201,179,0.6)' }
            }>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {selected ? 'Seçildi' : 'Karşılaştır'}
        </button>
    )
}