import { client } from '@/sanity/client'
import { agentsQuery } from '@/sanity/queries'
import { AgentCard } from '@/components/agent/AgentCard'
import type { Agent } from '@/types'

export const revalidate = 60
export const metadata = { title: 'Danışmanlarımız — EmlakPro' }

export default async function DanismanlarPage() {
    const agents: Agent[] = await client.fetch(agentsQuery)

    return (
        <div className="min-h-screen" style={{ background: '#f7f4ef' }}>

            {/* Hero */}
            <div className="relative overflow-hidden" style={{ background: '#1e2d1a', paddingTop: '7rem', paddingBottom: '5rem' }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(74,103,65,0.2) 0%, transparent 70%)' }}
                />
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-5 h-px" style={{ background: 'rgba(198,217,194,0.3)' }} />
                        <span style={{ color: 'rgba(198,217,194,0.35)', fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            Ekibimiz
                        </span>
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(46px,7vw,92px)', fontWeight: 700, color: '#ede8dc', lineHeight: 0.92, letterSpacing: '-0.02em' }}>
                        Uzman<br />
                        <em style={{ fontStyle: 'italic', color: 'rgba(237,232,220,0.16)', fontWeight: 300 }}>Danışmanlarımız</em>
                    </h1>
                    <p className="mt-6" style={{ color: 'rgba(237,232,220,0.35)', fontSize: '15px', maxWidth: '420px', lineHeight: 1.8 }}>
                        Deneyimli ekibimiz en doğru gayrimenkul kararını vermeniz için her adımda yanınızda.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
                {agents.length === 0 ? (
                    <div className="text-center py-24" style={{ color: '#a09d98' }}>
                        <p style={{ fontSize: '15px' }}>Henüz danışman eklenmemiş.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {agents.map((agent, i) => (
                            <div key={agent._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                                <AgentCard agent={agent} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}