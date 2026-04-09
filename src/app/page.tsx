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
      <section className="relative min-h-[100svh] flex flex-col overflow-hidden justify-center"
        style={{ background: 'linear-gradient(165deg, #1a2817 0%, #1e2d1a 45%, #243322 100%)' }}>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[20%] sm:-left-[10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full animate-slow-float"
            style={{
              background: 'radial-gradient(circle, rgba(198,217,194,0.08) 0%, transparent 70%)',
              filter: 'blur(60px) sm:blur(80px)',
              animationDelay: '0s'
            }}
          />
          <div className="absolute top-[20%] sm:top-[30%] -right-[30%] sm:-right-[15%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full animate-slow-float"
            style={{
              background: 'radial-gradient(circle, rgba(176,112,80,0.05) 0%, transparent 70%)',
              filter: 'blur(80px) sm:blur(100px)',
              animationDelay: '2s'
            }}
          />
          <div className="absolute bottom-[5%] sm:bottom-[10%] left-[20%] sm:left-[40%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full animate-slow-float"
            style={{
              background: 'radial-gradient(circle, rgba(107,143,98,0.06) 0%, transparent 70%)',
              filter: 'blur(70px) sm:blur(90px)',
              animationDelay: '4s'
            }}
          />
        </div>

        {/* Enhanced grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '180px',
          }}
        />

        {/* Refined grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(198,217,194,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(198,217,194,0.035) 1px, transparent 1px)',
            backgroundSize: '60px 60px sm:100px 100px',
          }}
        />

        {/* Vignette overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(26,40,23,0.4) 100%)' }}
        />

        <div className="flex-1 flex flex-col justify-center py-20 sm:py-24 md:py-28 lg:pb-36 px-5 sm:px-8 md:px-12 lg:px-20 max-w-[1480px] mx-auto w-full relative z-10">

          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-in">
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-[rgba(198,217,194,0.4)] to-transparent" />
            <span style={{
              color: 'rgba(198,217,194,0.45)',
              fontFamily: "'DM Mono',monospace",
              fontSize: 'clamp(8px, 2vw, 10px)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>
              İstanbul Gayrimenkul
            </span>
            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full animate-pulse-slow"
              style={{ background: 'rgba(198,217,194,0.5)' }}
            />
          </div>

          <h1 className="animate-fade-in-up mb-3 sm:mb-4" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(48px, 12vw, 192px)',
            fontWeight: 700,
            lineHeight: 0.84,
            letterSpacing: '-0.03em',
            color: '#ede8dc',
          }}>
            Yaşam<br />
            <span className="relative inline-block">
              <em style={{
                color: 'rgba(237,232,220,0.12)',
                fontStyle: 'italic',
                fontWeight: 300,
                textShadow: '0 0 40px rgba(237,232,220,0.05)'
              }}>
                Alanınız.
              </em>
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(198,217,194,0.15)] to-transparent" />
            </span>
          </h1>

          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 mt-8 sm:mt-12 md:mt-16 animate-fade-in-up delay-200">
            <div className="max-w-full sm:max-w-[380px]">
              <p style={{
                color: 'rgba(237,232,220,0.4)',
                fontSize: 'clamp(13px, 3vw, 15px)',
                lineHeight: 1.8,
                fontFamily: "'Lato',sans-serif",
                letterSpacing: '0.01em'
              }}>
                Satılık ve kiralık ilanlar arasından size en uygun mülkü uzman danışmanlarımızla birlikte bulun.
              </p>

              {/* Stats - Mobile optimized */}

            </div>

            {/* Buttons - Mobile stacked */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link href="/ilanlar?status=satilik"
                className="group relative overflow-hidden text-center sm:text-left text-xs font-bold tracking-[0.12em] uppercase px-8 sm:px-9 py-4 sm:py-5 transition-all duration-500 hover:shadow-2xl w-full sm:w-auto"
                style={{
                  background: '#ede8dc',
                  color: '#1e2d1a',
                  boxShadow: '0 4px 24px rgba(237,232,220,0.15)'
                }}>
                <span className="relative z-10 flex items-center justify-center sm:justify-start gap-3">
                  Satılık
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
                  style={{ background: 'linear-gradient(135deg, #c6d9c2 0%, #b8ceb4 100%)' }}
                />
              </Link>
              <Link href="/ilanlar?status=kiralik"
                className="group text-center sm:text-left text-xs font-bold tracking-[0.12em] uppercase px-8 sm:px-9 py-4 sm:py-5 transition-all duration-400 hover:border-[rgba(237,232,220,0.6)] hover:bg-[rgba(237,232,220,0.03)] w-full sm:w-auto"
                style={{
                  border: '1.5px solid rgba(198,217,194,0.2)',
                  color: 'rgba(237,232,220,0.45)'
                }}>
                <span className="flex items-center justify-center sm:justify-start gap-3">
                  Kiralık
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 animate-fade-in delay-600">
          <div className="w-5 sm:w-6 h-8 sm:h-10 rounded-full border-[1.5px] flex items-start justify-center pt-1.5 sm:pt-2 backdrop-blur-sm"
            style={{ borderColor: 'rgba(198,217,194,0.25)', background: 'rgba(30,45,26,0.3)' }}>
            <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 rounded-full animate-scroll-down"
              style={{ background: 'rgba(198,217,194,0.5)' }}
            />
          </div>
          <span className="hidden sm:block" style={{
            fontSize: '9px',
            color: 'rgba(198,217,194,0.3)',
            letterSpacing: '0.15em',
            fontFamily: "'DM Mono',monospace"
          }}>
            SCROLL
          </span>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────── */}
      <div className="relative overflow-hidden py-3 sm:py-4"
        style={{
          background: 'linear-gradient(180deg, #faf7f2 0%, #f7f4ef 100%)',
          borderTop: '1px solid rgba(212,201,179,0.3)',
          borderBottom: '1px solid rgba(212,201,179,0.3)'
        }}>
        <div className="flex animate-marquee">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
              {[
                { icon: '●', text: 'Satılık Daire' },
                { icon: '◆', text: 'Kiralık Villa' },
                { icon: '■', text: 'Arsa' },
                { icon: '▲', text: 'Ofis' },
                { icon: '●', text: 'Müstakil Ev' },
                { icon: '★', text: 'AI Analizi' },
                { icon: '◆', text: 'Değerleme' },
                { icon: '■', text: 'Danışman' }
              ].map((item, i) => (
                <span key={i} className="whitespace-nowrap flex items-center gap-4 sm:gap-6"
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 'clamp(8px, 2vw, 10px)',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(44,43,40,0.2)'
                  }}>
                  <span style={{ color: 'rgba(176,112,80,0.15)' }}>{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED ─────────────────────────────── */}
      {properties.length > 0 && (
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-44"
          style={{ background: 'linear-gradient(165deg, #1a2817 0%, #1e2d1a 50%, #243322 100%)' }}>

          {/* Sophisticated background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #c6d9c2 1.5px, transparent 0)',
              backgroundSize: '48px 48px sm:64px 64px',
            }}
          />

          {/* Gradient accent lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(198,217,194,0.12)] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(198,217,194,0.12)] to-transparent" />

          {/* Floating accent */}
          <div className="absolute top-[20%] right-[10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full pointer-events-none animate-slow-float"
            style={{
              background: 'radial-gradient(circle, rgba(176,112,80,0.04) 0%, transparent 70%)',
              filter: 'blur(60px) sm:blur(80px)',
              animationDelay: '1s'
            }}
          />

          <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 relative">
            <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-0 mb-12 sm:mb-16 lg:mb-24">
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-8 sm:w-10 h-px bg-gradient-to-r from-[rgba(198,217,194,0.35)] to-transparent" />
                  <span style={{
                    color: 'rgba(198,217,194,0.4)',
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 'clamp(8px, 2vw, 10px)',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontWeight: 500
                  }}>
                    Seçkin İlanlar
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "'Playfair Display',Georgia,serif",
                  fontSize: 'clamp(40px, 10vw, 124px)',
                  fontWeight: 700,
                  color: '#ede8dc',
                  lineHeight: 0.88,
                  letterSpacing: '-0.025em'
                }}>
                  Öne<br />
                  <em style={{
                    color: 'rgba(237,232,220,0.14)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    textShadow: '0 0 60px rgba(237,232,220,0.03)'
                  }}>
                    Çıkanlar
                  </em>
                </h2>
              </div>
              <Link href="/ilanlar"
                className="flex items-center gap-3 sm:gap-4 group transition-all duration-400"
                style={{
                  color: 'rgba(198,217,194,0.3)',
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 'clamp(8px, 2vw, 10px)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 500
                }}>
                <span className="group-hover:text-[#c6d9c2] transition-colors duration-400">Tümünü Gör</span>
                <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-[rgba(198,217,194,0.25)] to-transparent group-hover:from-[#c6d9c2] transition-all duration-400" />
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-2 transition-transform duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </ScrollReveal>
            <PropertyCarousel3D properties={properties} />
          </div>
        </section>
      )}

      {/* ── WHY ──────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-44"
        style={{ background: 'linear-gradient(180deg, #faf7f2 0%, #f7f4ef 100%)' }}>
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-48 items-start">

            <ScrollReveal type="left">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                <div className="w-8 sm:w-10 h-px bg-gradient-to-r from-[#d4c9b3] to-transparent" />
                <span style={{
                  color: '#a09d98',
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 'clamp(8px, 2vw, 10px)',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  fontWeight: 500
                }}>
                  Neden EmlakPro?
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 'clamp(40px, 9vw, 104px)',
                fontWeight: 700,
                color: '#2c2b28',
                lineHeight: 0.86,
                letterSpacing: '-0.02em',
                marginBottom: '16px sm:24px'
              }}>
                Farklı<br />
                <em style={{
                  color: '#d4c9b3',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  textShadow: '0 2px 20px rgba(212,201,179,0.15)'
                }}>
                  düşünüyoruz.
                </em>
              </h2>
              <div className="w-16 sm:w-20 h-0.5 sm:h-1 rounded-full mb-8 sm:mb-12"
                style={{ background: 'linear-gradient(90deg, #d4c9b3 0%, transparent 100%)' }}
              />
              <p style={{
                color: '#6b6760',
                fontSize: 'clamp(14px, 3vw, 16px)',
                lineHeight: 1.9,
                maxWidth: '380px',
                letterSpacing: '0.01em'
              }}>
                Teknolojiyi insan deneyimiyle harmanlayarak gayrimenkulde yeni bir standart kuruyoruz. Her detay, sizin için düşünüldü.
              </p>


            </ScrollReveal>

            <div className="space-y-1 sm:space-y-2">
              {[
                {
                  num: '01',
                  title: 'AI Destekli Fiyat Analizi',
                  desc: 'Gerçek zamanlı piyasa verileriyle desteklenen yapay zeka analizleri doğru fiyat kararı almanızı sağlar.',
                  icon: '⚡'
                },
                {
                  num: '02',
                  title: 'Ücretsiz Ev Değerleme',
                  desc: 'Güncel emlak verilerini tarayarak evinizin gerçek piyasa değerini dakikalar içinde öğrenin.',
                  icon: '◆'
                },
                {
                  num: '03',
                  title: 'Uzman Danışman Desteği',
                  desc: 'Sektörde yılların deneyimiyle, satın almadan kiralığa her adımda yanınızdayız.',
                  icon: '★'
                },
              ].map((item, i) => (
                <ScrollReveal key={item.num} type="right" delay={i * 120}>
                  <div className="group relative flex gap-5 sm:gap-8 md:gap-10 py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 transition-all duration-500 cursor-pointer rounded-lg hover:bg-white hover:shadow-xl"
                    style={{ borderBottom: i < 2 ? '1px solid rgba(232,227,216,0.6)' : 'none' }}>

                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                      style={{
                        background: 'linear-gradient(135deg, rgba(74,103,65,0.08) 0%, rgba(212,201,179,0.12) 100%)',
                        color: '#4a6741',
                        fontSize: 'clamp(16px, 4vw, 20px)'
                      }}>
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <span style={{
                          color: 'rgba(212,201,179,0.5)',
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 'clamp(8px, 2vw, 10px)',
                          letterSpacing: '0.15em',
                          fontWeight: 600
                        }}>
                          {item.num}
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-[rgba(212,201,179,0.2)] to-transparent" />
                      </div>

                      <h3 className="group-hover:translate-x-1 transition-transform duration-400 mb-2 sm:mb-3"
                        style={{
                          fontFamily: "'Playfair Display',Georgia,serif",
                          fontWeight: 700,
                          color: '#2c2b28',
                          fontSize: 'clamp(16px, 4vw, 22px)',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.3
                        }}>
                        {item.title}
                      </h3>

                      <p style={{
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        color: '#6b6760',
                        lineHeight: 1.8,
                        letterSpacing: '0.01em'
                      }}>
                        {item.desc}
                      </p>
                    </div>

                    {/* Hover arrow - Hidden on mobile */}
                    <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-400 items-center">
                      <svg className="w-5 h-5 text-[#4a6741] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEĞERLEME CTA ────────────────────────── */}
      <section className="relative py-16 sm:py-24 lg:py-44 overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #2a3e24 0%, #2e4228 50%, #34492d 100%)' }}>

        {/* Background patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(237,232,220,0.05) 60px,rgba(237,232,220,0.05) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(237,232,220,0.05) 60px,rgba(237,232,220,0.05) 61px)',
          }}
        />

        {/* Floating orb */}
        <div className="absolute top-[30%] left-[15%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full pointer-events-none animate-slow-float"
          style={{
            background: 'radial-gradient(circle, rgba(198,217,194,0.06) 0%, transparent 70%)',
            filter: 'blur(80px) sm:blur(100px)',
            animationDelay: '2s'
          }}
        />

        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 relative">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-32 items-center">

            <ScrollReveal type="left">
              <div className="flex items-center gap-3 mb-6 sm:mb-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full animate-pulse-slow" style={{ background: '#c6d9c2' }} />
                  <span style={{
                    color: 'rgba(198,217,194,0.4)',
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 'clamp(8px, 2vw, 10px)',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontWeight: 500
                  }}>
                    Ücretsiz · AI Destekli
                  </span>
                </div>
              </div>

              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 'clamp(40px, 9vw, 104px)',
                fontWeight: 700,
                color: '#ede8dc',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                marginBottom: '20px sm:28px'
              }}>
                Evinizin<br />değerini<br />
                <em style={{
                  color: 'rgba(237,232,220,0.14)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  textShadow: '0 0 60px rgba(237,232,220,0.05)'
                }}>
                  öğrenin.
                </em>
              </h2>

              <div className="w-20 sm:w-24 h-0.5 sm:h-1 rounded-full mb-6 sm:mb-10"
                style={{ background: 'linear-gradient(90deg, rgba(198,217,194,0.4) 0%, transparent 100%)' }}
              />

              <p style={{
                color: 'rgba(237,232,220,0.4)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                maxWidth: '420px',
                lineHeight: 1.9,
                letterSpacing: '0.01em',
                marginBottom: '24px sm:32px'
              }}>
                Yapay zeka güncel verileri analiz ederek konumunuza özel gerçek piyasa değerini hesaplar. Dakikalar içinde detaylı rapor alın.
              </p>

              {/* Features list */}
              <div className="space-y-3 sm:space-y-4 max-w-[420px]">
                {[
                  'Anlık piyasa analizi',
                  'Karşılaştırmalı değerleme',
                  'Bölgesel trend raporu'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4 animate-fade-in" style={{ animationDelay: `${400 + i * 100}ms` }}>
                    <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(198,217,194,0.12)' }}>
                      <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3" fill="none" stroke="rgba(198,217,194,0.6)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span style={{
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      color: 'rgba(237,232,220,0.35)',
                      letterSpacing: '0.02em'
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal type="right" className="flex flex-col gap-4 sm:gap-5">
              <Link href="/degerleme"
                className="group relative overflow-hidden flex items-center justify-center gap-3 sm:gap-4 text-xs font-bold tracking-[0.12em] uppercase px-10 sm:px-12 py-5 sm:py-6 transition-all duration-500 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #ede8dc 0%, #f5f1e8 100%)',
                  color: '#1e2d1a',
                  boxShadow: '0 4px 32px rgba(237,232,220,0.2)'
                }}>
                <span className="relative z-10 flex items-center gap-3 sm:gap-4">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Değer Hesapla
                  <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
                  style={{ background: 'linear-gradient(135deg, #c6d9c2 0%, #d4e3d0 100%)' }}
                />
              </Link>

              <Link href="/iletisim"
                className="group flex items-center justify-center gap-3 sm:gap-4 text-xs font-bold tracking-[0.12em] uppercase px-10 sm:px-12 py-5 sm:py-6 transition-all duration-400 hover:border-[rgba(237,232,220,0.5)] hover:bg-[rgba(237,232,220,0.03)]"
                style={{
                  border: '1.5px solid rgba(198,217,194,0.2)',
                  color: 'rgba(237,232,220,0.45)'
                }}>
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Danışman Talep Et
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Trust badge */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-4 pt-5 sm:pt-6 border-t border-[rgba(198,217,194,0.1)]">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-[#2e4228]"
                      style={{ background: `rgba(198,217,194,${0.15 + i * 0.05})` }}
                    />
                  ))}
                </div>
                <span style={{
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                  color: 'rgba(237,232,220,0.3)',
                  letterSpacing: '0.02em'
                }}>
                  2,500+ memnun müşteri
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-48 overflow-hidden relative"
        style={{ background: 'linear-gradient(180deg, #fdfcfa 0%, #ede9e1 100%)' }}>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(74,103,65,0.03) 0%, transparent 70%)',
            filter: 'blur(80px) sm:blur(100px)'
          }}
        />

        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 text-center relative">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#d4c9b3] to-transparent" />
              <span style={{
                color: '#a09d98',
                fontFamily: "'DM Mono',monospace",
                fontSize: 'clamp(8px, 2vw, 10px)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontWeight: 500
              }}>
                Mülkünüzü Değerlendirin
              </span>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#d4c9b3] to-transparent" />
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: 'clamp(56px, 14vw, 220px)',
              fontWeight: 700,
              color: '#2c2b28',
              lineHeight: 0.84,
              letterSpacing: '-0.03em',
              marginBottom: '16px sm:24px'
            }}>
              Konuşalım.
            </h2>

            <div className="w-24 sm:w-32 h-1 sm:h-1.5 rounded-full mx-auto mb-10 sm:mb-16"
              style={{ background: 'linear-gradient(90deg, transparent 0%, #d4c9b3 50%, transparent 100%)' }}
            />

            <p style={{
              fontSize: 'clamp(14px, 3.5vw, 17px)',
              color: '#6b6760',
              maxWidth: '540px',
              margin: '0 auto 32px sm:48px',
              lineHeight: 1.85,
              letterSpacing: '0.01em',
              padding: '0 20px'
            }}>
              Size özel çözümler sunmak için buradayız. Uzman ekibimiz, gayrimenkul yolculuğunuzda her adımda yanınızda.
            </p>

            <Link href="/iletisim"
              className="group relative overflow-hidden inline-flex items-center gap-4 sm:gap-5 text-xs font-bold tracking-[0.12em] uppercase px-10 sm:px-14 py-5 sm:py-7 transition-all duration-500 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #2c2b28 0%, #3a3935 100%)',
                color: '#ede8dc',
                boxShadow: '0 8px 40px rgba(44,43,40,0.25)'
              }}>
              <span className="relative z-10 flex items-center gap-4 sm:gap-5">
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden xs:inline">Ücretsiz Değerleme Al</span>
                <span className="xs:hidden">İletişime Geç</span>
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
                style={{ background: 'linear-gradient(135deg, #4a6741 0%, #5a7851 100%)' }}
              />
            </Link>

            {/* Contact info */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-5 sm:gap-8 mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-[rgba(212,201,179,0.25)]">
              {[
                { icon: '📞', text: '+90 (212) 555 0000' },
                { icon: '✉️', text: 'info@emlakpro.com' },
                { icon: '📍', text: 'İstanbul, Türkiye' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <span style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>{item.icon}</span>
                  <span style={{
                    fontSize: 'clamp(11px, 2.8vw, 13px)',
                    color: '#6b6760',
                    letterSpacing: '0.02em'
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}