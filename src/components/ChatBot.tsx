'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Message {
    role: 'user' | 'assistant'
    content: string
    whatsappUrl?: string
}

const SUGGESTIONS = [
    'Bütçeme uygun kiralık daire arıyorum',
    'Yatırım için hangi ilan daha iyi?',
    'Otoparklı ve asansörlü seçenek var mı?',
    'Randevu almak istiyorum',
]

function formatMessage(text: string) {
    const linkRegex = /\/ilanlar\/[a-z0-9-]+/g
    const parts = text.split(linkRegex)
    const links = text.match(linkRegex) || []
    if (links.length === 0) return <span className="whitespace-pre-line">{text}</span>
    return (
        <span className="whitespace-pre-line">
            {parts.map((part, i) => (
                <span key={i}>
                    {part}
                    {links[i] && (
                        <Link href={links[i]}
                            className="inline-flex items-center gap-1 underline underline-offset-2 font-semibold"
                            style={{ color: 'var(--green)' }}>
                            İlanı Gör →
                        </Link>
                    )}
                </span>
            ))}
        </span>
    )
}

export function ChatBot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Merhaba! 🏠 Size en uygun evi bulmak için buradayım.\n\nKiralık mı arıyorsunuz, satın almayı mı düşünüyorsunuz?' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [unread, setUnread] = useState(0)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100) }
    }, [open])

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    const send = async (text?: string) => {
        const content = text || input.trim()
        if (!content || loading) return
        const userMsg: Message = { role: 'user', content }
        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setInput('')
        setLoading(true)
        try {
            const res = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            })
            const data = await res.json()
            const reply = data.reply || 'Üzgünüm, bir hata oluştu.'
            const whatsappUrl: string | undefined = data.whatsappUrl || undefined
            setMessages(prev => [...prev, { role: 'assistant', content: reply, whatsappUrl }])
            if (!open) setUnread(n => n + 1)
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Bağlantı hatası.' }])
        }
        setLoading(false)
    }

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'var(--green)', color: '#f7f4ef', boxShadow: '0 8px 32px rgba(74,103,65,0.35)' }}
                aria-label="Emlak Asistanı"
            >
                {open ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background: 'var(--terra)', color: '#fff' }}>
                                {unread}
                            </span>
                        )}
                    </>
                )}
            </button>

            {/* Window */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[560px] rounded-xl flex flex-col overflow-hidden animate-scale-in"
                    style={{ background: 'var(--surface)', border: '1px solid var(--bej)', boxShadow: 'var(--shadow-lg)' }}>

                    {/* Header */}
                    <div className="px-4 py-3 flex items-center gap-3"
                        style={{ background: '#3a5432', borderBottom: '1px solid rgba(198,217,194,0.12)' }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                            style={{ background: 'rgba(198,217,194,0.15)' }}>
                            🏠
                        </div>
                        <div>
                            <p style={{ color: '#f0ebe0', fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 600, fontSize: '14px' }}>
                                Emlak Asistanı
                            </p>
                            <p style={{ color: 'rgba(198,217,194,0.5)', fontSize: '11px', fontFamily: "'DM Mono',monospace" }}>
                                Yapay zeka destekli
                            </p>
                        </div>
                        <div className="ml-auto w-2 h-2 rounded-full" style={{ background: '#6b8f62' }} />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                                <div
                                    className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                                    style={msg.role === 'user'
                                        ? { background: 'var(--green)', color: '#f7f4ef', borderBottomRightRadius: '4px' }
                                        : { background: 'var(--bej-light)', color: 'var(--ink)', borderBottomLeftRadius: '4px', border: '1px solid var(--bej)' }
                                    }
                                >
                                    {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                                </div>

                                {/* WhatsApp butonu — sadece randevu tamamlandığında çıkar */}
                                {msg.whatsappUrl && (
                                    <a
                                        href={msg.whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 max-w-[85%] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02]"
                                        style={{ background: '#25D366', color: '#fff' }}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current flex-shrink-0">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.442A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.031-1.378l-.361-.214-3.741.981.997-3.648-.235-.374A9.862 9.862 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106c5.42 0 9.894 4.474 9.894 9.894 0 5.42-4.474 9.894-9.894 9.894z" />
                                        </svg>
                                        Randevuyu WhatsApp ile Onayla
                                    </a>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-3 rounded-2xl flex gap-1 items-center"
                                    style={{ background: 'var(--bej-light)', border: '1px solid var(--bej)', borderBottomLeftRadius: '4px' }}>
                                    {[0, 150, 300].map(delay => (
                                        <span key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce"
                                            style={{ background: 'var(--green-mid)', animationDelay: `${delay}ms` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Suggestions */}
                    {messages.length === 1 && (
                        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                            {SUGGESTIONS.map(s => (
                                <button key={s} onClick={() => send(s)}
                                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                                    style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-light)' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--green-light)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--green-pale)'}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--bej)' }}>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && send()}
                            placeholder="Mesajınızı yazın..."
                            className="flex-1 text-sm rounded-xl px-3 py-2.5 outline-none transition-all duration-200"
                            style={{
                                background: 'var(--bej-light)',
                                border: '1px solid var(--bej)',
                                color: 'var(--ink)',
                                caretColor: 'var(--green)',
                            }}
                            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-light)'}
                            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--bej)'}
                        />
                        <button
                            onClick={() => send()}
                            disabled={!input.trim() || loading}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-40"
                            style={{ background: 'var(--green)', color: '#f7f4ef' }}>
                            <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}