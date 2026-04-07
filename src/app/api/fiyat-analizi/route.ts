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

    const prompt = `Sen deneyimli bir Türk gayrimenkul değerleme uzmanısın. Potansiyel alıcı bu ilanı inceliyor ve fiyatın gerçekten mantıklı olup olmadığını merak ediyor. Güven veren, nesnel ama bu ilanın değerini ortaya koyan bir analiz yaz.

İlan:
- ${property.title} | ${statusLabel}
- Fiyat: ${property.price?.toLocaleString('tr-TR')} ₺${mPerKare ? ` → m² başına ~${mPerKare} ₺` : ''}
- Konum: ${loc}
- ${property.details?.rooms || '?'} oda | ${property.details?.area || '?'}m² brüt / ${property.details?.netArea || '?'}m² net
- Kat: ${property.details?.floor ?? '?'} / ${property.details?.totalFloors ?? '?'} | Bina yaşı: ${property.details?.buildingAge ?? '?'} yıl
- Otopark: ${property.details?.parking ? 'Var' : 'Yok'} | Asansör: ${property.details?.elevator ? 'Var' : 'Yok'} | Eşyalı: ${property.details?.furnished ? 'Evet' : 'Hayır'} | Isıtma: ${property.details?.heating || 'Belirtilmemiş'}

Şu formatta analiz yap (maksimum 200 kelime):

**Fiyat Değerlendirmesi**
[m² fiyatını bölge ortalamasıyla karşılaştır — "uygun / piyasaya uygun / biraz yüksek" ve 1-2 cümle gerekçe]

**Bu İlanın Öne Çıkan Yanları**
- [Somut güçlü yön]
- [Somut güçlü yön]
- [Somut güçlü yön]

**Göz Önünde Bulundurulması Gerekenler**
- [Nesnel not — eleştiri değil]
- [Nesnel not]

**Piyasa Değer Aralığı**
Bu özellikteki mülkler için: [₺ alt] — [₺ üst]

**Sonuç**
[1 cümle: Bu fiyat mantıklı mı, müşteri harekete geçmeli mi — güven veren ama baskısız dil]`

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
                max_tokens: 800,
                temperature: 0.5,
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