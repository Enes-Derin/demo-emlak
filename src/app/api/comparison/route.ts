import { NextRequest, NextResponse } from 'next/server'
import type { Property } from '@/types'

export async function POST(req: NextRequest) {
    const { properties }: { properties: Property[] } = await req.json()

    const propertyDetails = properties.map((p, i) => {
        const loc = [p.location?.neighborhood, p.location?.district, p.location?.city].filter(Boolean).join(', ')
        const mPerKare = p.details?.area && p.price
            ? Math.round(p.price / p.details.area).toLocaleString('tr-TR')
            : '?'
        const d = p.details
        const extras = [
            d?.inComplex && 'site içi',
            d?.indoorPool && 'kapalı havuz',
            d?.gym && 'fitness',
            d?.securityCamera && 'güvenlik kamerası',
            d?.parking && `otopark${d.parkingCount ? ` (${d.parkingCount})` : ''}`,
            d?.elevator && 'asansör',
            d?.furnished && 'eşyalı',
            d?.garden && 'bahçe',
            d?.viewSea && 'deniz manzarası',
            d?.viewCity && 'şehir manzarası',
            d?.sauna && 'sauna',
            d?.fireplace && 'şömine',
        ].filter(Boolean).join(', ') || 'Belirtilmemiş'

        return `İLAN ${i + 1}: ${p.title}
Fiyat: ${p.price?.toLocaleString('tr-TR')} ₺ | m²: ~${mPerKare} ₺
Konum: ${loc}
${p.details?.rooms || '?'} oda | ${p.details?.area || '?'}m² brüt${p.details?.netArea ? ` / ${p.details.netArea}m² net` : ''} | ${p.details?.floor != null ? `${p.details.floor}. kat` : '?'}
Bina: ${p.details?.buildingAge != null ? `${p.details.buildingAge} yaşında` : 'Belirtilmemiş'} | Isıtma: ${p.details?.heating || 'Belirtilmemiş'}
Özellikler: ${extras}`
    }).join('\n\n')

    const prompt = `Sen tarafsız ama müşteriyi doğru kararı vermeye yönlendiren deneyimli bir Türk emlak danışmanısın. Müşteri karar vermekte zorlanıyor — ona net, somut ve güven veren bir karşılaştırma sun.

${propertyDetails}

Şu formatta karşılaştır:

## m² Bazında Fiyat Analizi
[Her ilanın m² fiyatını belirt. Fiyat/değer dengesini bölge ortalamasıyla karşılaştır. Hangisi daha rekabetçi ve somut olarak neden — 2-3 cümle]

${properties.map((_, i) => `## İlan ${i + 1} — Güçlü ve Dikkat Edilmesi Gerekenler
✅ [En güçlü somut avantaj — parasal veya pratik değeri ile]
✅ [İkinci somut avantaj]
✅ [Üçüncü somut avantaj]
⚠️ [Nesnel ve bilgilendirici husus — yıkıcı değil]`).join('\n\n')}

## Hangi Profil İçin Hangisi?
**Uzun vadeli yatırım düşünüyorsanız:** İlan [N] — [neden değer kazanma potansiyeli daha yüksek, somut gerekçe]
**Hemen taşınmak istiyorsanız:** İlan [N] — [neden yaşam kalitesi veya pratik avantaj daha fazla]
**Bütçe/değer dengesi öncelikliyse:** İlan [N] — [m² fiyatı ve özellik paketi açısından neden öne çıkıyor]

## Genel Değerlendirme
[2 cümle: Fiyat/değer açısından net bir kazanan belirt ve somut gerekçesini yaz. Müşteriyi harekete geçirecek, baskı yapmayan, güven veren bir kapanış.]

Türkçe, somut, ikna edici, maksimum 320 kelime.`

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
                temperature: 0.45,
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