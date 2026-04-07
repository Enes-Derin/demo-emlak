'use client'

import { useState, useEffect, useCallback } from 'react'

const KEY = 'emlak_favorites'

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        try {
            const stored = localStorage.getItem(KEY)
            if (stored) setFavorites(JSON.parse(stored))
        } catch { }
    }, [])

    const toggle = useCallback((id: string) => {
        setFavorites((prev) => {
            const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
            try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { }
            return next
        })
    }, [])

    const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

    return { favorites, toggle, isFavorite }
}