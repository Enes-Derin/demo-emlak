import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
})

// Bu route'u yetkisiz erişimden koru
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(req: NextRequest) {
    // Vercel cron doğrulaması
    const authHeader = req.headers.get('authorization')
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        const cutoff = oneMonthAgo.toISOString()

        // 1 aydan eski lead'leri bul
        const oldLeads = await writeClient.fetch(
            `*[_type == "lead" && createdAt < $cutoff]._id`,
            { cutoff }
        )

        if (oldLeads.length === 0) {
            return NextResponse.json({
                success: true,
                deleted: 0,
                message: 'Silinecek kayıt yok.'
            })
        }

        // Transaction ile toplu sil
        const transaction = writeClient.transaction()
        oldLeads.forEach((id: string) => transaction.delete(id))
        await transaction.commit()

        console.log(`Cleanup: ${oldLeads.length} lead silindi.`)

        return NextResponse.json({
            success: true,
            deleted: oldLeads.length,
            message: `${oldLeads.length} eski kayıt silindi.`
        })
    } catch (err) {
        console.error('Cleanup error:', err)
        return NextResponse.json({ error: 'Silme işlemi başarısız.' }, { status: 500 })
    }
}