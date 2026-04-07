export interface PropertyDetails {
    rooms?: string
    bathrooms?: number
    area?: number
    netArea?: number
    floor?: number
    totalFloors?: number
    buildingAge?: number
    heating?: string
    usageStatus?: string
    deedType?: string
    parkingCount?: number
    // Manzara
    viewCity?: boolean
    viewSea?: boolean
    viewNature?: boolean
    viewPool?: boolean
    // Site
    inComplex?: boolean
    garden?: boolean
    // Temel
    parking?: boolean
    furnished?: boolean
    elevator?: boolean
    // İç Mekan
    storage?: boolean
    builtInKitchen?: boolean
    whiteGoods?: boolean
    steelDoor?: boolean
    parquetFloor?: boolean
    cableTv?: boolean
    airConditioning?: boolean
    doubleGlazing?: boolean
    videoIntercom?: boolean
    builtInWardrobe?: boolean
    dressingRoom?: boolean
    electricShutter?: boolean
    centralHotWater?: boolean
    oven?: boolean
    rangeHood?: boolean
    vestibule?: boolean
    adsl?: boolean
    closedKitchen?: boolean
    sauna?: boolean
    fireplace?: boolean
    bathtub?: boolean
    staffRoom?: boolean
    barbecue?: boolean
    satellite?: boolean
    // Sosyal
    indoorPool?: boolean
    indoorParking?: boolean
    openParking?: boolean
    playground?: boolean
    gym?: boolean
    basketballCourt?: boolean
    kidsRoom?: boolean
    generator?: boolean
    waterTank?: boolean
    soundInsulation?: boolean
    technicalService247?: boolean
    securityCamera?: boolean
    nursery?: boolean
    mall?: boolean
    dryCleaning?: boolean
    hairdresser?: boolean
    market?: boolean
    mosque?: boolean
    cafeRestaurant?: boolean
    atm?: boolean
    bank?: boolean
    pharmacy?: boolean
}

export interface Property {
    _id: string
    title: string
    slug: { current: string }
    status: string
    type: string
    price: number
    mainImage?: any
    images?: any[]
    description?: any[]
    location?: {
        city?: string
        district?: string
        neighborhood?: string
        address?: string
        lat?: number
        lng?: number
    }
    details?: PropertyDetails
    agent?: Agent
    featured?: boolean
    publishedAt?: string
}

export interface Agent {
    _id: string
    name: string
    title?: string
    phone?: string
    email?: string
    photo?: any
}

export interface SanityImage {
    _type: 'image'
    asset: {
        _ref: string
        _type: 'reference'
    }
    hotspot?: {
        x: number
        y: number
        height: number
        width: number
    }
}