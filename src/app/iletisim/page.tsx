import { ContactForm } from '@/components/ContactForm'

export const metadata = { title: 'İletişim — EmlakPro' }

export default function IletisimPage() {
    const contactItems = [
        { icon: '📞', title: 'Telefon', value: '+90 (212) 000 00 00', sub: 'Hafta içi 09:00 — 18:00' },
        { icon: '✉️', title: 'E-posta', value: 'info@emlakpro.com', sub: '24 saat içinde yanıt' },
        { icon: '📍', title: 'Adres', value: 'Levent Mah. Büyükdere Cad. No:1', sub: 'Şişli, İstanbul' },
    ]

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

            {/* Hero strip */}
            <div style={{ background: '#3a5432', paddingTop: '6.5rem', paddingBottom: '3.5rem' }} className="px-6 lg:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="w-7 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.4)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            İletişim
                        </span>
                    </div>
                    <h1 style={{
                        fontFamily: "'Playfair Display',Georgia,serif",
                        fontSize: 'clamp(38px,5.5vw,75px)',
                        fontWeight: 700,
                        color: '#f0ebe0',
                        lineHeight: 1.05,
                    }}>
                        Bizimle<br />
                        <em style={{ fontStyle: 'italic', color: 'rgba(240,235,224,0.28)' }}>İletişime Geçin</em>
                    </h1>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

                    {/* Left — info */}
                    <div>
                        <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.8, maxWidth: '420px', marginBottom: '40px' }}>
                            Sormak istediğiniz her şey için buradayız. Uzman ekibimiz en kısa sürede size geri dönecektir.
                        </p>

                        <div className="space-y-7">
                            {contactItems.map((item) => (
                                <div key={item.title} className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-lg flex items-center justify-center text-lg shrink-0"
                                        style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)' }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--ink-muted)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '3px' }}>
                                            {item.title}
                                        </p>
                                        <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px' }}>{item.value}</p>
                                        <p style={{ color: 'var(--ink-soft)', fontSize: '13px' }}>{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="rounded-xl p-8 lg:p-10"
                        style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-md)' }}>
                        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '22px', fontWeight: 600, color: 'var(--ink)', marginBottom: '24px' }}>
                            Mesaj Gönderin
                        </h2>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    )
}