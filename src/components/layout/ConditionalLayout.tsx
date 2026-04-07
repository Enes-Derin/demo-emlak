'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isStudio = pathname?.startsWith('/studio')

    return (
        <>
            {!isStudio && <Navbar />}
            <main className="min-h-screen">{children}</main>
            {!isStudio && <Footer />}
        </>
    )
}