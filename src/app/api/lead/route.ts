import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
})

const WHATSAPP_NUMBER = process.env.EMLAKCI_WHATSAPP_NUMBER!

function buildWhatsAppUrl(fields: {
    name: string
    phone: string
    email?: string
    datetime?: string
    propertyTitle?: string
    message?: string
    source?: string
}) {
    const sourceLabel =
        fields.source === 'chatbot-randevu' ? '🤖 Chatbot Randevusu' :
            fields.source === 'ilan-formu' ? '📋 İlan Formu' :
                fields.source === 'iletisim-formu' ? '📬 İletişim Formu' :
                    '🌐 Web Sitesi'

    const lines = [
        `${sourceLabel}`,
        ``,
        `👤 *Ad Soyad:* ${fields.name}`,
        `📞 *Telefon:* ${fields.phone}`,
        fields.email ? `📧 *E-posta:* ${fields.email}` : null,
        fields.datetime ? `📅 *Randevu:* ${fields.datetime}` : null,
        fields.propertyTitle ? `🏡 *İlan:* ${fields.propertyTitle}` : null,
        fields.message ? `💬 *Mesaj:* ${fields.message}` : null,
        ``,
        `_Tarih: ${new Date().toLocaleString('tr-TR')}_`,
    ].filter((l): l is string => l !== null).join('\n')

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
        name, phone, email, message, subject,
        datetime, propertyId, propertyTitle, source
    } = body

    if (!name || !phone) {
        return NextResponse.json({ error: 'Ad ve telefon zorunludur.' }, { status: 400 })
    }

    const resolvedSource = source || subject || 'website'

    // 1. Sanity'e kaydet
    try {
        const doc: any = {
            _type: 'lead',
            name,
            phone,
            email: email || '',
            message: [datetime && `Randevu: ${datetime}`, message].filter(Boolean).join('\n') || '',
            source: resolvedSource,
            status: 'new',
            createdAt: new Date().toISOString(),
            notes: propertyTitle ? `İlan: ${propertyTitle}` : '',
        }

        if (propertyId) {
            doc.property = { _type: 'reference', _ref: propertyId }
        }

        await writeClient.create(doc)
    } catch (err) {
        console.error('Sanity kayıt hatası:', err)
        // Sanity hata verse bile WhatsApp linkini döndür
    }

    // 2. WhatsApp URL'i oluştur
    const whatsappUrl = buildWhatsAppUrl({
        name, phone, email, datetime, propertyTitle, message, source: resolvedSource
    })

    return NextResponse.json({ success: true, whatsappUrl })
}