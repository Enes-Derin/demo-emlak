import type { PropertyDetails } from '@/types'

interface FeatureGroup {
    title: string
    icon: string
    items: { label: string; key: keyof PropertyDetails }[]
}

const FEATURE_GROUPS: FeatureGroup[] = [
    {
        title: 'İç Mekan',
        icon: '🏠',
        items: [
            { label: 'Depo/Kiler', key: 'storage' },
            { label: 'Ankastre Mutfak', key: 'builtInKitchen' },
            { label: 'Beyaz Eşya', key: 'whiteGoods' },
            { label: 'Çelik Kapı', key: 'steelDoor' },
            { label: 'Parke Zemin', key: 'parquetFloor' },
            { label: 'Kablo TV', key: 'cableTv' },
            { label: 'Klima', key: 'airConditioning' },
            { label: 'Isıcam', key: 'doubleGlazing' },
            { label: 'Görüntülü Diyafon', key: 'videoIntercom' },
            { label: 'Gömme Dolap', key: 'builtInWardrobe' },
            { label: 'Giyinme Odası', key: 'dressingRoom' },
            { label: 'Elektrikli Panjur', key: 'electricShutter' },
            { label: 'Merkezi Sıcak Su', key: 'centralHotWater' },
            { label: 'Fırın', key: 'oven' },
            { label: 'Davlumbaz', key: 'rangeHood' },
            { label: 'Vestiyer', key: 'vestibule' },
            { label: 'İnternet', key: 'adsl' },
            { label: 'Kapalı Mutfak', key: 'closedKitchen' },
            { label: 'Sauna', key: 'sauna' },
            { label: 'Şömine', key: 'fireplace' },
            { label: 'Küvet', key: 'bathtub' },
            { label: 'Yardımcı Odası', key: 'staffRoom' },
            { label: 'Barbekü', key: 'barbecue' },
            { label: 'Uydu', key: 'satellite' },
        ],
    },
    {
        title: 'Sosyal Tesisler',
        icon: '🏊',
        items: [
            { label: 'Kapalı Yüzme Havuzu', key: 'indoorPool' },
            { label: 'Kapalı Otopark', key: 'indoorParking' },
            { label: 'Açık Otopark', key: 'openParking' },
            { label: 'Oyun Parkı', key: 'playground' },
            { label: 'Fitness/Gym', key: 'gym' },
            { label: 'Basketbol Sahası', key: 'basketballCourt' },
            { label: 'Çocuk Oyun Odası', key: 'kidsRoom' },
            { label: 'Jeneratör', key: 'generator' },
            { label: 'Su Deposu & Hidrofor', key: 'waterTank' },
            { label: 'Ses İzolasyonu', key: 'soundInsulation' },
            { label: '7/24 Teknik Servis', key: 'technicalService247' },
            { label: 'Güvenlik Kamerası', key: 'securityCamera' },
            { label: 'Kreş', key: 'nursery' },
            { label: 'AVM', key: 'mall' },
            { label: 'Kuru Temizleme', key: 'dryCleaning' },
            { label: 'Kuaför', key: 'hairdresser' },
            { label: 'Market', key: 'market' },
            { label: 'Mescid/Cami', key: 'mosque' },
            { label: 'Cafe & Restaurant', key: 'cafeRestaurant' },
            { label: 'ATM', key: 'atm' },
            { label: 'Banka', key: 'bank' },
            { label: 'Eczane/Medikal', key: 'pharmacy' },
        ],
    },
]

const VIEW_ITEMS = [
    { label: 'Şehir Manzarası', key: 'viewCity' as keyof PropertyDetails },
    { label: 'Deniz Manzarası', key: 'viewSea' as keyof PropertyDetails },
    { label: 'Doğa Manzarası', key: 'viewNature' as keyof PropertyDetails },
    { label: 'Havuz Manzarası', key: 'viewPool' as keyof PropertyDetails },
    { label: 'Site İçinde', key: 'inComplex' as keyof PropertyDetails },
    { label: 'Bahçe', key: 'garden' as keyof PropertyDetails },
]

interface Props {
    details: PropertyDetails
}

export function PropertyFeatures({ details }: Props) {
    const activeViews = VIEW_ITEMS.filter(i => details[i.key])

    return (
        <div className="space-y-6">
            {/* Manzara & Konum */}
            {activeViews.length > 0 && (
                <div className="rounded-xl p-5" style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
                    <h3 className="mb-3" style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        Manzara & Konum
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {activeViews.map(item => (
                            <span key={item.key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>
                                <span style={{ color: 'var(--green)', fontSize: '14px' }}>✓</span>
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Feature groups */}
            {FEATURE_GROUPS.map(group => {
                const activeItems = group.items.filter(i => details[i.key])
                if (activeItems.length === 0) return null

                return (
                    <div key={group.title} className="rounded-xl p-5" style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
                        <h3 className="mb-4" style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                            {group.icon} {group.title}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {activeItems.map(item => (
                                <div key={item.key} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                    style={{ background: 'var(--surface)', border: '1px solid var(--green-light)' }}>
                                    <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 700 }}>✓</span>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}