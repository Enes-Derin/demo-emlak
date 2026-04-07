import Link from 'next/link'
import { client } from '@/sanity/client'
import { featuredPropertiesQuery } from '@/sanity/queries'
import { ScrollReveal } from '@/components/ScrollReveal'
import { PropertyCarousel3D } from '@/components/property/PropertyCarousel3D'
import type { Property } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const properties: Property[] = await client.fetch(featuredPropertiesQuery)

  return (
    <div>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] flex flex-col overflow-hidden"
        style={{ background: '#2e3d2a' }}>

        {/* Animated dot-grid texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(198,217,194,0.08) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Soft radial glow centre */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(74,103,65,0.35) 0%, transparent 70%)',
          }}
        />

        {/* Animated accent lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-0 w-full h-px"
            style={{ background: 'rgba(198,217,194,0.06)' }} />
          <div className="absolute top-2/3 left-0 w-full h-px"
            style={{ background: 'rgba(198,217,194,0.06)' }} />
          <div className="absolute left-1/3 top-0 h-full w-px"
            style={{ background: 'rgba(198,217,194,0.06)' }} />
          <div className="absolute left-2/3 top-0 h-full w-px"
            style={{ background: 'rgba(198,217,194,0.06)' }} />
        </div>

        {/* Floating orb — subtle */}
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(176,112,80,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="flex-1 flex flex-col justify-end pb-20 lg:pb-28 pt-28 px-6 lg:px-12 max-w-[1400px] mx-auto w-full">

          <div className="flex items-center gap-3 mb-5 animate-fade-in">
            <span className="w-8 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
            <span style={{
              color: 'rgba(198,217,194,0.45)',
              fontFamily: "'DM Mono',monospace",
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              İstanbul Gayrimenkul
            </span>
          </div>

          <h1
            className="animate-fade-in-up"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(60px, 12vw, 160px)',
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              color: '#f0ebe0',
            }}
          >
            Yaşam<br />
            <em style={{
              color: 'rgba(240,235,224,0.18)',
              fontStyle: 'italic',
              fontWeight: 300,
            }}>
              Alanınız.
            </em>
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mt-8 sm:mt-12 animate-fade-in-up delay-200">
            <p style={{ color: 'rgba(240,235,224,0.38)', fontSize: '14px', lineHeight: 1.8, maxWidth: '300px' }}>
              Satılık ve kiralık ilanlar arasından size en uygun mülkü
              uzman danışmanlarımızla birlikte bulun.
            </p>
            <div className="flex gap-3">
              <Link href="/ilanlar?status=satilik"
                className="text-xs font-bold tracking-widest uppercase px-6 py-3 transition-all duration-300 hover:scale-[1.02] hover:bg-[#f0ebe0] hover:text-[#2e3d2a]"
                style={{
                  border: '1px solid rgba(240,235,224,0.6)',
                  color: '#f0ebe0',
                }}
              >
                Satılık
              </Link>
              <Link href="/ilanlar?status=kiralik"
                className="text-xs font-bold tracking-widest uppercase px-6 py-3 transition-all duration-300 hover:border-[#f0ebe0] hover:text-[#f0ebe0]"
                style={{
                  border: '1px solid rgba(198,217,194,0.2)',
                  color: 'rgba(240,235,224,0.45)',
                }}
              >
                Kiralık
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500">
          <span style={{ color: 'rgba(198,217,194,0.3)', fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(198,217,194,0.3), transparent)' }} />
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────── */}
      <div className="overflow-hidden py-4" style={{ background: 'var(--surface)', borderTop: '1px solid rgba(198,217,194,0.08)', borderBottom: '1px solid var(--bej)' }}>
        <div className="flex animate-marquee">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex items-center gap-12 pr-12">
              {['Satılık Daire', 'Kiralık Villa', 'Arsa', 'Ofis', 'Müstakil Ev', 'AI Fiyat Analizi', 'Ücretsiz Değerleme', 'Uzman Danışman'].map((t) => (
                <span key={t} className="whitespace-nowrap flex items-center gap-4"
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(0, 0, 0, 0.25)',
                  }}>
                  {t}
                  <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(0, 0, 0, 0.15)' }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────── */}
      {/* <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--bej)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'var(--bej)' }}>
            {[
              { value: '1.200+', label: 'Aktif İlan' },
              { value: '3.500+', label: 'Mutlu Müşteri' },
              { value: '48', label: 'Uzman Danışman' },
            ].map((s, i) => (
              <ScrollReveal key={s.label} type="up" delay={i * 80} className="py-10 px-4 sm:px-8 text-center">
                <div style={{
                  fontFamily: "'Playfair Display',Georgia,serif",
                  fontSize: 'clamp(28px,4vw,44px)',
                  fontWeight: 700,
                  color: 'var(--green)',
                  letterSpacing: '-0.01em',
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: '10px',
                  color: 'var(--ink-muted)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                }}>
                  {s.label}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── FEATURED ─────────────────────────────── */}
      {properties.length > 0 && (
        <section className="relative overflow-hidden py-20 lg:py-28"
          style={{ background: '#2e3d2a' }}>

          {/* Texture */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(198,217,194,0.05) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'rgba(198,217,194,0.1)' }} />
          <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'rgba(198,217,194,0.1)' }} />

          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
            <ScrollReveal className="flex items-end justify-between mb-12 lg:mb-16">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
                  <span style={{ color: 'rgba(198,217,194,0.4)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Seçkin İlanlar
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "'Playfair Display',Georgia,serif",
                  fontSize: 'clamp(48px,7vw,96px)',
                  fontWeight: 700,
                  color: '#f0ebe0',
                  lineHeight: 0.95,
                  letterSpacing: '-0.015em',
                }}>
                  Öne<br />
                  <em style={{ color: 'rgba(240,235,224,0.22)', fontStyle: 'italic' }}>Çıkanlar</em>
                </h2>
                <p className="mt-4" style={{ color: 'rgba(198,217,194,0.35)', fontSize: '13px', maxWidth: '280px', lineHeight: 1.75, fontFamily: "'Lato',sans-serif" }}>
                  Sürükle veya ok tuşlarını kullanarak ilanları keşfedin
                </p>
              </div>
              <Link href="/ilanlar"
                className="hidden sm:flex items-center gap-3 group transition-colors duration-300 hover:text-[#f0ebe0]"
                style={{ color: 'rgba(198,217,194,0.3)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase' }}
              >
                Tümünü Gör
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </ScrollReveal>

            <PropertyCarousel3D properties={properties} />

            <div className="mt-8 sm:hidden text-center">
              <Link href="/ilanlar"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase py-4 px-8 transition-all duration-300"
                style={{ border: '1px solid rgba(198,217,194,0.2)', color: 'rgba(240,235,224,0.45)' }}>
                Tüm İlanları Gör
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY ──────────────────────────────────── */}
      <section className="py-20 lg:py-32 overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">

            <ScrollReveal type="left">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-px" style={{ background: 'var(--bej)' }} />
                <span style={{ color: 'var(--ink-muted)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Neden EmlakPro?
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 'clamp(42px,6vw,80px)',
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 0.92,
                letterSpacing: '-0.01em',
              }}>
                Farklı<br />
                <em style={{ color: 'var(--bej)', fontStyle: 'italic' }}>düşünüyoruz.</em>
              </h2>
              <p className="mt-8" style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.8, maxWidth: '360px' }}>
                Teknoloji ve insan deneyimini birleştirerek
                gayrimenkul sektöründe yeni bir standart belirliyoruz.
              </p>
            </ScrollReveal>

            <div className="space-y-px">
              {[
                { num: '01', title: 'AI Destekli Analiz', desc: 'Fiyat analizi ve karşılaştırma yapay zeka ile.' },
                { num: '02', title: 'Harita Görünümü', desc: 'Tüm ilanları interaktif harita üzerinde keşfedin.' },
                { num: '03', title: 'Ev Değerleme', desc: 'Güncel emlak sitelerini tarayarak evinizin gerçek piyasa değerini öğrenin.' },
                { num: '04', title: 'Uzman Danışman', desc: 'Her adımda deneyimli danışmanlarımız yanınızda.' },
              ].map((item, i) => (
                <ScrollReveal key={item.num} type="right" delay={i * 80}>
                  <div className="group flex gap-6 p-6 sm:p-8 transition-colors duration-200 cursor-default hover:bg-[var(--green-pale)]"
                    style={{ borderBottom: '1px solid var(--bej)' }}
                  >
                    <span style={{ color: 'var(--ink-muted)', fontFamily: "'DM Mono',monospace", fontSize: '10px', marginTop: '4px', flexShrink: 0 }}>
                      {item.num}
                    </span>
                    <div>
                      <h3 className="group-hover:translate-x-1 transition-transform duration-300"
                        style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '18px' }}>
                        {item.title}
                      </h3>
                      <p className="mt-1" style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEĞERLEME CTA ────────────────────────── */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ background: '#3a5432' }}>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(240,235,224,1) 60px,rgba(240,235,224,1) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(240,235,224,1) 60px,rgba(240,235,224,1) 61px)',
          }}
        />
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'rgba(198,217,194,0.15)' }} />
        <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'rgba(198,217,194,0.15)' }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal type="left">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
                <span style={{ color: 'rgba(198,217,194,0.4)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Ücretsiz — AI Destekli
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 'clamp(42px,6vw,80px)',
                fontWeight: 700,
                color: '#f0ebe0',
                lineHeight: 0.95,
                letterSpacing: '-0.01em',
              }}>
                Evinizin<br />
                değerini<br />
                <em style={{ color: 'rgba(240,235,224,0.22)', fontStyle: 'italic' }}>öğrenin.</em>
              </h2>
              <p className="mt-6" style={{ color: 'rgba(240,235,224,0.38)', fontSize: '15px', maxWidth: '360px', lineHeight: 1.8 }}>
                Yapay zeka güncel emlak sitelerini tarayarak konumunuza özel
                gerçek piyasa verisiyle değer hesaplar.
              </p>
            </ScrollReveal>

            <ScrollReveal type="right" className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link href="/degerleme"
                className="group flex items-center justify-center gap-4 text-xs font-bold tracking-widest uppercase px-10 py-5 transition-all duration-300 hover:bg-[#d4c9b3]"
                style={{ background: '#f0ebe0', color: '#2e3d2a' }}
              >
                Değer Hesapla
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/iletisim"
                className="flex items-center justify-center text-xs font-bold tracking-widest uppercase px-10 py-5 transition-all duration-300 hover:border-[#f0ebe0] hover:text-[#f0ebe0]"
                style={{ border: '1px solid rgba(198,217,194,0.2)', color: 'rgba(240,235,224,0.5)' }}
              >
                Uzman Danışman
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────── */}
      <section className="py-20 lg:py-32 overflow-hidden" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="w-7 h-px" style={{ background: 'var(--bej)' }} />
              <span style={{ color: 'var(--ink-muted)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Mülkünüzü Değerlendirin
              </span>
              <span className="w-7 h-px" style={{ background: 'var(--bej)' }} />
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: 'clamp(64px,12vw,160px)',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              marginBottom: '48px',
            }}>
              Konuşalım.
            </h2>
            <Link href="/iletisim"
              className="inline-flex items-center gap-4 text-xs font-bold tracking-widest uppercase px-10 py-5 transition-all duration-300 group hover:bg-[#3a5432]"
              style={{ background: 'var(--green)', color: '#f7f4ef' }}
            >
              Ücretsiz Değerleme Al
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}