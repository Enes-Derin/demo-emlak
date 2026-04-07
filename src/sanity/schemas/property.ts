import { defineField, defineType } from 'sanity'
import { AIDescriptionInput } from '../../components/AIDescriptionInput'


export const propertySchema = defineType({
    name: 'property',
    title: 'İlan',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Başlık',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'status',
            title: 'Durum',
            type: 'string',
            options: {
                list: [
                    { title: 'Satılık', value: 'satilik' },
                    { title: 'Kiralık', value: 'kiralik' },
                    { title: 'Satıldı', value: 'satildi' },
                    { title: 'Kiralandı', value: 'kiralandi' },
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'type',
            title: 'Tip',
            type: 'string',
            options: {
                list: [
                    { title: 'Daire', value: 'daire' },
                    { title: 'Villa', value: 'villa' },
                    { title: 'Müstakil Ev', value: 'mustakil' },
                    { title: 'Arsa', value: 'arsa' },
                    { title: 'Ofis', value: 'ofis' },
                    { title: 'Dükkan', value: 'dukkan' },
                ],
                layout: 'dropdown',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Fiyat (₺)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'mainImage',
            title: 'Ana Fotoğraf',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'images',
            title: 'Diğer Fotoğraflar',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'description',
            title: 'Açıklama',
            type: 'array',
            of: [{ type: 'block' }],
            components: {
                input: AIDescriptionInput,
            },
        }),
        defineField({
            name: 'location',
            title: 'Konum',
            type: 'object',
            fields: [
                defineField({ name: 'city', title: 'Şehir', type: 'string' }),
                defineField({ name: 'district', title: 'İlçe', type: 'string' }),
                defineField({ name: 'neighborhood', title: 'Mahalle', type: 'string' }),
                defineField({ name: 'address', title: 'Tam Adres', type: 'string' }),
                defineField({ name: 'lat', title: 'Enlem', type: 'number' }),
                defineField({ name: 'lng', title: 'Boylam', type: 'number' }),
            ],
        }),
        defineField({
            name: 'details',
            title: 'Detaylar',
            type: 'object',
            fields: [
                defineField({ name: 'rooms', title: 'Oda Sayısı', type: 'string' }),
                defineField({ name: 'bathrooms', title: 'Banyo Sayısı', type: 'number' }),
                defineField({ name: 'area', title: 'Brüt m²', type: 'number' }),
                defineField({ name: 'netArea', title: 'Net m²', type: 'number' }),
                defineField({ name: 'floor', title: 'Bulunduğu Kat', type: 'number' }),
                defineField({ name: 'totalFloors', title: 'Toplam Kat', type: 'number' }),
                defineField({ name: 'buildingAge', title: 'Bina Yaşı', type: 'number' }),
                defineField({ name: 'heating', title: 'Isıtma', type: 'string' }),
                defineField({
                    name: 'parking',
                    title: 'Otopark',
                    type: 'boolean',
                    initialValue: false,
                }),
                defineField({
                    name: 'furnished',
                    title: 'Eşyalı',
                    type: 'boolean',
                    initialValue: false,
                }),
                defineField({
                    name: 'elevator',
                    title: 'Asansör',
                    type: 'boolean',
                    initialValue: false,
                }),
            ],
        }),
        defineField({
            name: 'agent',
            title: 'Sorumlu Danışman',
            type: 'reference',
            to: [{ type: 'agent' }],
        }),
        defineField({
            name: 'featured',
            title: 'Öne Çıkan İlan',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'publishedAt',
            title: 'Yayın Tarihi',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
            status: 'status',
            city: 'location.city',
        },
        prepare(selection) {
            const { title, media, status, city } = selection
            const statusMap: Record<string, string> = {
                satilik: '🔵 Satılık',
                kiralik: '🟢 Kiralık',
                satildi: '🔴 Satıldı',
                kiralandi: '🟡 Kiralandı',
            }
            return {
                title,
                media,
                subtitle: `${statusMap[status] || status} • ${city || ''}`,
            }
        },
    },
})