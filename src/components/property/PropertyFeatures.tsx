import type { PropertyDetailsFeatures } from '@/types'

interface Props {
    features: PropertyDetailsFeatures
}

export function PropertyFeatures({ features }: Props) {
    const { views, site, interior, tech, kitchen, social } = features ?? {}

    const activeViews = [
        views?.viewCity && 'Şehir Manzarası',
        views?.viewSea && 'Deniz Manzarası',
        views?.viewNature && 'Doğa Manzarası',
        views?.viewPool && 'Havuz Manzarası',
        site?.inComplex && 'Site İçinde',
        site?.garden && 'Bahçe',
    ].filter(Boolean) as string[]

    const activeSite = [
        site?.parking && 'Otopark',
        site?.indoorParking && 'Kapalı Otopark',
        site?.openParking && 'Açık Otopark',
        site?.barbecue && 'Barbekü',
    ].filter(Boolean) as string[]

    const activeInterior = [
        interior?.furnished && 'Eşyalı',
        interior?.elevator && 'Asansör',
        interior?.storage && 'Depo/Kiler',
        interior?.builtInKitchen && 'Ankastre Mutfak',
        interior?.closedKitchen && 'Kapalı Mutfak',
        interior?.whiteGoods && 'Beyaz Eşya',
        interior?.steelDoor && 'Çelik Kapı',
        interior?.parquetFloor && 'Parke Zemin',
        interior?.airConditioning && 'Klima',
        interior?.doubleGlazing && 'Isıcam',
        interior?.builtInWardrobe && 'Gömme Dolap',
        interior?.dressingRoom && 'Giyinme Odası',
        interior?.electricShutter && 'Elektrikli Panjur',
        interior?.centralHotWater && 'Merkezi Sıcak Su',
        interior?.vestibule && 'Vestiyer',
        interior?.sauna && 'Sauna',
        interior?.fireplace && 'Şömine',
        interior?.bathtub && 'Küvet',
        interior?.staffRoom && 'Yardımcı Odası',
    ].filter(Boolean) as string[]

    const activeKitchen = [
        kitchen?.oven && 'Fırın',
        kitchen?.rangeHood && 'Davlumbaz',
    ].filter(Boolean) as string[]

    const activeTech = [
        tech?.videoIntercom && 'Görüntülü Diyafon',
        tech?.securityCamera && 'Güvenlik Kamerası',
        tech?.cableTv && 'Kablo TV',
        tech?.satellite && 'Uydu',
        tech?.adsl && 'ADSL/Fiber İnternet',
        tech?.generator && 'Jeneratör',
        tech?.waterTank && 'Su Deposu & Hidrofor',
        tech?.soundInsulation && 'Ses İzolasyonu',
        tech?.technicalService247 && '7/24 Teknik Servis',
    ].filter(Boolean) as string[]

    const activeSocial = [
        social?.indoorPool && 'Kapalı Yüzme Havuzu',
        social?.playground && 'Oyun Parkı',
        social?.gym && 'Fitness/Gym',
        social?.basketballCourt && 'Basketbol Sahası',
        social?.kidsRoom && 'Çocuk Oyun Odası',
        social?.nursery && 'Kreş',
        social?.mall && 'AVM',
        social?.dryCleaning && 'Kuru Temizleme',
        social?.hairdresser && 'Kuaför',
        social?.market && 'Market',
        social?.mosque && 'Mescid/Cami',
        social?.cafeRestaurant && 'Cafe & Restaurant',
        social?.atm && 'ATM',
        social?.bank && 'Banka',
        social?.pharmacy && 'Eczane/Medikal',
    ].filter(Boolean) as string[]

    const groups = [
        { title: 'Site & Dış Alan', icon: '🏘️', items: activeSite },
        { title: 'İç Mekan', icon: '🛋️', items: activeInterior },
        { title: 'Mutfak', icon: '🍳', items: activeKitchen },
        { title: 'Teknoloji & Güvenlik', icon: '📡', items: activeTech },
        { title: 'Sosyal Tesisler', icon: '🏊', items: activeSocial },
    ]

    const hasAny = activeViews.length > 0 || groups.some(g => g.items.length > 0)
    if (!hasAny) return null

    return (
        <div className="space-y-6">
            {activeViews.length > 0 && (
                <FeatureSection title="Manzara & Konum" icon="🌅">
                    <div className="flex flex-wrap gap-2">
                        {activeViews.map(label => <Chip key={label} label={label} />)}
                    </div>
                </FeatureSection>
            )}
            {groups.map(group =>
                group.items.length > 0 ? (
                    <FeatureSection key={group.title} title={group.title} icon={group.icon}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {group.items.map(label => <FeatureItem key={label} label={label} />)}
                        </div>
                    </FeatureSection>
                ) : null
            )}
        </div>
    )
}

function FeatureSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl p-5" style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)' }}>
            <h3 className="mb-3" style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {icon} {title}
            </h3>
            {children}
        </div>
    )
}

function Chip({ label }: { label: string }) {
    return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>
            <span style={{ color: 'var(--green)', fontSize: '14px' }}>✓</span>
            {label}
        </span>
    )
}

function FeatureItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--surface)', border: '1px solid var(--green-light)' }}>
            <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 700 }}>✓</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
        </div>
    )
}