import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { propertiesQuery } from '@/sanity/queries'
import type { Property } from '@/types'

export async function POST(req: NextRequest) {
    const { messages } = await req.json()

    const properties: Property[] = await client.fetch(propertiesQuery)

    const propertyContext = properties.map((p) => {
        const loc = [p.location?.neighborhood, p.location?.district, p.location?.city].filter(Boolean).join(', ')
        const mPerKare = p.details?.area && p.price
            ? Math.round(p.price / p.details.area).toLocaleString('tr-TR')
            : null
        const details = [
            p.details?.rooms && `${p.details.rooms} oda`,
            p.details?.area && `${p.details.area}m²`,
            p.details?.netArea && `net ${p.details.netArea}m²`,
            p.details?.floor != null && `${p.details.floor}. kat`,
            p.details?.buildingAge != null && `${p.details.buildingAge} yaşında`,
            p.details?.parking && 'otopark',
            p.details?.elevator && 'asansör',
            p.details?.furnished && 'eşyalı',
        ].filter(Boolean).join(', ')

        const statusLabel = p.status === 'satilik' ? 'Satılık' : p.status === 'kiralik' ? 'Kiralık' : p.status

        return `[ID:${p._id}|SLUG:${p.slug?.current}|TITLE:${p.title}] ${statusLabel} | ${p.price?.toLocaleString('tr-TR')} ₺${mPerKare ? ` (m²: ~${mPerKare}₺)` : ''} | ${loc} | ${details} | /ilanlar/${p.slug?.current}`
    }).join('\n')

    const systemPrompt = `Sen deneyimli, sıcak ve güvenilir bir Türk emlak danışmanısın. Butik bir emlak ofisi adına müşterilerle konuşuyorsun.

MEVCUT İLANLAR:
${propertyContext}

RANDEVU ALMA SİSTEMİ — ÇOK ÖNEMLİ:
Müşteri randevu almak istediğinde şu bilgileri sırayla topla (hepsini tek seferde sorma):
1. Ad soyad
2. Telefon numarası  
3. Tercih ettiği tarih ve saat
4. Hangi ilan için (ilgilendikleri ilanı belirt)
5. Varsa ek not

Tüm bilgiler tamamlandığında MUTLAKA şu JSON bloğunu yanıtının sonuna ekle (başka hiçbir şey ekleme, sadece bu format):

RANDEVU_JSON:{"name":"...","phone":"...","datetime":"...","propertyId":"...","propertyTitle":"...","message":"..."}

Örnek: Müşteri adını, telefonunu ve tarihi verdiyse:
RANDEVU_JSON:{"name":"Ahmet Yılmaz","phone":"0532 xxx xx xx","datetime":"Yarın saat 14:00","propertyId":"abc123","propertyTitle":"Kadıköy 3+1 Daire","message":"Çocuklu aile, bahçe tercih eder"}

KONUŞMA KURALLARI:
- Sıcak, samimi ama profesyonel
- Maksimum 4-5 cümle veya 3 madde
- Emoji yok (sadece arada 🏠)
- Her öneride müşteriye özel faydayı vurgula
- İtirazları nazikçe karşıla
- Uygun ilan yoksa dürüstçe söyle

YASAK: Olmayan ilan uydurmak. Kesin fiyat garantisi. Baskıcı dil.`

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map((m: { role: string; content: string }) => ({
                        role: m.role,
                        content: m.content,
                    })),
                ],
                max_tokens: 600,
                temperature: 0.65,
            }),
        })

        const data = await res.json()
        if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })

        let text: string = data.choices?.[0]?.message?.content
        if (!text) return NextResponse.json({ error: 'Boş yanıt' }, { status: 500 })

        // Randevu JSON'ı tespit et
        const jsonMatch = text.match(/RANDEVU_JSON:(\{[\s\S]*?\})/)
        let whatsappUrl: string | null = null

        if (jsonMatch) {
            try {
                const randevuData = JSON.parse(jsonMatch[1])

                // Sanity'e kaydet + WhatsApp URL al
                const leadRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/lead`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(randevuData),
                })
                const leadData = await leadRes.json()
                whatsappUrl = leadData.whatsappUrl || null

                // JSON bloğunu temiz mesajdan çıkar
                text = text.replace(/RANDEVU_JSON:\{[\s\S]*?\}/, '').trim()
            } catch (e) {
                console.error('Randevu JSON parse hatası:', e)
            }
        }

        return NextResponse.json({ reply: text, whatsappUrl })
    } catch (err) {
        console.error('Chatbot error:', err)
        return NextResponse.json({ error: 'Servis şu an kullanılamıyor.' }, { status: 500 })
    }
}