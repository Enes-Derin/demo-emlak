import { defineField, defineType } from 'sanity'

export const appointmentSchema = defineType({
    name: 'appointment',
    title: 'Randevu',
    type: 'document',
    fields: [
        defineField({ name: 'clientName', title: 'Müşteri Adı', type: 'string', validation: (R) => R.required() }),
        defineField({ name: 'clientPhone', title: 'Telefon', type: 'string' }),
        defineField({ name: 'clientEmail', title: 'E-posta', type: 'string' }),
        defineField({
            name: 'date',
            title: 'Randevu Tarihi & Saati',
            type: 'datetime',
            validation: (R) => R.required(),
        }),
        defineField({
            name: 'type',
            title: 'Tür',
            type: 'string',
            options: {
                list: [
                    { title: '🏠 Mülk Gezisi', value: 'visit' },
                    { title: '📋 Danışma', value: 'consultation' },
                    { title: '✍️ Sözleşme', value: 'contract' },
                ],
                layout: 'radio',
            },
            initialValue: 'visit',
        }),
        defineField({
            name: 'status',
            title: 'Durum',
            type: 'string',
            options: {
                list: [
                    { title: '⏳ Bekliyor', value: 'pending' },
                    { title: '✅ Onaylandı', value: 'confirmed' },
                    { title: '❌ İptal', value: 'cancelled' },
                    { title: '✔️ Tamamlandı', value: 'completed' },
                ],
                layout: 'radio',
            },
            initialValue: 'pending',
        }),
        defineField({ name: 'property', title: 'İlan', type: 'reference', to: [{ type: 'property' }] }),
        defineField({ name: 'agent', title: 'Danışman', type: 'reference', to: [{ type: 'agent' }] }),
        defineField({ name: 'notes', title: 'Notlar', type: 'text' }),
        defineField({ name: 'createdAt', title: 'Oluşturulma', type: 'datetime', initialValue: () => new Date().toISOString() }),
    ],
    preview: {
        select: { title: 'clientName', date: 'date', status: 'status' },
        prepare({ title, date, status }) {
            const statusMap: Record<string, string> = {
                pending: '⏳', confirmed: '✅', cancelled: '❌', completed: '✔️',
            }
            return {
                title,
                subtitle: `${statusMap[status] || ''} ${date ? new Date(date).toLocaleString('tr-TR') : ''}`,
            }
        },
    },
})