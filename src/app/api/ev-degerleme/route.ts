import { NextRequest, NextResponse } from 'next/server'

// İstanbul ilçe bazlı güncel m² fiyat rehberi (2025-2026 piyasa verileri)
const ISTANBUL_PRICE_GUIDE: Record<string, { satilik: [number, number]; kiralik: [number, number] }> = {
    'beşiktaş': { satilik: [120000, 180000], kiralik: [35000, 65000] },
    'şişli': { satilik: [90000, 140000], kiralik: [25000, 50000] },
    'kadıköy': { satilik: [95000, 150000], kiralik: [28000, 55000] },
    'üsküdar': { satilik: [70000, 110000], kiralik: [20000, 40000] },
    'beyoğlu': { satilik: [80000, 130000], kiralik: [22000, 45000] },
    'bakırköy': { satilik: [75000, 120000], kiralik: [22000, 42000] },
    'sarıyer': { satilik: [100000, 200000], kiralik: [30000, 70000] },
    'ataşehir': { satilik: [65000, 100000], kiralik: [18000, 35000] },
    'maltepe': { satilik: [50000, 80000], kiralik: [15000, 28000] },
    'kartal': { satilik: [42000, 68000], kiralik: [12000, 22000] },
    'pendik': { satilik: [38000, 60000], kiralik: [11000, 20000] },
    'ümraniye': { satilik: [48000, 78000], kiralik: [14000, 26000] },
    'bayrampaşa': { satilik: [40000, 65000], kiralik: [16000, 28000] },
    'güngören': { satilik: [38000, 60000], kiralik: [14000, 25000] },
    'bağcılar': { satilik: [35000, 56000], kiralik: [12000, 22000] },
    'esenler': { satilik: [32000, 52000], kiralik: [11000, 20000] },
    'sultangazi': { satilik: [28000, 46000], kiralik: [9000, 17000] },
    'gaziosmanpaşa': { satilik: [33000, 54000], kiralik: [11000, 21000] },
    'eyüpsultan': { satilik: [35000, 58000], kiralik: [12000, 22000] },
    'kağıthane': { satilik: [55000, 88000], kiralik: [16000, 30000] },
    'zeytinburnu': { satilik: [55000, 90000], kiralik: [16000, 30000] },
    'fatih': { satilik: [60000, 100000], kiralik: [17000, 32000] },
    'küçükçekmece': { satilik: [36000, 58000], kiralik: [12000, 22000] },
    'beylikdüzü': { satilik: [38000, 62000], kiralik: [13000, 24000] },
    'esenyurt': { satilik: [28000, 46000], kiralik: [9000, 17000] },
    'arnavutköy': { satilik: [25000, 42000], kiralik: [8000, 15000] },
    'başakşehir': { satilik: [40000, 68000], kiralik: [14000, 26000] },
    'silivri': { satilik: [20000, 35000], kiralik: [7000, 13000] },
    'tuzla': { satilik: [35000, 58000], kiralik: [11000, 20000] },
    'sancaktepe': { satilik: [30000, 50000], kiralik: [10000, 18000] },
    'sultanbeyli': { satilik: [25000, 42000], kiralik: [8500, 15000] },
    'çekmeköy': { satilik: [42000, 70000], kiralik: [13000, 24000] },
    'beykoz': { satilik: [50000, 95000], kiralik: [15000, 30000] },
}

// Ankara ilçe bazlı fiyat rehberi
const ANKARA_PRICE_GUIDE: Record<string, { satilik: [number, number]; kiralik: [number, number] }> = {
    'çankaya': { satilik: [45000, 85000], kiralik: [14000, 28000] },
    'keçiören': { satilik: [25000, 42000], kiralik: [8000, 15000] },
    'yenimahalle': { satilik: [28000, 48000], kiralik: [9000, 17000] },
    'mamak': { satilik: [20000, 35000], kiralik: [7000, 13000] },
    'etimesgut': { satilik: [30000, 52000], kiralik: [10000, 18000] },
    'sincan': { satilik: [22000, 38000], kiralik: [7500, 14000] },
    'gölbaşı': { satilik: [28000, 50000], kiralik: [9000, 17000] },
    'pursaklar': { satilik: [22000, 38000], kiralik: [7500, 14000] },
    'altındağ': { satilik: [18000, 32000], kiralik: [6500, 12000] },
}

// İzmir ilçe bazlı fiyat rehberi
const IZMIR_PRICE_GUIDE: Record<string, { satilik: [number, number]; kiralik: [number, number] }> = {
    'konak': { satilik: [50000, 90000], kiralik: [14000, 28000] },
    'karşıyaka': { satilik: [55000, 95000], kiralik: [16000, 32000] },
    'bornova': { satilik: [40000, 70000], kiralik: [12000, 22000] },
    'buca': { satilik: [35000, 60000], kiralik: [10000, 19000] },
    'bayraklı': { satilik: [45000, 80000], kiralik: [13000, 25000] },
    'çiğli': { satilik: [38000, 65000], kiralik: [11000, 21000] },
    'gaziemir': { satilik: [32000, 55000], kiralik: [9500, 18000] },
    'narlıdere': { satilik: [50000, 88000], kiralik: [14000, 27000] },
}

function getPriceGuide(city: string, district: string) {
    const c = city.toLowerCase().trim()
    const d = district.toLowerCase().trim()

    if (c === 'istanbul' || c === 'i̇stanbul') {
        return ISTANBUL_PRICE_GUIDE[d] || null
    }
    if (c === 'ankara') {
        return ANKARA_PRICE_GUIDE[d] || null
    }
    if (c === 'izmir' || c === 'i̇zmir') {
        return IZMIR_PRICE_GUIDE[d] || null
    }
    return null
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
        city, district, neighborhood, type, rooms,
        area, floor, buildingAge, parking, elevator, furnished
    } = body

    const typeLabel =
        type === 'daire' ? 'daire' : type === 'villa' ? 'villa' :
            type === 'mustakil' ? 'müstakil ev' : type === 'ofis' ? 'ofis' :
                type === 'dukkan' ? 'dükkan' : 'arsa'

    const locationStr = [neighborhood, district, city].filter(Boolean).join(', ')

    const features = [
        rooms && `${rooms} oda`,
        area && `${area} m²`,
        floor != null && floor !== '' && `${floor}. kat`,
        buildingAge != null && buildingAge !== '' && `${buildingAge} yıl bina yaşı`,
        parking && 'otopark var',
        elevator && 'asansör var',
        furnished && 'eşyalı',
    ].filter(Boolean).join(', ')

    // Yerel rehberden fiyat aralığı bul
    const priceGuide = getPriceGuide(city || '', district || '')

    let marketContext = ''
    if (priceGuide && area) {
        const areaNum = Number(area)
        const satilikMin = Math.round(priceGuide.satilik[0] * areaNum / 1000) * 1000
        const satilikMax = Math.round(priceGuide.satilik[1] * areaNum / 1000) * 1000
        const kiraMin = priceGuide.kiralik[0]
        const kiraMax = priceGuide.kiralik[1]

        marketContext = `
GÜNCEL PİYASA VERİSİ (2025-2026):
- ${district} bölgesinde m² satış fiyatı: ${priceGuide.satilik[0].toLocaleString('tr-TR')} — ${priceGuide.satilik[1].toLocaleString('tr-TR')} ₺/m²
- ${district} bölgesinde aylık kira: ${kiraMin.toLocaleString('tr-TR')} — ${kiraMax.toLocaleString('tr-TR')} ₺/ay (2+1 ortalama)
- ${area}m² için tahmini satış değeri: ${satilikMin.toLocaleString('tr-TR')} — ${satilikMax.toLocaleString('tr-TR')} ₺
- Bu veriler Hepsiemlak ve Emlakjet 2025-2026 aktif ilan ortalamasına dayanmaktadır`
    }

    const prompt = `${locationStr} konumunda ${typeLabel} değerlemesi yap. ${features}
${marketContext}

Yukarıdaki güncel piyasa verilerini MUTLAKA kullan. Veriden sapma yapma.

Kısa yanıt:
## Tahmini Değer
Satış: ₺X — ₺Y${type === 'daire' || type === 'mustakil' || type === 'villa' ? '\nKira: ₺X/ay — ₺Y/ay' : ''}
m²: ~₺X

## Piyasa Durumu
[2 cümle — bölgenin 2025-2026 durumu]

## Artılar
✅ [madde]
✅ [madde]

## Dikkat
⚠️ [madde]

## Sonuç
[1 cümle]`

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
                max_tokens: 600,
                temperature: 0.2,
            }),
        })

        const data = await res.json()
        if (data.error) {
            console.error('Groq error:', data.error)
            return NextResponse.json({ error: data.error.message }, { status: 500 })
        }

        const text = data.choices?.[0]?.message?.content
        return NextResponse.json({ analysis: text || 'Analiz yapılamadı.' })

    } catch (err) {
        console.error('Değerleme error:', err)
        return NextResponse.json({ error: 'Servis şu an kullanılamıyor.' }, { status: 500 })
    }
}
