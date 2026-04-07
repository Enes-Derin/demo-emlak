import Image from 'next/image'
import type { Agent } from '@/types'
import { urlFor } from '@/lib/sanity-image'

interface AgentCardProps {
    agent: Agent
    compact?: boolean
}

export function AgentCard({ agent, compact = false }: AgentCardProps) {
    const photoUrl = agent.photo
        ? urlFor(agent.photo).width(400).height(400).fit('crop').url()
        : null

    if (compact) {
        return (
            <div className="rounded-xl p-5"
                style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: '10px',
                    color: 'var(--ink-muted)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                }}>
                    Sorumlu Danışman
                </p>
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0"
                        style={{ background: 'var(--green-pale)', border: '2px solid var(--green-light)' }}>
                        {photoUrl ? (
                            <Image src={photoUrl} alt={agent.name} fill className="object-cover object-center" sizes="48px" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-lg bg-[var(--green-pale)] text-[var(--green)]">
                                {agent.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '14px' }}>{agent.name}</p>
                        {agent.title && (
                            <p style={{ fontSize: '12px', color: 'var(--terra)', fontWeight: 500, marginTop: '2px' }}>
                                {agent.title}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    {agent.phone && (
                        <a href={`tel:${agent.phone}`}
                            className="flex items-center gap-2.5 group transition-colors duration-200"
                            style={{ color: 'var(--ink-soft)', fontSize: '13px' }}>
                            <span className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 hover:bg-[var(--green-light)]"
                                style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)' }}
                            >
                                <svg className="w-4 h-4" style={{ color: 'var(--green)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </span>
                            {agent.phone}
                        </a>
                    )}
                    {agent.email && (
                        <a href={`mailto:${agent.email}`}
                            className="flex items-center gap-2.5 group transition-colors duration-200 truncate"
                            style={{ color: 'var(--ink-soft)', fontSize: '13px' }}>
                            <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 hover:bg-[var(--green-light)]"
                                style={{ background: 'var(--green-pale)', border: '1px solid var(--green-light)' }}
                            >
                                <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--green)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <span className="truncate">{agent.email}</span>
                        </a>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl overflow-hidden card-lift group"
            style={{ background: 'var(--surface)', border: '1px solid var(--bej)' }}>

            {/* Photo */}
            <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--green-pale)' }}>
                {photoUrl ? (
                    <Image
                        src={photoUrl}
                        alt={agent.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--green-pale), var(--bej-light))' }}>
                        <svg className="w-20 h-20" style={{ color: 'var(--green-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: 'linear-gradient(to top, rgba(46,61,42,0.55) 0%, transparent 60%)' }} />

                {agent.propertyCount != null && (
                    <div className="absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(8px)', color: 'var(--green)', border: '1px solid var(--green-light)' }}>
                        {agent.propertyCount} ilan
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, color: 'var(--ink)', fontSize: '18px', lineHeight: 1.25 }}>
                    {agent.name}
                </h3>
                {agent.title && (
                    <p style={{ fontSize: '12px', color: 'var(--terra)', fontWeight: 600, marginTop: '4px', fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>
                        {agent.title}
                    </p>
                )}
                {agent.bio && (
                    <p className="line-clamp-2 mt-3" style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                        {agent.bio}
                    </p>
                )}
                <div className="flex gap-2 mt-5">
                    {agent.phone && (
                        <a
                            href={`tel:${agent.phone}`}
                            className="flex-1 text-center text-xs font-bold tracking-widest uppercase py-3 rounded-lg transition-all duration-200"
                            style={{ background: 'var(--green)', color: '#f7f4ef' }}
                        >
                            Ara
                        </a>
                    )}

                    {agent.email && (
                        <a
                            href={`mailto:${agent.email}`}
                            className="flex-1 text-center text-xs font-bold tracking-widest uppercase py-3 rounded-lg transition-all duration-200 hover:bg-[var(--green-pale)] hover:border-[var(--green-light)] hover:text-[var(--green)]"
                            style={{ border: '1px solid var(--bej)', color: 'var(--ink-soft)' }}
                        >
                            E-posta
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}