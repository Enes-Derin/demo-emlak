import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/client'
import { propertyBySlugQuery, propertiesQuery } from '@/sanity/queries'
import { urlFor } from '@/lib/sanity-image'
import { formatPrice, formatDate, statusLabels, typeLabels } from '@/lib/utils'
import { PortableText } from '@portabletext/react'
import { ImageGallery } from '@/components/property/ImageGallery'
import { AgentCard } from '@/components/agent/AgentCard'
import type { Property } from '@/types'
import { AIPriceAnalysis } from '@/components/property/AIPriceAnalysis'
import { ContactForm } from '@/components/ContactForm'
import { ShareButtons } from '@/components/property/ShareButtons'
import { PropertyFeatures } from '@/components/property/PropertyFeatures'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
    const properties: Property[] = await client.fetch(propertiesQuery)
    return properties.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const property: Property = await client.fetch(propertyBySlugQuery, { slug })
    if (!property) return { title: 'İlan Bulunamadı' }
    return {
        title: `${property.title} — EmlakPro`,
        description: `${property.location?.city} / ${property.location?.district} — ${formatPrice(property.price)}`,
    }
}

export const revalidate = 60

const softStatusColors: Record<string, string> = {
    satilik: 'bg-[#4a6741] text-[#f0ebe0]',
    kiralik: 'bg-[#b07050] text-[#f7f4ef]',
    default: 'bg-[#8fa888] text-[#f7f4ef]',
}

const USAGE_LABELS: Record<string, string> = {
    mulk_sahibi: 'Mülk Sahibi',
    kiracilik: 'Kiracılı',
    bos: 'Boş',
}

const DEED_LABELS: Record<string, string> = {
    kat_mulkiyeti: 'Kat Mülkiyeti',
    kat_irtifaki: 'Kat İrtifakı',
    arsa_tapusu: 'Arsa Tapusu',
    hisseli: 'Hisseli Tapu',
}

export default async function IlanDetayPage({ params }: PageProps) {
    const { slug } = await params
    const property: Property = await client.fetch(propertyBySlugQuery, { slug })
    if (!property) notFound()

    const { title, status, type, price, mainImage, images, description, location, details, agent, publishedAt } = property

    const allImages = [...(mainImage ? [mainImage] : []), ...(images || [])]

    const detailItems = [
        { label: 'Oda Sayısı', value: details?.rooms, icon: '🛏' },
        { label: 'Banyo', value: details?.bathrooms ? `${details.bathrooms} Banyo` : null, icon: '🚿' },
        { label: 'Brüt Alan', value: details?.area ? `${details.area} m²` : null, icon: '📐' },
        { label: 'Net Alan', value: details?.netArea ? `${details.netArea} m²` : null, icon: '📏' },
        { label: 'Bulunduğu Kat', value: details?.floor != null ? `${details.floor}. Kat` : null, icon: '🏢' },
        { label: 'Toplam Kat', value: details?.totalFloors ? `${details.totalFloors} Kat` : null, icon: '🏗' },
        { label: 'Bina Yaşı', value: details?.buildingAge != null ? `${details.buildingAge} Yıl` : null, icon: '📅' },
        { label: 'Isıtma', value: details?.heating, icon: '🌡' },
        { label: 'Kullanım Durumu', value: details?.usageStatus ? USAGE_LABELS[details.usageStatus] || details.usageStatus : null, icon: '🔑' },
        { label: 'Tapu Tipi', value: details?.deedType ? DEED_LABELS[details.deedType] || details.deedType : null, icon: '📋' },
        { label: 'Otopark Adedi', value: details?.parkingCount ? `${details.parkingCount} Araçlık` : null, icon: '🚗' },
    ].filter((item) => item.value)

    const statusColor = softStatusColors[status] || softStatusColors.default

    return (
        <div className="pt-20 pb-24" style={{ background: 'var(--bg)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 mt-6 mb-8" style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', color: 'var(--ink-muted)' }}>
                    <Link href="/" className="hover:text-[#4a6741] transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <Link href="/ilanlar" className="hover:text-[#4a6741] transition-colors">İlanlar</Link>
                    <span>/</span>
                    <span style={{ color: 'var(--ink-soft)' }} className="line-clamp-1">{title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-8">
                        <ImageGallery images={allImages} title={title} />

                        {/* Title block */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className={`${statusColor} text-xs font-semibold px-3 py-1 rounded-full`}>
                                    {statusLabels[status]}
                                </span>
                                <span className="text-xs font-medium px-3 py-1 rounded-full"
                                    style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>
                                    {typeLabels[type]}
                                </span>
                            </div>
                            <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
                                {title}
                            </h1>
                            {location && (
                                <p className="mt-2 flex items-center gap-1.5" style={{ color: 'var(--ink-soft)', fontSize: '14px' }}>
                                    <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--terra)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {[location.neighborhood, location.district, location.city].filter(Boolean).join(', ')}
                                </p>
                            )}
                            {publishedAt && (
                                <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)', fontFamily: "'DM Mono',monospace" }}>
                                    Yayın tarihi: {formatDate(publishedAt)}
                                </p>
                            )}
                        </div>

                        {/* Temel detaylar */}
                        {detailItems.length > 0 && (
                            <div className="rounded-xl p-6" style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
                                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 600, fontSize: '17px', color: 'var(--ink)', marginBottom: '20px' }}>
                                    İlan Özellikleri
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {detailItems.map((item) => (
                                        <div key={item.label} className="rounded-lg p-3.5"
                                            style={{ background: 'var(--surface)', border: '1px solid var(--bej)' }}>
                                            <p style={{ color: 'var(--ink-muted)', fontSize: '11px', marginBottom: '4px' }}>{item.icon} {item.label}</p>
                                            <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '13px' }}>{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Özellikler checkbox sistemi */}
                        {details && (
                            <div>
                                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
                                    Özellikler
                                </h2>
                                <PropertyFeatures details={details} />
                            </div>
                        )}

                        {/* Açıklama */}
                        {description && description.length > 0 && (
                            <div>
                                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
                                    Açıklama
                                </h2>
                                <div className="prose max-w-none" style={{ color: 'var(--ink-soft)', lineHeight: 1.8 }}>
                                    <PortableText value={description} />
                                </div>
                            </div>
                        )}

                        {/* Konum */}
                        {location?.address && (
                            <div>
                                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
                                    Konum
                                </h2>
                                <div className="rounded-xl h-48 flex items-center justify-center"
                                    style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
                                    <div className="text-center">
                                        <div className="text-3xl mb-2 opacity-40">📍</div>
                                        <p style={{ color: 'var(--ink-soft)', fontSize: '13px' }}>{location.address}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-5">

                            {/* Fiyat kartı */}
                            <div className="rounded-xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-md)' }}>
                                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '2rem', fontWeight: 700, color: 'var(--ink)' }}>
                                    {formatPrice(price)}
                                </div>
                                {status === 'kiralik' && (
                                    <p style={{ color: 'var(--ink-muted)', fontSize: '12px', marginTop: '2px' }}>/ aylık</p>
                                )}
                                <div className="mt-6 space-y-3">
                                    <a href={`tel:${agent?.phone || ''}`}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-colors"
                                        style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Ara
                                    </a>
                                    <a href={`https://wa.me/${agent?.phone?.replace(/\D/g, '') || ''}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-colors"
                                        style={{ background: '#4caf50', color: '#fff' }}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                            <path d="M11.999 0C5.372 0 0 5.372 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.486a.5.5 0 00.609.61l5.803-1.522A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm0 21.818a9.818 9.818 0 01-5.017-1.378l-.36-.214-3.724.976.997-3.648-.234-.374A9.818 9.818 0 012.182 12c0-5.42 4.399-9.818 9.818-9.818 5.42 0 9.819 4.398 9.819 9.818 0 5.42-4.399 9.818-9.82 9.818z" />
                                        </svg>
                                        WhatsApp
                                    </a>
                                </div>
                                <AIPriceAnalysis property={property} />
                            </div>

                            {/* İletişim formu */}
                            <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)', marginBottom: '16px' }}>Bilgi Al</h3>
                                <ContactForm propertyId={property._id} propertyTitle={property.title} />
                            </div>

                            {agent && <AgentCard agent={agent} compact />}

                            {/* Paylaş */}
                            <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-sm)' }}>
                                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                    İlanı Paylaş
                                </p>
                                <ShareButtons title={title} slug={slug} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}