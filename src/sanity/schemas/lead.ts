import { defineField, defineType } from 'sanity'

export const leadSchema = defineType({
    name: 'lead',
    title: 'Müşteri Mesajı',
    type: 'document',
    fields: [
        defineField({ name: 'name', title: 'Ad Soyad', type: 'string' }),
        defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
        defineField({ name: 'email', title: 'E-posta', type: 'string' }),
        defineField({ name: 'message', title: 'Mesaj', type: 'text' }),
        defineField({
            name: 'status',
            title: 'Durum',
            type: 'string',
            options: {
                list: [
                    { title: '🆕 Yeni', value: 'new' },
                    { title: '📞 İletişime Geçildi', value: 'contacted' },
                    { title: '✅ Tamamlandı', value: 'done' },
                    { title: '❌ İptal', value: 'cancelled' },
                ],
                layout: 'radio',
            },
            initialValue: 'new',
        }),
        defineField({
            name: 'property',
            title: 'İlgili İlan',
            type: 'reference',
            to: [{ type: 'property' }],
        }),
        defineField({
            name: 'agent',
            title: 'Atanan Danışman',
            type: 'reference',
            to: [{ type: 'agent' }],
        }),
        defineField({ name: 'source', title: 'Kaynak', type: 'string', initialValue: 'website' }),
        defineField({ name: 'createdAt', title: 'Tarih', type: 'datetime', initialValue: () => new Date().toISOString() }),
        defineField({ name: 'notes', title: 'Notlar', type: 'text' }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'status',
            phone: 'phone',
        },
        prepare({ title, subtitle, phone }) {
            const statusMap: Record<string, string> = {
                new: '🆕 Yeni',
                contacted: '📞 İletişime Geçildi',
                done: '✅ Tamamlandı',
                cancelled: '❌ İptal',
            }
            return { title, subtitle: `${statusMap[subtitle] || subtitle} • ${phone || ''}` }
        },
    },
})