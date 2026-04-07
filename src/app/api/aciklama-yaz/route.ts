import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { title, type, status, location, details } = await req.json()

    const loc = [location?.neighborhood, location?.district, location?.city].filter(Boolean).join(', ')
    const statusLabel = status === 'satilik' ? 'satılık' : status === 'kiralik' ? 'kiralık' : status
    const typeLabel =
        type === 'daire' ? 'daire' : type === 'villa' ? 'villa' :
            type === 'mustakil' ? 'müstakil ev' : type === 'arsa' ? 'arsa' :
                type === 'ofis' ? 'ofis' : type === 'dukkan' ? 'dükkan' : type

    const detailList = [
        details?.rooms && `${details.rooms} oda`,
        details?.bathrooms && `${details.bathrooms} banyo`,
        details?.area && `${details.area} m² brüt`,
        details?.netArea && `${details.netArea} m² net`,
        details?.floor != null && `${details.floor}. kat`,
        details?.totalFloors && `toplam ${details.totalFloors} katlı bina`,
        details?.buildingAge != null && `${details.buildingAge} yaşında bina`,
        details?.heating && `${details.heating} ısıtma`,
        details?.parking && 'otopark mevcut',
        details?.elevator && 'asansör mevcut',
        details?.furnished && 'eşyalı',
    ].filter(Boolean).join(', ')

    const prompt = `Sen profesyonel bir Türk emlak danışmanısın ve ilan metni yazma konusunda uzmansın.

Mülk bilgileri:
- Başlık: ${title || 'Belirtilmemiş'}
- Tip/Durum: ${typeLabel} (${statusLabel})
- Konum: ${loc || 'Belirtilmemiş'}
- Özellikler: ${detailList || 'Belirtilmemiş'}

GÖREV: Bu mülk için alıcı veya kiracıyı harekete geçirecek, profesyonel bir ilan açıklaması yaz.

KURALLAR:
- Yalnızca verilen bilgileri kullan, kesinlikle uydurma detay ekleme
- 3 paragraf, toplam 120-160 kelime
- 1. paragraf: Mülkün en güçlü özelliğini öne çıkaran giriş (konum + tip + ana avantaj)
- 2. paragraf: Somut özellikler (oda, alan, kat, bina yaşı) — bunları fayda diliyle anlat, sadece liste yapma
- 3. paragraf: Pratik avantajlar (otopark, asansör, eşyalı) ve okuyucuyu iletişime geçmeye teşvik eden kapanış
- Samimi ve güven veren Türkçe — ne abartılı ne soğuk
- "Hayalinizdeki ev" gibi klişelerden kaçın
- Emoji yok`

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
                temperature: 0.7,
            }),
        })

        const data = await res.json()
        if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })

        const text = data.choices?.[0]?.message?.content
        return NextResponse.json({ description: text })
    } catch (err) {
        console.error('Açıklama yazma error:', err)
        return NextResponse.json({ error: 'Servis şu an kullanılamıyor.' }, { status: 500 })
    }
}