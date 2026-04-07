export function formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    }).format(price)
}

export function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(dateString))
}

export const statusLabels: Record<string, string> = {
    satilik: 'Satılık',
    kiralik: 'Kiralık',
    satildi: 'Satıldı',
    kiralandi: 'Kiralandı',
}

export const statusColors: Record<string, string> = {
    satilik: 'bg-blue-600',
    kiralik: 'bg-emerald-600',
    satildi: 'bg-red-500',
    kiralandi: 'bg-amber-500',
}

export const typeLabels: Record<string, string> = {
    daire: 'Daire',
    villa: 'Villa',
    mustakil: 'Müstakil Ev',
    arsa: 'Arsa',
    ofis: 'Ofis',
    dukkan: 'Dükkan',
}