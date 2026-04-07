'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    type?: 'up' | 'left' | 'right' | 'scale'
    delay?: number
}

export function ScrollReveal({ children, className = '', type = 'up', delay = 0 }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => el.classList.add('visible'), delay)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [delay])

    const base = type === 'left' ? 'reveal-left'
        : type === 'right' ? 'reveal-right'
            : type === 'scale' ? 'reveal-scale'
                : 'reveal'

    return (
        <div ref={ref} className={`${base} ${className}`}>
            {children}
        </div>
    )
}