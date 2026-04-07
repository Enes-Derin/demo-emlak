import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { city, district, neighborhood, type, rooms, area, floor, buildingAge,
        parking, elevator, furnished, indoorPool, gym, garden, viewSea, viewCity, inComplex } = body

    const typeLabel =
        type === 'daire' ? 'daire' : type === 'villa' ? 'villa' :
            type === 'mustakil' ? 'müstakil ev' : type === 'ofis' ? 'ofis' :
                type === 'dukkan' ? 'dükkan' : 'arsa'

    const locationStr = [neighborhood, district, city].filter(Boolean).join(', ')
    const features = [
        rooms && `${rooms} oda`,
        area && `${area} m²`,
        floor != null && floor !== '' && `${floor}. kat`,
        buildingAge != null && buildingAge !== '' && `${buildingAge} yaşında bina`,
        parking && 'otopark',
        elevator && 'asansör',
        furnished && 'eşyalı',
        indoorPool && 'kapalı havuz',
        gym && 'fitness/gym',
        garden && 'bahçe',
        viewSea && 'deniz manzarası',
        viewCity && 'şehir manzarası',
        inComplex && 'site içinde',
    ].filter(Boolean).join(', ')

    const prompt = `Sen Türkiye'de 15 yıllık deneyimi olan, güvenilir ve ikna kabiliyeti yüksek bir gayrimenkul değerleme uzmanısın. 2024-2025 piyasa koşullarını, bölgesel fiyat trendlerini ve Türkiye'deki enflasyonun mülk değerlerine etkisini dikkate alarak değerlendirme yap.

Mülk: ${locationStr} konumunda ${typeLabel} — ${features}

Şu formatta yanıt ver:

## Tahmini Değer Aralığı
Satış: [₺ alt] — [₺ üst]
${type === 'daire' || type === 'mustakil' || type === 'villa' ? 'Kira: [₺/ay alt] — [₺/ay üst]' : ''}

## m² Birim Fiyatı
Bu bölgede ortalama: ~[₺]/m²
Bu mülk için tahmini: ~[₺]/m²
Karşılaştırma: [Bu m² fiyatının neden rekabetçi/avantajlı olduğunu 1 cümleyle açıkla]

## Piyasa Konumu
[Bu mülkün bölgedeki pozisyonunu 2 cümleyle açıkla — segment, talep, rekabet durumu. Mülkün güçlü yönlerini öne çıkar.]

## Değeri Artıran Faktörler
✅ [Somut faktör — parasal veya pratik değeri ile birlikte]
✅ [Somut faktör — parasal veya pratik değeri ile birlikte]
✅ [Somut faktör — parasal veya pratik değeri ile birlikte]

## Dikkat Edilmesi Gerekenler
⚠️ [Nesnel husus — yıkıcı değil, bilgilendirici]
⚠️ [Nesnel husus]

## Yatırım Perspektifi
[2 cümle: Bu lokasyonun uzun vadeli değer artış potansiyeli. Alıcıyı harekete geçirecek ama baskı yapmayan, güven verici bir kapanış.]

Türkçe, somut fiyatlarla, güven veren ikna edici bir dille yaz.`

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
                temperature: 0.4,
            }),
        })

        const data = await res.json()
        if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })

        const text = data.choices?.[0]?.message?.content
        return NextResponse.json({ analysis: text })
    } catch (err) {
        console.error('Değerleme error:', err)
        return NextResponse.json({ error: 'Servis şu an kullanılamıyor.' }, { status: 500 })
    }
}