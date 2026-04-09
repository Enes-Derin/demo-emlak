import { ContactForm } from '@/components/ContactForm'

export const metadata = { title: 'İletişim — EmlakPro' }

export default function IletisimPage() {
    const contactItems = [
        { icon: '📞', title: 'Telefon', value: '+90 (212) 000 00 00', sub: 'Hafta içi 09:00 — 18:00' },
        { icon: '✉️', title: 'E-posta', value: 'info@emlakpro.com', sub: '24 saat içinde yanıt' },
        { icon: '📍', title: 'Adres', value: 'Levent Mah. Büyükdere Cad. No:1', sub: 'Şişli, İstanbul' },
    ]

    return (
        <div className="min-h-screen" style={{ background: '#f7f4ef' }}>

            {/* Hero */}
            <div className="relative overflow-hidden" style={{ background: '#1e2d1a', paddingTop: '7rem', paddingBottom: '5rem' }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 100%, rgba(74,103,65,0.18) 0%, transparent 70%)' }}
                />
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-5 h-px" style={{ background: 'rgba(198,217,194,0.3)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.35)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            İletişim
                        </span>
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(46px,7vw,92px)', fontWeight: 700, color: '#ede8dc', lineHeight: 0.92, letterSpacing: '-0.02em' }}>
                        Bizimle<br />
                        <em style={{ fontStyle: 'italic', color: 'rgba(237,232,220,0.16)', fontWeight: 300 }}>İletişime Geçin</em>
                    </h1>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">

                    {/* Left */}
                    <div>
                        <p style={{ color: '#6b6760', fontSize: '15px', lineHeight: 1.85, maxWidth: '400px', marginBottom: '48px' }}>
                            Her sorunuz için buradayız. Uzman ekibimiz en kısa sürede size geri dönecek.
                        </p>
                        <div className="space-y-8">
                            {contactItems.map((item) => (
                                <div key={item.title} className="flex items-start gap-5">

                                    <div>
                                        <p style={{ color: '#a09d98', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            {item.title}
                                        </p>
                                        <p style={{ fontWeight: 600, color: '#2c2b28', fontSize: '15px' }}>{item.value}</p>
                                        <p style={{ color: '#6b6760', fontSize: '13px', marginTop: '2px' }}>{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="rounded-2xl p-8 lg:p-10"
                        style={{ background: '#ffffff', border: '1px solid #e8e3d8', boxShadow: '0 4px 24px rgba(44,43,40,0.07)' }}>
                        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '24px', fontWeight: 600, color: '#2c2b28', marginBottom: '28px' }}>
                            Mesaj Gönderin
                        </h2>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    )
}