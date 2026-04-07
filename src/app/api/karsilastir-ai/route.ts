import { NextRequest, NextResponse } from 'next/server'
import type { Property } from '@/types'

export async function POST(req: NextRequest) {
    const { properties }: { properties: Property[] } = await req.json()

    const propertyDetails = properties.map((p, i) => {
        const loc = [p.location?.neighborhood, p.location?.district, p.location?.city].filter(Boolean).join(', ')
        const mPerKare = p.details?.area && p.price
            ? Math.round(p.price / p.details.area).toLocaleString('tr-TR')
            : '?'
        const ekstralar = [
            p.details?.parking && 'Otopark',
            p.details?.elevator && 'Asansör',
            p.details?.furnished && 'Eşyalı',
        ].filter(Boolean).join(', ') || 'Yok'

        return `İLAN ${i + 1}: ${p.title}
Fiyat: ${p.price?.toLocaleString('tr-TR')} ₺ | m²: ~${mPerKare} ₺
Konum: ${loc}
${p.details?.rooms || '?'} oda | ${p.details?.area || '?'}m² brüt${p.details?.netArea ? ` / ${p.details.netArea}m² net` : ''} | ${p.details?.floor != null ? `${p.details.floor}. kat` : '?'}
Bina: ${p.details?.buildingAge != null ? `${p.details.buildingAge} yaşında` : 'Belirtilmemiş'} | Isıtma: ${p.details?.heating || 'Belirtilmemiş'}
Ekstralar: ${ekstralar}`
    }).join('\n\n')

    const prompt = `Sen tarafsız ve deneyimli bir Türk emlak danışmanısın. Müşteri karar vermekte zorlanıyor — ona net ve dürüst bir karşılaştırma sun.

${propertyDetails}

Şu formatta karşılaştır:

## m² Bazında Fiyat Karşılaştırması
[Her ilanın m² fiyatını yan yana ver. Hangisi daha avantajlı ve neden — 1-2 cümle]

${properties.map((_, i) => `## İlan ${i + 1} — Güçlü ve Zayıf Yanlar
✅ [Somut avantaj]
✅ [Somut avantaj]
⚠️ [Dikkat edilmesi gereken somut husus]`).join('\n\n')}

## Hangi Profil İçin Hangisi?
**Uzun vadeli yatırım düşünüyorsanız:** İlan [N] daha uygun — [kısa gerekçe]
**Hemen taşınmak istiyorsanız:** İlan [N] daha uygun — [kısa gerekçe]
**Bütçe öncelikliyse:** İlan [N] öne çıkıyor — [kısa gerekçe]

## Genel Değerlendirme
[2 cümle: Fiyat/değer açısından kazananı belirt. Müşteriyi harekete geçirecek ama baskı yapmayan bir kapanış]

Türkçe, somut, güven veren bir dille yaz. Maksimum 300 kelime.`

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
                max_tokens: 1024,
                temperature: 0.5,
            }),
        })

        const data = await res.json()
        if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })

        const text = data.choices?.[0]?.message?.content
        return NextResponse.json({ analysis: text })
    } catch (err) {
        console.error('Karşılaştırma AI error:', err)
        return NextResponse.json({ error: 'Servis şu an kullanılamıyor.' }, { status: 500 })
    }
}