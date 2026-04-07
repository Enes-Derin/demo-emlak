import Link from 'next/link'

export function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer style={{ background: '#2e3d2a', color: '#f0ebe0' }}>

            {/* Top CTA */}
            <div style={{ borderBottom: '1px solid rgba(198,217,194,0.12)' }}>
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
                    <div className="max-w-xl">
                        <p style={{ color: 'rgba(198,217,194,0.4)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px' }}>
                            Hemen Başlayın
                        </p>
                        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(40px,6vw,80px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                            Hayalinizdeki<br />
                            <em style={{ color: 'rgba(240,235,224,0.25)', fontStyle: 'italic' }}>mülkü bulun.</em>
                        </h2>
                    </div>
                    <Link
                        href="/iletisim"
                        className="shrink-0 group flex items-center gap-4 px-8 py-5 transition-all duration-300 hover:bg-[#c6d9c2] hover:text-[#2e3d2a] hover:border-[#c6d9c2]"
                        style={{ border: '1px solid rgba(198,217,194,0.25)', color: '#f0ebe0' }}
                    >
                        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                            Ücretsiz Danışmanlık
                        </span>
                        <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Brand */}
                <div className="col-span-2 lg:col-span-1">
                    <Link href="/" className="block mb-6" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: '22px', color: '#f0ebe0', letterSpacing: '0.01em' }}>
                        Emlak<span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 400, fontSize: '13px', letterSpacing: '0.18em', opacity: 0.45, marginLeft: '4px' }}>PRO</span>
                    </Link>
                    <p style={{ color: 'rgba(240,235,224,0.38)', fontSize: '13px', lineHeight: 1.75, maxWidth: '210px' }}>
                        İstanbul'un en güvenilir emlak danışmanlık platformu.
                    </p>
                </div>

                {/* Links helper */}
                {[
                    {
                        title: 'İlanlar',
                        links: [
                            { href: '/ilanlar', label: 'Tüm İlanlar' },
                            { href: '/ilanlar?status=satilik', label: 'Satılık' },
                            { href: '/ilanlar?status=kiralik', label: 'Kiralık' },
                            { href: '/favoriler', label: 'Favorilerim' },
                        ],
                    },
                    {
                        title: 'Şirket',
                        links: [
                            { href: '/danismanlar', label: 'Danışmanlar' },
                            { href: '/iletisim', label: 'İletişim' },
                            { href: '/studio', label: 'Admin' },
                        ],
                    },
                    {
                        title: 'İletişim',
                        links: [
                            { href: 'tel:+902120000000', label: '+90 212 000 00 00' },
                            { href: 'mailto:info@emlakpro.com', label: 'info@emlakpro.com' },
                        ],
                        extra: <p style={{ color: 'rgba(240,235,224,0.35)', fontSize: '13px', lineHeight: 1.8, marginTop: '12px' }}>Levent, İstanbul<br />Türkiye</p>,
                    },
                ].map((col) => (
                    <div key={col.title}>
                        <p style={{ color: 'rgba(198,217,194,0.35)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '22px' }}>
                            {col.title}
                        </p>
                        <ul className="space-y-3">
                            {col.links.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} style={{ color: 'rgba(240,235,224,0.42)', fontSize: '13px', transition: 'color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f0ebe0'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(240,235,224,0.42)'}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {'extra' in col && col.extra}
                    </div>
                ))}
            </div>

            {/* Bottom */}
            <div style={{ borderTop: '1px solid rgba(198,217,194,0.10)' }}>
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p style={{ color: 'rgba(240,235,224,0.22)', fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.06em' }}>
                        © {year} EmlakPro. Tüm hakları saklıdır.
                    </p>
                    <div className="flex gap-6">
                        {['Instagram', 'Twitter', 'LinkedIn'].map(s => (
                            <a key={s} href="#"
                                style={{ color: 'rgba(240,235,224,0.22)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(198,217,194,0.7)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(240,235,224,0.22)'}
                            >
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}