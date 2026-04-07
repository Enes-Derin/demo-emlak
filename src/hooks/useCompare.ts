'use client'

import { useState, useCallback } from 'react'
import type { Property } from '@/types'

const MAX = 3

export function useCompare() {
    const [list, setList] = useState<Property[]>([])

    const toggle = useCallback((property: Property) => {
        setList((prev) => {
            if (prev.find((p) => p._id === property._id)) {
                return prev.filter((p) => p._id !== property._id)
            }
            if (prev.length >= MAX) return prev
            return [...prev, property]
        })
    }, [])

    const isInList = useCallback((id: string) => list.some((p) => p._id === id), [list])
    const clear = useCallback(() => setList([]), [])

    return { list, toggle, isInList, clear }
}