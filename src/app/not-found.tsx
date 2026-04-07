import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-stone-50 to-white">
            <div className="text-center animate-fade-in-up">
                <div className="text-[120px] font-black text-stone-100 leading-none select-none">404</div>
                <div className="text-4xl mb-4 -mt-4">🏚️</div>
                <h1 className="text-2xl font-bold text-stone-900 mt-2">Sayfa Bulunamadı</h1>
                <p className="text-stone-500 mt-3 max-w-sm mx-auto">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
                <div className="flex gap-3 justify-center mt-8">
                    <Link href="/" className="bg-stone-900 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-amber-500/30">
                        Ana Sayfaya Dön
                    </Link>
                    <Link href="/ilanlar" className="border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-700 hover:bg-amber-50 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200">
                        İlanlara Bak
                    </Link>
                </div>
            </div>
        </div>
    )
}