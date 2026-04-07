'use client'

import { useFavorites } from '@/hooks/useFavorites'

export function FavoriteButton({ propertyId }: { propertyId: string }) {
    const { toggle, isFavorite } = useFavorites()
    const fav = isFavorite(propertyId)

    return (
        <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(propertyId) }}
            title={fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${fav ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-stone-400 hover:text-red-400'
                }`}
        >
            <svg className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    )
}