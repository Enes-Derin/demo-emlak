import { defineField, defineType } from 'sanity'
import { AIDescriptionInput } from '../../components/AIDescriptionInput'

export const propertySchema = defineType({
    name: 'property',
    title: 'İlan',
    type: 'document',

    // ✅ Gruplar — Sanity sadece aktif grubu render eder, çok daha hızlı
    groups: [
        { name: 'temel', title: '📋 Temel Bilgiler', default: true },
        { name: 'konum', title: '📍 Konum & Harita' },
        { name: 'detaylar', title: '📐 Detaylar' },
        { name: 'ozellikler', title: '✅ Özellikler' },
        { name: 'medya', title: '🖼️ Fotoğraflar' },
        { name: 'yayin', title: '⚙️ Yayın' },
    ],

    fields: [
        // ── TEMEL ──────────────────────────────────────────
        defineField({
            name: 'title',
            title: 'Başlık',
            type: 'string',
            group: 'temel',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            group: 'temel',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'status',
            title: 'Durum',
            type: 'string',
            group: 'temel',
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
            group: 'temel',
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
            group: 'temel',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'description',
            title: 'Açıklama',
            type: 'array',
            group: 'temel',
            of: [{ type: 'block' }],
            components: { input: AIDescriptionInput },
        }),
        defineField({
            name: 'agent',
            title: 'Sorumlu Danışman',
            type: 'reference',
            group: 'temel',
            to: [{ type: 'agent' }],
        }),

        // ── MEDYA ──────────────────────────────────────────
        defineField({
            name: 'mainImage',
            title: 'Ana Fotoğraf',
            type: 'image',
            group: 'medya',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'images',
            title: 'Diğer Fotoğraflar',
            type: 'array',
            group: 'medya',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),

        // ── KONUM ──────────────────────────────────────────
        defineField({
            name: 'location',
            title: 'Konum',
            type: 'object',
            group: 'konum',
            fields: [
                defineField({ name: 'city', title: 'Şehir', type: 'string' }),
                defineField({ name: 'district', title: 'İlçe', type: 'string' }),
                defineField({ name: 'neighborhood', title: 'Mahalle', type: 'string' }),
                defineField({ name: 'address', title: 'Tam Adres', type: 'string' }),
                defineField({
                    name: 'lat',
                    title: 'Enlem (Latitude)',
                    type: 'number',
                    description: 'Google Maps\'ten alabilirsiniz. Örn: 41.0082',
                }),
                defineField({
                    name: 'lng',
                    title: 'Boylam (Longitude)',
                    type: 'number',
                    description: 'Google Maps\'ten alabilirsiniz. Örn: 28.9784',
                }),
            ],
        }),

        // ── DETAYLAR ───────────────────────────────────────
        defineField({
            name: 'details',
            title: 'Detaylar',
            type: 'object',
            group: 'detaylar',
            fields: [
                defineField({ name: 'rooms', title: 'Oda Sayısı', type: 'string', description: 'Örn: 3+1, 2+1' }),
                defineField({ name: 'bathrooms', title: 'Banyo Sayısı', type: 'number' }),
                defineField({ name: 'area', title: 'Brüt m²', type: 'number' }),
                defineField({ name: 'netArea', title: 'Net m²', type: 'number' }),
                defineField({ name: 'floor', title: 'Bulunduğu Kat', type: 'number' }),
                defineField({ name: 'totalFloors', title: 'Toplam Kat', type: 'number' }),
                defineField({ name: 'buildingAge', title: 'Bina Yaşı (yıl)', type: 'number' }),
                defineField({ name: 'heating', title: 'Isıtma', type: 'string', description: 'Örn: Doğalgaz, Merkezi, Klima' }),
                defineField({
                    name: 'usageStatus',
                    title: 'Kullanım Durumu',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Mülk Sahibi', value: 'mulk_sahibi' },
                            { title: 'Kiracılı', value: 'kiracilik' },
                            { title: 'Boş', value: 'bos' },
                        ],
                        layout: 'radio',
                    },
                }),
                defineField({
                    name: 'deedType',
                    title: 'Tapu Tipi',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Kat Mülkiyeti', value: 'kat_mulkiyeti' },
                            { title: 'Kat İrtifakı', value: 'kat_irtifaki' },
                            { title: 'Arsa Tapusu', value: 'arsa_tapusu' },
                            { title: 'Hisseli Tapu', value: 'hisseli' },
                        ],
                        layout: 'radio',
                    },
                }),
                defineField({ name: 'parkingCount', title: 'Otopark Adedi', type: 'number' }),
            ],
        }),

        // ── ÖZELLİKLER ─────────────────────────────────────
        // Tek bir object altında collapsible gruplar halinde
        defineField({
            name: 'details_features',
            title: 'Özellikler',
            type: 'object',
            group: 'ozellikler',
            options: { collapsible: false },
            fields: [
                // Manzara
                defineField({
                    name: 'views',
                    title: '🌅 Manzara',
                    type: 'object',
                    options: { collapsible: true, collapsed: false },
                    fields: [
                        defineField({ name: 'viewCity', title: 'Şehir Manzarası', type: 'boolean', initialValue: false }),
                        defineField({ name: 'viewSea', title: 'Deniz Manzarası', type: 'boolean', initialValue: false }),
                        defineField({ name: 'viewNature', title: 'Doğa Manzarası', type: 'boolean', initialValue: false }),
                        defineField({ name: 'viewPool', title: 'Havuz Manzarası', type: 'boolean', initialValue: false }),
                    ],
                }),
                // Site & Bahçe
                defineField({
                    name: 'site',
                    title: '🏘️ Site & Dış Alan',
                    type: 'object',
                    options: { collapsible: true, collapsed: true },
                    fields: [
                        defineField({ name: 'inComplex', title: 'Site İçinde', type: 'boolean', initialValue: false }),
                        defineField({ name: 'garden', title: 'Bahçe', type: 'boolean', initialValue: false }),
                        defineField({ name: 'parking', title: 'Otopark', type: 'boolean', initialValue: false }),
                        defineField({ name: 'indoorParking', title: 'Kapalı Otopark', type: 'boolean', initialValue: false }),
                        defineField({ name: 'openParking', title: 'Açık Otopark', type: 'boolean', initialValue: false }),
                        defineField({ name: 'barbecue', title: 'Barbekü', type: 'boolean', initialValue: false }),
                    ],
                }),
                // İç Mekan
                defineField({
                    name: 'interior',
                    title: '🛋️ İç Mekan',
                    type: 'object',
                    options: { collapsible: true, collapsed: true },
                    fields: [
                        defineField({ name: 'furnished', title: 'Eşyalı', type: 'boolean', initialValue: false }),
                        defineField({ name: 'elevator', title: 'Asansör', type: 'boolean', initialValue: false }),
                        defineField({ name: 'storage', title: 'Depo/Kiler', type: 'boolean', initialValue: false }),
                        defineField({ name: 'builtInKitchen', title: 'Ankastre Mutfak', type: 'boolean', initialValue: false }),
                        defineField({ name: 'closedKitchen', title: 'Kapalı Mutfak', type: 'boolean', initialValue: false }),
                        defineField({ name: 'whiteGoods', title: 'Beyaz Eşya', type: 'boolean', initialValue: false }),
                        defineField({ name: 'steelDoor', title: 'Çelik Kapı', type: 'boolean', initialValue: false }),
                        defineField({ name: 'parquetFloor', title: 'Parke Zemin', type: 'boolean', initialValue: false }),
                        defineField({ name: 'airConditioning', title: 'Klima', type: 'boolean', initialValue: false }),
                        defineField({ name: 'doubleGlazing', title: 'Isıcam', type: 'boolean', initialValue: false }),
                        defineField({ name: 'builtInWardrobe', title: 'Gömme Dolap', type: 'boolean', initialValue: false }),
                        defineField({ name: 'dressingRoom', title: 'Giyinme Odası', type: 'boolean', initialValue: false }),
                        defineField({ name: 'electricShutter', title: 'Elektrikli Panjur', type: 'boolean', initialValue: false }),
                        defineField({ name: 'centralHotWater', title: 'Merkezi Sıcak Su', type: 'boolean', initialValue: false }),
                        defineField({ name: 'vestibule', title: 'Vestiyer', type: 'boolean', initialValue: false }),
                        defineField({ name: 'sauna', title: 'Sauna', type: 'boolean', initialValue: false }),
                        defineField({ name: 'fireplace', title: 'Şömine', type: 'boolean', initialValue: false }),
                        defineField({ name: 'bathtub', title: 'Küvet', type: 'boolean', initialValue: false }),
                        defineField({ name: 'staffRoom', title: 'Yardımcı Odası', type: 'boolean', initialValue: false }),
                    ],
                }),
                // Teknoloji
                defineField({
                    name: 'tech',
                    title: '📡 Teknoloji & Güvenlik',
                    type: 'object',
                    options: { collapsible: true, collapsed: true },
                    fields: [
                        defineField({ name: 'videoIntercom', title: 'Görüntülü Diyafon', type: 'boolean', initialValue: false }),
                        defineField({ name: 'securityCamera', title: 'Güvenlik Kamerası', type: 'boolean', initialValue: false }),
                        defineField({ name: 'cableTv', title: 'Kablo TV', type: 'boolean', initialValue: false }),
                        defineField({ name: 'satellite', title: 'Uydu', type: 'boolean', initialValue: false }),
                        defineField({ name: 'adsl', title: 'ADSL/Fiber İnternet', type: 'boolean', initialValue: false }),
                        defineField({ name: 'generator', title: 'Jeneratör', type: 'boolean', initialValue: false }),
                        defineField({ name: 'waterTank', title: 'Su Deposu & Hidrofor', type: 'boolean', initialValue: false }),
                        defineField({ name: 'soundInsulation', title: 'Ses İzolasyonu', type: 'boolean', initialValue: false }),
                        defineField({ name: 'technicalService247', title: '7/24 Teknik Servis', type: 'boolean', initialValue: false }),
                    ],
                }),
                // Mutfak & Beyaz Eşya
                defineField({
                    name: 'kitchen',
                    title: '🍳 Mutfak',
                    type: 'object',
                    options: { collapsible: true, collapsed: true },
                    fields: [
                        defineField({ name: 'oven', title: 'Fırın', type: 'boolean', initialValue: false }),
                        defineField({ name: 'rangeHood', title: 'Davlumbaz', type: 'boolean', initialValue: false }),
                    ],
                }),
                // Sosyal Tesisler
                defineField({
                    name: 'social',
                    title: '🏊 Sosyal Tesisler',
                    type: 'object',
                    options: { collapsible: true, collapsed: true },
                    fields: [
                        defineField({ name: 'indoorPool', title: 'Kapalı Yüzme Havuzu', type: 'boolean', initialValue: false }),
                        defineField({ name: 'playground', title: 'Oyun Parkı', type: 'boolean', initialValue: false }),
                        defineField({ name: 'gym', title: 'Fitness/Gym', type: 'boolean', initialValue: false }),
                        defineField({ name: 'basketballCourt', title: 'Basketbol Sahası', type: 'boolean', initialValue: false }),
                        defineField({ name: 'kidsRoom', title: 'Çocuk Oyun Odası', type: 'boolean', initialValue: false }),
                        defineField({ name: 'nursery', title: 'Kreş', type: 'boolean', initialValue: false }),
                        defineField({ name: 'mall', title: 'AVM', type: 'boolean', initialValue: false }),
                        defineField({ name: 'dryCleaning', title: 'Kuru Temizleme', type: 'boolean', initialValue: false }),
                        defineField({ name: 'hairdresser', title: 'Kuaför', type: 'boolean', initialValue: false }),
                        defineField({ name: 'market', title: 'Market', type: 'boolean', initialValue: false }),
                        defineField({ name: 'mosque', title: 'Mescid/Cami', type: 'boolean', initialValue: false }),
                        defineField({ name: 'cafeRestaurant', title: 'Cafe & Restaurant', type: 'boolean', initialValue: false }),
                        defineField({ name: 'atm', title: 'ATM', type: 'boolean', initialValue: false }),
                        defineField({ name: 'bank', title: 'Banka', type: 'boolean', initialValue: false }),
                        defineField({ name: 'pharmacy', title: 'Eczane/Medikal', type: 'boolean', initialValue: false }),
                    ],
                }),
            ],
        }),

        // ── YAYIN ──────────────────────────────────────────
        defineField({
            name: 'featured',
            title: 'Öne Çıkan İlan',
            type: 'boolean',
            group: 'yayin',
            initialValue: false,
        }),
        defineField({
            name: 'publishedAt',
            title: 'Yayın Tarihi',
            type: 'datetime',
            group: 'yayin',
            initialValue: () => new Date().toISOString(),
        }),
    ],

    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
            status: 'status',
            city: 'location.city',
            price: 'price',
        },
        prepare({ title, media, status, city, price }) {
            const statusMap: Record<string, string> = {
                satilik: 'Satılık', kiralik: 'Kiralık',
                satildi: 'Satıldı', kiralandi: 'Kiralandı',
            }
            return {
                title,
                media,
                subtitle: `${statusMap[status] || status} • ${city || ''} • ${price?.toLocaleString('tr-TR')} ₺`,
            }
        },
    },
})