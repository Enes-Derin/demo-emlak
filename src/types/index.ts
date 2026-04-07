export interface Property {
    _id: string
    title: string
    slug: { current: string }
    status: 'satilik' | 'kiralik' | 'satildi' | 'kiralandi'
    type: 'daire' | 'villa' | 'mustakil' | 'arsa' | 'ofis' | 'dukkan'
    price: number
    mainImage: SanityImage
    images?: SanityImage[]
    description?: any[]
    location: {
        city: string
        district: string
        neighborhood?: string
        address?: string
        lat?: number
        lng?: number
    }
    details: {
        rooms?: string
        bathrooms?: number
        area?: number
        netArea?: number
        floor?: number
        totalFloors?: number
        buildingAge?: number
        heating?: string
        parking?: boolean
        furnished?: boolean
        elevator?: boolean
    }
    agent?: Agent
    featured?: boolean
    publishedAt: string
}

export interface Agent {
    _id: string
    name: string
    slug?: { current: string }
    photo?: SanityImage
    title?: string
    phone?: string
    email?: string
    bio?: string
    propertyCount?: number
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