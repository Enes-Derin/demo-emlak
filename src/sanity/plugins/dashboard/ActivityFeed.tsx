// 'use client'

// import { useEffect, useState, useCallback } from 'react'
// import { useClient } from 'sanity'
// import { activityFeedQuery } from '../../queries'
// function toWaNumber(phone: string): string {
//     if (!phone) return ''
//     const digits = phone.replace(/\D/g, '')
//     if (digits.startsWith('0') && digits.length === 11) return '9' + digits
//     if (digits.startsWith('90') && digits.length === 12) return digits
//     if (digits.length === 10) return '90' + digits
//     return digits
// }
// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

//   @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
//   @keyframes shimmer { 0%{background-position:-500px 0}100%{background-position:500px 0} }
//   @keyframes pulse   { 0%,100%{opacity:1}50%{opacity:.35} }
//   @keyframes slideIn { from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)} }

//   .epa *{box-sizing:border-box;margin:0;padding:0}
//   .epa{
//     font-family:'DM Sans',system-ui,sans-serif;
//     background:#f5f4f0; min-height:100vh; color:#1a1a1a;
//   }

//   /* ── Header ─────────────────────────── */
//   .epa-hdr{
//     padding:26px 28px 0;
//     display:flex;align-items:flex-end;justify-content:space-between;
//     animation:fadeUp .4s ease both;
//   }
//   .epa-title{
//     font-family:'Playfair Display',serif;
//     font-size:30px;font-weight:900;letter-spacing:-.02em;color:#1a1a1a;
//   }
//   .epa-sub{font-size:11px;color:#a8a29e;margin-top:3px;letter-spacing:.07em;text-transform:uppercase}
//   .epa-btn{
//     background:#fff;border:1px solid #e7e5e4;color:#78716c;
//     font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
//     padding:7px 16px;border-radius:9px;cursor:pointer;
//     transition:all .2s;font-family:'DM Sans',sans-serif;
//     box-shadow:0 1px 3px rgba(0,0,0,.05);
//   }
//   .epa-btn:hover{border-color:#d6d3d1;color:#1a1a1a;box-shadow:0 2px 6px rgba(0,0,0,.08)}
//   .epa-btn:disabled{opacity:.45;cursor:not-allowed}

//   /* ── Tabs ───────────────────────────── */
//   .epa-tabs{
//     display:flex;gap:2px;margin:20px 28px 0;
//     background:#ece9e4;border-radius:12px;padding:4px;
//     border:1px solid #e7e5e4;
//   }
//   .epa-tab{
//     flex:1;padding:8px 10px;border:none;border-radius:8px;
//     font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;
//     letter-spacing:.07em;text-transform:uppercase;
//     cursor:pointer;transition:all .2s;text-align:center;
//   }
//   .epa-tab-on{background:#fff;color:#1a1a1a;box-shadow:0 1px 4px rgba(0,0,0,.08)}
//   .epa-tab-off{background:transparent;color:#a8a29e}
//   .epa-tab-off:hover{color:#57534e}
//   .epa-tab-cnt{
//     display:inline-block;margin-left:5px;font-size:10px;
//     padding:0 5px;border-radius:99px;font-weight:700;
//   }

//   /* ── Feed list ──────────────────────── */
//   .epa-list{padding:16px 28px 0;display:flex;flex-direction:column;gap:6px}

//   /* ── Feed item base ─────────────────── */
//   .epa-item{
//     background:#fff;border:1px solid #e7e5e4;border-radius:14px;
//     padding:16px 18px;transition:all .25s;
//     animation:fadeUp .45s ease both;
//     box-shadow:0 1px 3px rgba(0,0,0,.04);
//   }
//   .epa-item:hover{border-color:#d6d3d1;box-shadow:0 3px 12px rgba(0,0,0,.08);transform:translateX(3px)}

//   /* ── Type badge ─────────────────────── */
//   .epa-type{
//     font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
//     padding:3px 10px;border-radius:99px;flex-shrink:0;
//   }
//   .epa-t-lead{background:#fef3c7;color:#b45309}
//   .epa-t-appt{background:#dcfce7;color:#15803d}
//   .epa-t-prop{background:#dbeafe;color:#1d4ed8}

//   /* ── Item top row ───────────────────── */
//   .epa-top{display:flex;align-items:flex-start;gap:12px}
//   .epa-body{flex:1;min-width:0}
//   .epa-name{font-size:14px;font-weight:700;color:#1a1a1a}
//   .epa-meta{font-size:12px;color:#78716c;margin-top:3px;line-height:1.5}
//   .epa-quote{
//     font-size:12px;color:#57534e;font-style:italic;
//     margin-top:6px;line-height:1.55;
//     display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
//   }
//   .epa-price{
//     font-family:'Playfair Display',serif;
//     font-size:17px;font-weight:700;color:#b45309;margin-top:3px;
//   }
//   .epa-foot{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}
//   .epa-time{font-size:11px;color:#c4bfba;margin-left:auto;white-space:nowrap}
//   .epa-prop-tag{
//     font-size:11px;color:#78716c;background:#f5f4f0;
//     padding:2px 8px;border-radius:6px;
//   }
//   .epa-phone{font-size:11px;color:#a8a29e}

//   /* Status badges */
//   .epa-st{font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;letter-spacing:.05em}
//   .epa-st-new      {background:#fef2f2;color:#dc2626}
//   .epa-st-contacted{background:#fef3c7;color:#b45309}
//   .epa-st-done     {background:#dcfce7;color:#15803d}
//   .epa-st-cancelled{background:#f5f4f0;color:#a8a29e}
//   .epa-st-pending  {background:#fef3c7;color:#b45309}
//   .epa-st-confirmed{background:#dcfce7;color:#15803d}
//   .epa-st-completed{background:#f5f4f0;color:#a8a29e}

//   .epa-pill-blue  {background:#dbeafe;color:#1d4ed8}
//   .epa-pill-green {background:#dcfce7;color:#15803d}
//   .epa-pill-red   {background:#fef2f2;color:#dc2626}
//   .epa-pill-amber {background:#fef3c7;color:#b45309}

//   /* New dot */
//   .epa-ndot{width:7px;height:7px;border-radius:50%;background:#dc2626;flex-shrink:0;animation:pulse 1.8s infinite}

//   /* Appt time big */
//   .epa-atime{
//     font-family:'Playfair Display',serif;
//     font-size:20px;font-weight:900;color:#b45309;
//     line-height:1;margin:3px 0 2px;
//   }

//   /* ── Empty / skeleton ───────────────── */
//   .epa-empty{text-align:center;padding:56px 0;font-size:13px;color:#c4bfba;font-style:italic}
//   .epa-sk{
//     background:linear-gradient(90deg,#f5f4f0 25%,#ece9e4 50%,#f5f4f0 75%);
//     background-size:500px 100%;animation:shimmer 1.4s infinite;
//     border-radius:12px;height:76px;
//   }

//   /* ── Scrollbar ──────────────────────── */
//   .epa ::-webkit-scrollbar{width:4px}
//   .epa ::-webkit-scrollbar-track{background:transparent}
//   .epa ::-webkit-scrollbar-thumb{background:#e7e5e4;border-radius:4px}

//   @media(max-width:640px){
//     .epa-hdr,.epa-list{padding-left:16px;padding-right:16px}
//     .epa-tabs{margin-left:16px;margin-right:16px}
//     .epa-title{font-size:24px}
//   }
// `

// type ActivityItem = {
//     id: string
//     type: 'lead' | 'appointment' | 'property'
//     title: string
//     time: string
//     raw: any
// }

// export function ActivityFeed() {
//     const client = useClient({ apiVersion: '2024-01-01' })
//     const [items, setItems] = useState<ActivityItem[]>([])
//     const [loading, setLoading] = useState(true)
//     const [refreshing, setRefreshing] = useState(false)
//     const [filter, setFilter] = useState<'all' | 'lead' | 'appointment' | 'property'>('all')
//     const [lastRefresh, setLastRefresh] = useState(new Date())

//     const fetchData = useCallback(() =>
//         client.fetch(activityFeedQuery).then((data: any) => {
//             const leads: ActivityItem[] = (data.leads || []).map((l: any) => ({
//                 id: l._id, type: 'lead', title: l.name, time: l.createdAt, raw: l,
//             }))
//             const apts: ActivityItem[] = (data.appointments || []).map((a: any) => ({
//                 id: a._id, type: 'appointment', title: a.clientName, time: a.createdAt || a.date, raw: a,
//             }))
//             const props: ActivityItem[] = (data.properties || []).map((p: any) => ({
//                 id: p._id, type: 'property', title: p.title, time: p.publishedAt, raw: p,
//             }))
//             const all = [...leads, ...apts, ...props]
//                 .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
//             setItems(all)
//             setLoading(false)
//             setRefreshing(false)
//             setLastRefresh(new Date())
//         }), [client])

//     useEffect(() => {
//         fetchData()
//         const iv = setInterval(fetchData, 30000)
//         return () => clearInterval(iv)
//     }, [fetchData])

//     const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

//     const relTime = (iso: string) => {
//         if (!iso) return ''
//         const diff = Date.now() - new Date(iso).getTime()
//         const m = Math.floor(diff / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24)
//         if (m < 1) return 'Az önce'
//         if (m < 60) return `${m} dk önce`
//         if (h < 24) return `${h} sa önce`
//         if (d === 1) return 'Dün'
//         if (d < 7) return `${d} gün önce`
//         return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
//     }

//     const sLabel: Record<string, string> = {
//         satilik: 'Satılık', kiralik: 'Kiralık', satildi: 'Satıldı', kiralandi: 'Kiralandı',
//     }
//     const sPill: Record<string, string> = {
//         satilik: 'epa-st epa-pill-blue', kiralik: 'epa-st epa-pill-green',
//         satildi: 'epa-st epa-pill-red', kiralandi: 'epa-st epa-pill-amber',
//     }
//     const msLabel: Record<string, string> = {
//         new: 'Yeni', contacted: 'İletişimde', done: 'Tamamlandı', cancelled: 'İptal',
//     }
//     const msCls: Record<string, string> = {
//         new: 'epa-st epa-st-new', contacted: 'epa-st epa-st-contacted',
//         done: 'epa-st epa-st-done', cancelled: 'epa-st epa-st-cancelled',
//     }
//     const aptLabel: Record<string, string> = {
//         pending: 'Bekliyor', confirmed: 'Onaylandı', cancelled: 'İptal', completed: 'Tamamlandı',
//     }
//     const aptCls: Record<string, string> = {
//         pending: 'epa-st epa-st-pending', confirmed: 'epa-st epa-st-confirmed',
//         cancelled: 'epa-st epa-st-cancelled', completed: 'epa-st epa-st-completed',
//     }
//     const tLabel: Record<string, string> = {
//         visit: 'Mülk Gezisi', consultation: 'Danışma', contract: 'Sözleşme',
//     }

//     const tabs = [
//         { key: 'all', label: 'Tümü', count: items.length },
//         { key: 'lead', label: 'Mesajlar', count: items.filter(i => i.type === 'lead').length },
//         { key: 'appointment', label: 'Randevular', count: items.filter(i => i.type === 'appointment').length },
//         { key: 'property', label: 'İlanlar', count: items.filter(i => i.type === 'property').length },
//     ] as const

//     return (
//         <>
//             <style>{css}</style>
//             <div className="epa">

//                 {/* Header */}
//                 <div className="epa-hdr">
//                     <div>
//                         <div className="epa-title">Aktivite</div>
//                         <div className="epa-sub">
//                             Son güncelleme {lastRefresh.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
//                         </div>
//                     </div>
//                     <button className="epa-btn"
//                         onClick={() => { setRefreshing(true); fetchData() }}
//                         disabled={refreshing}>
//                         {refreshing ? 'Yenileniyor' : 'Yenile'}
//                     </button>
//                 </div>

//                 {/* Tabs */}
//                 <div className="epa-tabs">
//                     {tabs.map(t => (
//                         <button key={t.key}
//                             className={`epa-tab ${filter === t.key ? 'epa-tab-on' : 'epa-tab-off'}`}
//                             onClick={() => setFilter(t.key)}>
//                             {t.label}
//                             {t.count > 0 && (
//                                 <span className="epa-tab-cnt" style={{
//                                     background: filter === t.key ? '#f5f4f0' : '#e7e5e4',
//                                     color: filter === t.key ? '#1a1a1a' : '#a8a29e',
//                                 }}>
//                                     {t.count}
//                                 </span>
//                             )}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Feed */}
//                 <div className="epa-list" style={{ paddingBottom: '48px' }}>
//                     {loading ? (
//                         [...Array(7)].map((_, i) => (
//                             <div key={i} className="epa-sk" style={{ animationDelay: `${i * 70}ms` }} />
//                         ))
//                     ) : filtered.length === 0 ? (
//                         <div className="epa-empty">Gösterilecek aktivite yok</div>
//                     ) : (
//                         filtered.map((item, idx) => {
//                             const isNew = Date.now() - new Date(item.time).getTime() < 3600000 * 2

//                             /* ── MESAJ ── */
//                             if (item.type === 'lead') {
//                                 const l = item.raw
//                                 return (
//                                     <div key={item.id} className="epa-item" style={{ animationDelay: `${idx * 35}ms` }}>
//                                         <div className="epa-top">
//                                             <span className="epa-type epa-t-lead">Mesaj</span>
//                                             <div className="epa-body">
//                                                 <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
//                                                     {l.status === 'new' && <div className="epa-ndot" />}
//                                                     <span className="epa-name">{l.name}</span>
//                                                     <span className={msCls[l.status] || 'epa-st'}>{msLabel[l.status] || l.status}</span>
//                                                 </div>
//                                                 {l.message && (
//                                                     <div className="epa-quote">"{l.message}"</div>
//                                                 )}
//                                                 <div className="epa-foot">
//                                                     {l.phone && (
//                                                         <a
//                                                             href={`https://wa.me/${toWaNumber(l.phone)}?text=${encodeURIComponent(
//                                                                 `Merhaba ${l.name}, emlak ofisimizden mesajınıza dönüş yapıyoruz.${l.property?.title ? ` "${l.property.title}" hakkında görüşebilir miyiz?` : ''
//                                                                 }`
//                                                             )}`}
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                             style={{
//                                                                 fontSize: '11px', fontWeight: 700,
//                                                                 color: '#15803d', textDecoration: 'none',
//                                                                 display: 'flex', alignItems: 'center', gap: '3px',
//                                                             }}
//                                                             onClick={e => e.stopPropagation()}
//                                                         >
//                                                             <svg viewBox="0 0 24 24" style={{ width: '11px', height: '11px', fill: '#15803d', flexShrink: 0 }}>
//                                                                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
//                                                                 <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.442A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.031-1.378l-.361-.214-3.741.981.997-3.648-.235-.374A9.862 9.862 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106c5.42 0 9.894 4.474 9.894 9.894 0 5.42-4.474 9.894-9.894 9.894z" />
//                                                             </svg>
//                                                             {l.phone}
//                                                         </a>
//                                                     )}
//                                                     {l.property?.title && <span className="epa-prop-tag">{l.property.title}</span>}
//                                                     <span className="epa-time">{relTime(item.time)}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )
//                             }

//                             /* ── RANDEVU ── */
//                             if (item.type === 'appointment') {
//                                 const a = item.raw
//                                 const d = new Date(a.date)
//                                 return (
//                                     <div key={item.id} className="epa-item" style={{ animationDelay: `${idx * 35}ms` }}>
//                                         <div className="epa-top">
//                                             <span className="epa-type epa-t-appt">Randevu</span>
//                                             <div className="epa-body">
//                                                 <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
//                                                     <span className="epa-name">{a.clientName}</span>
//                                                     <span className={aptCls[a.status] || 'epa-st'}>{aptLabel[a.status] || a.status}</span>
//                                                 </div>
//                                                 <div className="epa-atime">
//                                                     {d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
//                                                 </div>
//                                                 <div className="epa-meta">
//                                                     {d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' })}
//                                                     {' — '}{tLabel[a.type] || a.type}
//                                                 </div>
//                                                 <div className="epa-foot">
//                                                     {a.property?.title && <span className="epa-prop-tag">{a.property.title}</span>}
//                                                     {a.agent?.name && <span className="epa-phone">{a.agent.name}</span>}
//                                                     <span className="epa-time">{relTime(item.time)}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )
//                             }

//                             /* ── İLAN ── */
//                             if (item.type === 'property') {
//                                 const p = item.raw
//                                 return (
//                                     <div key={item.id} className="epa-item" style={{ animationDelay: `${idx * 35}ms` }}>
//                                         <div className="epa-top">
//                                             <span className="epa-type epa-t-prop">İlan</span>
//                                             <div className="epa-body">
//                                                 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
//                                                     <span className="epa-name">{p.title}</span>
//                                                     <span className={sPill[p.status] || 'epa-st'}>{sLabel[p.status] || p.status}</span>
//                                                 </div>
//                                                 <div className="epa-price">{p.price?.toLocaleString('tr-TR')} ₺</div>
//                                                 <div className="epa-foot">
//                                                     {p.city && <span className="epa-prop-tag">{p.city}</span>}
//                                                     <span className="epa-time">{relTime(item.time)}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )
//                             }

//                             return null
//                         })
//                     )}
//                 </div>
//             </div>
//         </>
//     )
// }