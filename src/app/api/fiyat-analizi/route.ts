import { NextRequest, NextResponse } from 'next/server'
import type { Property } from '@/types'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { property }: { property: Property } = body

    const loc = [property.location?.neighborhood, property.location?.district, property.location?.city].filter(Boolean).join(', ')
    const statusLabel = property.status === 'satilik' ? 'Satılık' : property.status === 'kiralik' ? 'Kiralık' : property.status
    const mPerKare = property.details?.area && property.price
        ? Math.round(property.price / property.details.area).toLocaleString('tr-TR')
        : null

    // Aktif özellikleri say — fiyat savunusunda kullanmak için
    const activeFeatures: string[] = []
    const d = property.details
    if (d) {
        if (d.inComplex) activeFeatures.push('site içinde')
        if (d.indoorPool) activeFeatures.push('kapalı yüzme havuzu')
        if (d.gym) activeFeatures.push('fitness/gym')
        if (d.securityCamera) activeFeatures.push('güvenlik kamerası')
        if (d.technicalService247) activeFeatures.push('7/24 teknik servis')
        if (d.indoorParking || d.parking) activeFeatures.push(`otopark${d.parkingCount ? ` (${d.parkingCount} araçlık)` : ''}`)
        if (d.elevator) activeFeatures.push('asansör')
        if (d.furnished) activeFeatures.push('eşyalı')
        if (d.builtInKitchen) activeFeatures.push('ankastre mutfak')
        if (d.airConditioning) activeFeatures.push('klima')
        if (d.doubleGlazing) activeFeatures.push('ısıcam')
        if (d.sauna) activeFeatures.push('sauna')
        if (d.fireplace) activeFeatures.push('şömine')
        if (d.garden) activeFeatures.push('bahçe')
        if (d.viewSea) activeFeatures.push('deniz manzarası')
        if (d.viewCity) activeFeatures.push('şehir manzarası')
        if (d.soundInsulation) activeFeatures.push('ses izolasyonu')
        if (d.barbecue) activeFeatures.push('barbekü')
    }
    const featuresStr = activeFeatures.length > 0 ? activeFeatures.join(', ') : 'belirtilmemiş'

    const prompt = `Sen Türkiye'de 20 yıllık deneyimi olan, güven veren ve ikna kabiliyeti yüksek bir gayrimenkul danışmanısın. Potansiyel alıcı/kiracı bu ilanın fiyatını sorguluyor. Görevin: fiyatın neden makul — hatta cazip — olduğunu somut verilerle ve ikna edici bir üslupla ortaya koymak. Abartı yok, gerçekçi ol, ama satışı destekle.

İLAN BİLGİLERİ:
- ${property.title} | ${statusLabel}
- Fiyat: ${property.price?.toLocaleString('tr-TR')} ₺${mPerKare ? ` → m² başına ~${mPerKare} ₺` : ''}
- Konum: ${loc}
- ${property.details?.rooms || '?'} oda | ${property.details?.area || '?'}m² brüt / ${property.details?.netArea || '?'}m² net
- Kat: ${property.details?.floor ?? '?'} / ${property.details?.totalFloors ?? '?'} | Bina yaşı: ${property.details?.buildingAge ?? '?'} yıl
- Isıtma: ${property.details?.heating || 'Belirtilmemiş'}
- Özellikler: ${featuresStr}

YAZI FORMATI (tam bu yapıyı kullan, Markdown bold işaretleri dahil):

**Neden Bu Fiyat Makul?**
[2-3 cümle. m² fiyatını bölge ortalamasıyla karşılaştır. "${loc}" bölgesinde bu özellikteki mülklerin genellikle daha yüksek fiyatlandığını belirt. Fiyat/m² değerinin bölge için rekabetçi olduğunu vurgula.]

**Bu İlanda Paranın Karşılığı Ne?**
- [En değerli özellik ve bunun fiyata somut katkısı — örn. "Kapalı otopark İstanbul'da aylık 2.000-4.000₺ değerinde"]
- [İkinci önemli özellik ve değeri]
- [Üçüncü önemli özellik ve değeri]
- [Konumun avantajı — ulaşım, altyapı, gelişim potansiyeli]

**Piyasa Karşılaştırması**
Bu özelliklerdeki benzer mülkler için bölge fiyat aralığı: **[₺ alt] — [₺ üst]**
Bu ilan [alt/orta/üst] segmentte konumlanıyor → [neden bu konumun avantajlı olduğunu 1 cümleyle açıkla]

**Yatırım Perspektifi**
[2 cümle. Bu lokasyonun ve mülk tipinin uzun vadeli değer artış potansiyelini açıkla. Alıcıyı harekete geçirecek, baskı yapmayan, güven veren bir kapanış yap.]

Türkçe yaz. Maksimum 220 kelime. Emoji yok. Somut, güven veren, ikna edici.`

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 900,
                temperature: 0.45,
            }),
        })

        const data = await res.json()
        if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })

        const text = data.choices?.[0]?.message?.content
        if (!text) return NextResponse.json({ error: 'Analiz yapılamadı.' }, { status: 500 })

        return NextResponse.json({ analysis: text })
    } catch (err) {
        console.error('Fiyat analizi error:', err)
        return NextResponse.json({ error: 'Analiz servisi şu anda kullanılamıyor.' }, { status: 500 })
    }
}