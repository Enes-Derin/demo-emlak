import { client } from '@/sanity/client'
import { agentsQuery } from '@/sanity/queries'
import { AgentCard } from '@/components/agent/AgentCard'
import type { Agent } from '@/types'

export const revalidate = 60
export const metadata = { title: 'Danışmanlarımız — EmlakPro' }

export default async function DanismanlarPage() {
    const agents: Agent[] = await client.fetch(agentsQuery)

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

            {/* Hero */}
            <div style={{ background: '#3a5432', paddingTop: '7rem', paddingBottom: '4.5rem' }} className="px-6 lg:px-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-7 h-px" style={{ background: 'rgba(198,217,194,0.35)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.45)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            Ekibimiz
                        </span>
                    </div>
                    <h1 className="animate-fade-in-up" style={{
                        fontFamily: "'Playfair Display',Georgia,serif",
                        fontSize: 'clamp(42px,6vw,82px)',
                        fontWeight: 700,
                        color: '#f0ebe0',
                        lineHeight: 1.05,
                        letterSpacing: '-0.01em',
                    }}>
                        Uzman<br />
                        <em style={{ fontStyle: 'italic', color: 'rgba(240,235,224,0.28)' }}>Danışmanlarımız</em>
                    </h1>
                    <p className="mt-4 animate-fade-in delay-150" style={{ color: 'rgba(240,235,224,0.45)', fontSize: '15px', maxWidth: '480px', lineHeight: 1.75 }}>
                        Deneyimli ve güvenilir ekibimiz, en doğru gayrimenkul kararını vermeniz için yanınızda.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
                {agents.length === 0 ? (
                    <div className="text-center py-24" style={{ color: 'var(--ink-muted)' }}>
                        <p style={{ fontSize: '15px' }}>Henüz danışman eklenmemiş.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {agents.map((agent) => (
                            <AgentCard key={agent._id} agent={agent} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}