import { EVDegerlemeForm } from '@/components/EVDegerlemeForm'

export const metadata = {
    title: 'Ev Değerleme — EmlakPro',
    description: 'Evinizin tahmini piyasa değerini yapay zeka ile öğrenin.',
}

export default function DegerlemePage() {
    return (
        <div className="min-h-screen" style={{ background: '#f7f4ef' }}>

            {/* Hero */}
            <div className="relative overflow-hidden" style={{ background: '#1e2d1a', paddingTop: '7.5rem', paddingBottom: '5.5rem' }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 110%, rgba(74,103,65,0.22) 0%, transparent 70%)' }}
                />
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(198,217,194,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,217,194,1) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-5 h-px" style={{ background: 'rgba(198,217,194,0.3)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.35)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            AI Destekli · Ücretsiz
                        </span>
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(48px,7.5vw,100px)', fontWeight: 700, color: '#ede8dc', lineHeight: 0.9, letterSpacing: '-0.02em', marginBottom: '28px' }}>
                        Evinizin<br />
                        <em style={{ fontStyle: 'italic', color: 'rgba(237,232,220,0.16)', fontWeight: 300 }}>Değeri Ne?</em>
                    </h1>
                    <p style={{ color: 'rgba(237,232,220,0.35)', fontSize: '15px', maxWidth: '420px', lineHeight: 1.85 }}>
                        Yapay zeka güncel verilerle konumunuza özel gerçek piyasa değerini dakikalar içinde hesaplar.
                    </p>
                </div>
            </div>

            <EVDegerlemeForm />
        </div>
    )
}