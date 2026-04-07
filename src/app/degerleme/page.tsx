import { EVDegerlemeForm } from '@/components/EVDegerlemeForm'

export const metadata = {
    title: 'Ev Değerleme — EmlakPro',
    description: 'Evinizin tahmini piyasa değerini yapay zeka ile öğrenin.',
}

export default function DegerlemePage() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

            {/* Hero */}
            <div style={{ background: '#3a5432' }} className="pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-7 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.4)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            AI Destekli
                        </span>
                    </div>

                    <h1 className="animate-fade-in-up" style={{
                        fontFamily: "'Playfair Display',Georgia,serif",
                        fontSize: 'clamp(44px,6.5vw,90px)',
                        fontWeight: 700,
                        color: '#f0ebe0',
                        lineHeight: 0.95,
                        letterSpacing: '-0.015em',
                        marginBottom: '24px',
                    }}>
                        Evinizin<br />
                        <em style={{ fontStyle: 'italic', color: 'rgba(240,235,224,0.25)' }}>Değeri Ne?</em>
                    </h1>

                    <p className="animate-fade-in delay-150" style={{ color: 'rgba(240,235,224,0.42)', fontSize: '15px', maxWidth: '460px', lineHeight: 1.8 }}>
                        Yapay zeka, güncel emlak verilerini analiz ederek konumunuza ve özelliklerinize göre
                        gerçek piyasa değerini hesaplar.
                    </p>
                </div>
            </div>

            {/* Form */}
            <EVDegerlemeForm />
        </div>
    )
}