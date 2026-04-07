'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    const isDarkHero = pathname === '/' || pathname === '/degerleme'

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [pathname])

    useEffect(() => { setMenuOpen(false) }, [pathname])
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    const isTransparent = isDarkHero && !scrolled && !menuOpen

    const navBg = menuOpen
        ? 'bg-transparent'
        : isTransparent
            ? 'bg-transparent'
            : 'bg-[#f7f4ef]/95 backdrop-blur-md border-b border-[#d4c9b3]/60 shadow-[0_1px_16px_rgba(44,43,40,0.07)]'

    const logoColor = isTransparent || menuOpen ? 'text-[#f0ebe0]' : 'text-[#2c2b28]'
    const linkColor = isTransparent || menuOpen ? 'text-[#d4c9b3]' : 'text-[#6b6760]'
    const burgerColor = menuOpen ? 'text-[#f0ebe0]' : isTransparent ? 'text-[#f0ebe0]' : 'text-[#2c2b28]'

    const links = [
        { href: '/ilanlar', label: 'İlanlar', num: '01' },
        { href: '/danismanlar', label: 'Danışmanlar', num: '02' },
        { href: '/favoriler', label: 'Favoriler', num: '03' },
        { href: '/degerleme', label: 'Değerleme', num: '04' },
        { href: '/iletisim', label: 'İletişim', num: '05' },
    ]

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Logo */}
                        <Link href="/" className={`transition-colors duration-300 ${logoColor} hover:opacity-80`}>
                            <span style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontWeight: 700,
                                fontSize: 'clamp(19px, 3vw, 23px)',
                                letterSpacing: '0.01em',
                                lineHeight: 1,
                            }}>
                                Emlak
                            </span>
                            <span style={{
                                fontFamily: "'DM Mono', monospace",
                                fontWeight: 400,
                                fontSize: 'clamp(11px, 1.5vw, 13px)',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                marginLeft: '4px',
                                verticalAlign: 'middle',
                                opacity: 0.6,
                            }}>
                                PRO
                            </span>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-7">
                            {links.map((l) => {
                                const isActive = pathname === l.href || (pathname?.startsWith(l.href.split('?')[0]) && l.href !== '/')
                                return (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        className={`text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-200
                      hover:text-[#4a6741] ${linkColor}
                      ${isActive ? '!text-[#4a6741]' : ''}`}
                                    >
                                        {l.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* CTA */}
                        <div className="hidden lg:flex items-center gap-5">
                            <Link
                                href="/ilanlar"
                                className={`text-[11px] font-bold tracking-[0.14em] uppercase px-5 py-2.5
                  border transition-all duration-250
                  ${isTransparent
                                        ? 'border-[#c6d9c2]/70 text-[#f0ebe0] hover:bg-[#f0ebe0] hover:text-[#2c2b28] hover:border-[#f0ebe0]'
                                        : 'border-[#4a6741] text-[#4a6741] hover:bg-[#4a6741] hover:text-[#f7f4ef]'
                                    }`}
                            >
                                İlan Ara
                            </Link>
                        </div>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            className={`lg:hidden relative z-[60] flex flex-col gap-[5px] p-2 ${burgerColor}`}
                            aria-label="Menü"
                        >
                            <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                            <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile overlay */}
            <div className={`lg:hidden fixed inset-0 z-40 bg-[#3a5432] transition-all duration-700
        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

                {/* Subtle texture overlay */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f0ebe0 1px, transparent 0)', backgroundSize: '28px 28px' }} />

                <div className="relative h-full flex flex-col justify-between px-8 pt-28 pb-12">
                    <nav className="flex flex-col gap-0">
                        {links.map((l, i) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="group flex items-baseline gap-4 py-4 border-b border-[#c6d9c2]/15 hover:border-[#c6d9c2]/35 transition-all duration-200"
                            >
                                <span className="text-[10px] text-[#c6d9c2]/40 font-mono w-5">{l.num}</span>
                                <span
                                    className={`font-display text-[2.8rem] sm:text-5xl font-bold text-[#f0ebe0] italic leading-none
                    transition-all duration-300 group-hover:translate-x-2
                    ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                                    style={{ transitionDelay: menuOpen ? `${i * 65 + 80}ms` : '0ms' }}
                                >
                                    {l.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8">
                        <div className="text-[#c6d9c2]/30 text-[10px] font-mono tracking-widest">© 2025 EmlakPro</div>
                        <div className="flex gap-7">
                            {['Instagram', 'Twitter', 'LinkedIn'].map((s) => (
                                <a key={s} href="#" className="text-[#c6d9c2]/40 hover:text-[#f0ebe0] text-[10px] font-bold tracking-widest uppercase transition-colors">{s}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}