'use client'

import { useEffect, useState, useCallback } from 'react'
import { useClient } from 'sanity'
import { dashboardStatsQuery } from '../../queries'
import { formatPrice } from '../../../lib/utils'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0}to{opacity:1} }
  @keyframes shimmer  { 0%{background-position:-500px 0}100%{background-position:500px 0} }
  @keyframes slideBar { from{width:0}to{width:var(--w)} }
  @keyframes ringPulse{
    0%  {box-shadow:0 0 0 0 rgba(217,119,6,.35)}
    70% {box-shadow:0 0 0 9px rgba(217,119,6,0)}
    100%{box-shadow:0 0 0 0 rgba(217,119,6,0)}
  }
  @keyframes countUp  { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }

  /* ── Reset & base ───────────────────────── */
  .epd *{box-sizing:border-box;margin:0;padding:0}
  .epd{
    font-family:'DM Sans',system-ui,sans-serif;
    background:#f5f4f0;
    min-height:100vh;
    color:#1a1a1a;
  }

  /* ── Topbar ─────────────────────────────── */
  .epd-top{
    display:flex;align-items:center;justify-content:space-between;
    padding:24px 28px 0;flex-wrap:wrap;gap:12px;
    animation:fadeIn .4s ease both;
  }
  .epd-brand{
    font-family:'Playfair Display',serif;
    font-size:18px;font-weight:900;letter-spacing:-.02em;color:#1a1a1a;
  }
  .epd-brand-accent{color:#b45309}
  .epd-date{font-size:11px;color:#a8a29e;letter-spacing:.07em;text-transform:uppercase;margin-top:3px}
  .epd-btn{
    background:#fff;border:1px solid #e7e5e4;color:#78716c;
    font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
    padding:7px 16px;border-radius:9px;cursor:pointer;
    transition:all .2s;font-family:'DM Sans',sans-serif;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  }
  .epd-btn:hover{border-color:#d6d3d1;color:#1a1a1a;box-shadow:0 2px 6px rgba(0,0,0,.08)}
  .epd-btn:disabled{opacity:.45;cursor:not-allowed}

  /* ── Alert banner ───────────────────────── */
  .epd-alert{
    margin:16px 28px 0;
    background:#fffbeb;border:1px solid #fde68a;
    border-radius:12px;padding:14px 18px;
    display:flex;align-items:center;justify-content:space-between;gap:14px;
    animation:fadeUp .4s ease both;
  }
  .epd-alert-left{display:flex;align-items:center;gap:10px}
  .epd-alert-dot{width:8px;height:8px;border-radius:50%;background:#d97706;animation:ringPulse 2s infinite;flex-shrink:0}
  .epd-alert-text{font-size:13px;color:#92400e;font-weight:600}
  .epd-alert-sub{font-size:11px;color:#b45309;margin-top:2px}
  .epd-alert-cta{
    background:#d97706;color:#fff;border:none;
    font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
    padding:7px 14px;border-radius:8px;cursor:pointer;white-space:nowrap;
    font-family:'DM Sans',sans-serif;transition:background .2s;flex-shrink:0;
  }
  .epd-alert-cta:hover{background:#b45309}

  /* ── Hero metrics ───────────────────────── */
  .epd-metrics{
    display:grid;grid-template-columns:repeat(2,1fr);
    gap:1px;background:#e7e5e4;
    margin:16px 28px 0;border-radius:14px;overflow:hidden;
    border:1px solid #e7e5e4;
    animation:fadeUp .5s ease both;animation-delay:.05s;
  }
  @media(min-width:900px){.epd-metrics{grid-template-columns:repeat(4,1fr)}}
  .epd-metric{background:#fff;padding:22px;cursor:default;transition:background .2s}
  .epd-metric:hover{background:#fafaf9}
  .epd-mval{
    font-family:'Playfair Display',serif;
    font-size:38px;font-weight:900;line-height:1;letter-spacing:-.03em;
    color:#1a1a1a;animation:countUp .7s ease both;
  }
  .epd-mval.amber{color:#b45309}
  .epd-mval.green{color:#15803d}
  .epd-mlabel{font-size:12px;color:#a8a29e;margin-top:8px;font-weight:500}
  .epd-msub{font-size:11px;color:#d4cfc9;margin-top:3px}
  .epd-mbadge{display:inline-block;font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;margin-top:8px}
  .epd-mb-up  {background:#dcfce7;color:#15803d}
  .epd-mb-warn{background:#fef3c7;color:#b45309}

  /* ── Section label ──────────────────────── */
  .epd-lbl{
    font-size:10px;font-weight:700;letter-spacing:.14em;
    text-transform:uppercase;color:#c4bfba;margin-bottom:14px;
  }

  /* ── Row layouts ────────────────────────── */
  .epd-row{margin:16px 28px 0;display:grid;gap:12px}
  .epd-r2{grid-template-columns:1fr}
  @media(min-width:900px){.epd-r2{grid-template-columns:3fr 2fr}}
  .epd-r3{grid-template-columns:1fr}
  @media(min-width:700px){.epd-r3{grid-template-columns:1fr 1fr}}
  @media(min-width:1100px){.epd-r3{grid-template-columns:1fr 1fr 1fr}}

  /* ── Card ───────────────────────────────── */
  .epd-card{
    background:#fff;border:1px solid #e7e5e4;border-radius:14px;padding:22px;
    animation:fadeUp .55s ease both;
    box-shadow:0 1px 4px rgba(0,0,0,.04);
  }

  /* ══════════════════════════════════════════
     MESAJ KARTI — Ana özellik
  ══════════════════════════════════════════ */
  .epd-msg-item{
    border:1px solid #f5f4f0;border-radius:12px;
    padding:16px;margin-bottom:10px;
    transition:all .2s;cursor:default;
    background:#fafaf9;
  }
  .epd-msg-item:last-child{margin-bottom:0}
  .epd-msg-item:hover{border-color:#d6d3d1;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.06)}
  .epd-msg-item.priority-high{
    border-left:3px solid #dc2626;
    background:#fff5f5;
  }
  .epd-msg-item.priority-high:hover{border-color:#dc2626;border-left-color:#dc2626}
  .epd-msg-item.priority-med{
    border-left:3px solid #d97706;
    background:#fffdf5;
  }
  .epd-msg-item.priority-med:hover{border-color:#d97706;border-left-color:#d97706}
  .epd-msg-item.priority-low{
    border-left:3px solid #e7e5e4;
    background:#fafaf9;
  }

  /* Header satırı */
  .epd-msg-head{
    display:flex;align-items:flex-start;justify-content:space-between;gap:10px;
    margin-bottom:10px;
  }
  .epd-msg-left{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .epd-msg-name{font-size:15px;font-weight:700;color:#1a1a1a}
  .epd-msg-ndot{
    width:7px;height:7px;border-radius:50%;background:#dc2626;
    flex-shrink:0;animation:ringPulse 1.8s infinite;
  }
  .epd-msg-right{display:flex;align-items:center;gap:6px;flex-shrink:0}

  /* Zaman etiketi */
  .epd-msg-time{font-size:11px;color:#a8a29e;white-space:nowrap}

  /* Durum rozeti */
  .epd-msg-status{font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;letter-spacing:.05em;white-space:nowrap}
  .epd-ms-new     {background:#fef2f2;color:#dc2626}
  .epd-ms-contacted{background:#fef3c7;color:#b45309}
  .epd-ms-done    {background:#dcfce7;color:#15803d}
  .epd-ms-cancelled{background:#f5f4f0;color:#a8a29e}

  /* Öncelik rozeti */
  .epd-priority{font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;letter-spacing:.06em}
  .epd-pri-high  {background:#fef2f2;color:#dc2626}
  .epd-pri-med   {background:#fef3c7;color:#b45309}
  .epd-pri-low   {background:#f5f4f0;color:#a8a29e}

  /* İletişim bilgileri grid */
  .epd-msg-contacts{
    display:flex;flex-wrap:wrap;gap:6px 16px;
    margin-bottom:10px;
  }
  .epd-msg-contact{
    display:flex;align-items:center;gap:5px;
    font-size:12px;color:#57534e;
  }
  .epd-contact-label{font-size:10px;color:#a8a29e;font-weight:600;text-transform:uppercase;letter-spacing:.06em}

  /* Mesaj içeriği */
  .epd-msg-body{
    font-size:13px;color:#44403c;line-height:1.6;
    background:#fff;border:1px solid #e7e5e4;border-radius:8px;
    padding:10px 12px;margin-bottom:10px;
    font-style:italic;
  }
  .epd-msg-nobody{
    font-size:12px;color:#c4bfba;font-style:italic;
    padding:8px 0;
  }

  /* Alt bilgi satırı */
  .epd-msg-footer{
    display:flex;align-items:center;justify-content:space-between;
    flex-wrap:wrap;gap:6px;
  }
  .epd-msg-source{
    font-size:11px;color:#a8a29e;
    display:flex;align-items:center;gap:4px;
  }
  .epd-msg-prop{
    font-size:11px;color:#78716c;font-weight:500;
    background:#f5f4f0;padding:3px 8px;border-radius:6px;
  }
  .epd-msg-date{font-size:11px;color:#c4bfba}

  /* ── Randevu ────────────────────────────── */
  .epd-apt{padding:14px 0;border-bottom:1px solid #f5f4f0}
  .epd-apt:first-child{padding-top:0}
  .epd-apt:last-child{border-bottom:none;padding-bottom:0}
  .epd-apt-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
  .epd-apt-name{font-size:14px;font-weight:700;color:#1a1a1a}
  .epd-apt-time{
    font-family:'Playfair Display',serif;
    font-size:24px;font-weight:900;color:#b45309;
    line-height:1;margin:4px 0 2px;
  }
  .epd-apt-meta{font-size:11px;color:#a8a29e;margin-top:1px}
  .epd-apt-status{font-size:10px;font-weight:700;padding:3px 10px;border-radius:99px;letter-spacing:.05em;flex-shrink:0}
  .epd-as-pending  {background:#fef3c7;color:#b45309}
  .epd-as-confirmed{background:#dcfce7;color:#15803d}
  .epd-as-cancelled{background:#fef2f2;color:#dc2626}
  .epd-as-completed{background:#f5f4f0;color:#a8a29e}

  /* ── Bar grafik ─────────────────────────── */
  .epd-bar{margin-bottom:12px}
  .epd-bar:last-child{margin-bottom:0}
  .epd-bar-lbl{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}
  .epd-bar-n{color:#a8a29e}
  .epd-bar-v{color:#1a1a1a;font-weight:700}
  .epd-bar-track{height:4px;background:#f5f4f0;border-radius:2px;overflow:hidden}
  .epd-bar-fill{height:4px;border-radius:2px;animation:slideBar 1s cubic-bezier(.16,1,.3,1) both}

  /* ── İlan satırı ────────────────────────── */
  .epd-prop{padding:12px 0;border-bottom:1px solid #f5f4f0;display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
  .epd-prop:first-child{padding-top:0}
  .epd-prop:last-child{border-bottom:none;padding-bottom:0}
  .epd-prop-t{font-size:13px;font-weight:600;color:#1a1a1a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:190px}
  .epd-prop-p{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#b45309}
  .epd-prop-m{font-size:11px;color:#a8a29e;margin-top:2px}

  /* ── Durum pill ─────────────────────────── */
  .epd-pill{font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;flex-shrink:0;letter-spacing:.04em}
  .epd-p-blue  {background:#dbeafe;color:#1d4ed8}
  .epd-p-green {background:#dcfce7;color:#15803d}
  .epd-p-red   {background:#fef2f2;color:#dc2626}
  .epd-p-amber {background:#fef3c7;color:#b45309}

  /* ── Quick stats 2x2 ────────────────────── */
  .epd-qs{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#e7e5e4;border-radius:12px;overflow:hidden}
  .epd-qs-cell{background:#fff;padding:18px;transition:background .2s}
  .epd-qs-cell:hover{background:#fafaf9}
  .epd-qs-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#c4bfba;font-weight:600}
  .epd-qs-val{font-family:'Playfair Display',serif;font-size:30px;font-weight:900;color:#1a1a1a;letter-spacing:-.02em;line-height:1;margin-top:6px}
  .epd-qs-sub{font-size:11px;color:#d4cfc9;margin-top:3px}

  /* ── Tip kutusu ─────────────────────────── */
  .epd-tip{
    margin-top:14px;padding:14px;
    background:#fffdf5;border-radius:10px;border:1px solid #fde68a;
  }
  .epd-tip-lbl{font-size:10px;color:#b45309;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px}
  .epd-tip-text{font-size:12px;color:#92400e;line-height:1.5}

  /* ── Empty ──────────────────────────────── */
  .epd-empty{text-align:center;padding:32px 0;font-size:13px;color:#c4bfba;font-style:italic}

  /* ── Skeleton ───────────────────────────── */
  .epd-sk{
    background:linear-gradient(90deg,#f5f4f0 25%,#eceae7 50%,#f5f4f0 75%);
    background-size:500px 100%;animation:shimmer 1.4s infinite;border-radius:10px;
  }

  /* ── Scrollbar ──────────────────────────── */
  .epd ::-webkit-scrollbar{width:4px}
  .epd ::-webkit-scrollbar-track{background:transparent}
  .epd ::-webkit-scrollbar-thumb{background:#e7e5e4;border-radius:4px}
  .epd ::-webkit-scrollbar-thumb:hover{background:#d6d3d1}

  /* ── Responsive ─────────────────────────── */
  @media(max-width:640px){
    .epd-top,.epd-row{padding-left:16px;padding-right:16px;margin-left:0;margin-right:0}
    .epd-metrics{margin-left:16px;margin-right:16px}
    .epd-alert{margin-left:16px;margin-right:16px}
    .epd-mval{font-size:28px}
  }
`

/* ── Öncelik hesaplama ────────────────────── */
function calcPriority(lead: any): 'high' | 'med' | 'low' {
    const ageHours = (Date.now() - new Date(lead.createdAt).getTime()) / 3600000
    if (lead.status === 'new' && ageHours < 2) return 'high'
    if (lead.status === 'new' && ageHours < 24) return 'med'
    return 'low'
}

function toWaNumber(phone: string): string {
    if (!phone) return ''
    const digits = phone.replace(/\D/g, '')
    // Türk numarası: 05xx → 905xx
    if (digits.startsWith('0') && digits.length === 11) {
        return '9' + digits
    }
    // Zaten 90 ile başlıyorsa
    if (digits.startsWith('90') && digits.length === 12) {
        return digits
    }
    // Başka ülke kodu yoksa 90 ekle
    if (digits.length === 10) {
        return '90' + digits
    }
    return digits
}

export function DashboardWidget() {
    const client = useClient({ apiVersion: '2024-01-01' })
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [expandedMsgs, setExpandedMsgs] = useState<Set<string>>(new Set())

    const fetchStats = useCallback(() =>
        client.fetch(dashboardStatsQuery).then((data: any) => {
            setStats(data); setLoading(false); setRefreshing(false)
        }), [client])

    useEffect(() => { fetchStats() }, [fetchStats])

    const toggleExpand = (id: string) =>
        setExpandedMsgs(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })

    const relTime = (iso: string) => {
        if (!iso) return ''
        const d = Date.now() - new Date(iso).getTime()
        const m = Math.floor(d / 60000), h = Math.floor(m / 60), day = Math.floor(h / 24)
        if (m < 1) return 'Az önce'
        if (m < 60) return `${m} dakika önce`
        if (h < 24) return `${h} saat önce`
        if (day === 1) return 'Dün'
        if (day < 7) return `${day} gün önce`
        return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
    }

    const fullDate = (iso: string) =>
        new Date(iso).toLocaleString('tr-TR', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })

    const sLabel: Record<string, string> = {
        satilik: 'Satılık', kiralik: 'Kiralık', satildi: 'Satıldı', kiralandi: 'Kiralandı',
    }
    const sPill: Record<string, string> = {
        satilik: 'epd-pill epd-p-blue', kiralik: 'epd-pill epd-p-green',
        satildi: 'epd-pill epd-p-red', kiralandi: 'epd-pill epd-p-amber',
    }
    const aLabel: Record<string, string> = {
        pending: 'Bekliyor', confirmed: 'Onaylandı', cancelled: 'İptal', completed: 'Tamamlandı',
    }
    const aCls: Record<string, string> = {
        pending: 'epd-apt-status epd-as-pending',
        confirmed: 'epd-apt-status epd-as-confirmed',
        cancelled: 'epd-apt-status epd-as-cancelled',
        completed: 'epd-apt-status epd-as-completed',
    }
    const msLabel: Record<string, string> = {
        new: 'Yeni', contacted: 'İletişimde', done: 'Tamamlandı', cancelled: 'İptal',
    }
    const msCls: Record<string, string> = {
        new: 'epd-msg-status epd-ms-new',
        contacted: 'epd-msg-status epd-ms-contacted',
        done: 'epd-msg-status epd-ms-done',
        cancelled: 'epd-msg-status epd-ms-cancelled',
    }
    const priLabel: Record<string, string> = { high: 'Acil', med: 'Öncelikli', low: 'Normal' }
    const priCls: Record<string, string> = {
        high: 'epd-priority epd-pri-high',
        med: 'epd-priority epd-pri-med',
        low: 'epd-priority epd-pri-low',
    }
    const tLabel: Record<string, string> = {
        visit: 'Mülk Gezisi', consultation: 'Danışma', contract: 'Sözleşme',
    }
    const typeColors: Record<string, string> = {
        daire: '#3b82f6', villa: '#b45309', mustakil: '#15803d',
        arsa: '#dc2626', ofis: '#7c3aed', dukkan: '#ea580c',
    }
    const typeLabelMap: Record<string, string> = {
        daire: 'Daire', villa: 'Villa', mustakil: 'Müstakil',
        arsa: 'Arsa', ofis: 'Ofis', dukkan: 'Dükkan',
    }

    if (loading) return (
        <>
            <style>{css}</style>
            <div className="epd" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="epd-sk" style={{ height: '110px', flex: 1, animationDelay: `${i * 70}ms` }} />
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="epd-sk" style={{ height: '260px', animationDelay: `${i * 60}ms` }} />
                    ))}
                </div>
            </div>
        </>
    )

    const maxType = Math.max(...(stats.propertiesByType || []).map((t: any) => t.count), 1)
    const dateStr = new Date().toLocaleDateString('tr-TR', {
        weekday: 'long', day: 'numeric', month: 'long',
    })

    /* Mesajları önceliğe göre sırala */
    const sortedLeads = [...(stats.recentLeads || [])].sort((a: any, b: any) => {
        const order = { high: 0, med: 1, low: 2 }
        return order[calcPriority(a)] - order[calcPriority(b)]
    })

    return (
        <>
            <style>{css}</style>
            <div className="epd" style={{ paddingBottom: '52px' }}>

                {/* ── Topbar ── */}
                <div className="epd-top">
                    <div>
                        <div className="epd-brand">EMLAK<span className="epd-brand-accent">PRO</span></div>
                        <div className="epd-date">{dateStr}</div>
                    </div>
                    <button className="epd-btn" onClick={() => { setRefreshing(true); fetchStats() }} disabled={refreshing}>
                        {refreshing ? 'Yenileniyor...' : 'Yenile'}
                    </button>
                </div>

                {/* ── Alert ── */}
                {stats.newLeads > 0 && (
                    <div className="epd-alert">
                        <div className="epd-alert-left">
                            <div className="epd-alert-dot" />
                            <div>
                                <div className="epd-alert-text">
                                    {stats.newLeads} yeni müşteri mesajı yanıt bekliyor
                                </div>
                                <div className="epd-alert-sub">
                                    İlk 1 saat içinde yanıt dönüşümü 7 kat artırır
                                </div>
                            </div>
                        </div>
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_EMLAKCI_WHATSAPP?.replace(/\D/g, '') || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="epd-alert-cta"
                            style={{ textDecoration: 'none' }}
                        >
                            WhatsApp Aç
                        </a>
                    </div>
                )}

                {/* ── Metrics ── */}
                <div className="epd-metrics">
                    {[
                        {
                            val: stats.totalProperties, cls: '',
                            label: 'Toplam İlan', sub: `${stats.activeListings} aktif yayında`,
                            badge: stats.activeListings > 0 ? 'epd-mbadge epd-mb-up' : null,
                            badgeText: `${stats.activeListings} yayında`,
                        },
                        {
                            val: stats.newLeads, cls: stats.newLeads > 0 ? 'amber' : '',
                            label: 'Yeni Mesaj', sub: `${stats.totalLeads} toplam müşteri`,
                            badge: stats.newLeads > 0 ? 'epd-mbadge epd-mb-warn' : null,
                            badgeText: 'Yanıt bekliyor',
                        },
                        {
                            val: stats.pendingAppointments, cls: stats.pendingAppointments > 0 ? 'amber' : '',
                            label: 'Bekleyen Randevu', sub: `${stats.totalAppointments} toplam`,
                            badge: null, badgeText: '',
                        },
                        {
                            val: stats.avgPrice ? formatPrice(Math.round(stats.avgPrice)) : '—', cls: 'green',
                            label: 'Ortalama Fiyat', sub: `${stats.soldListings} tamamlandı`,
                            badge: stats.soldListings > 0 ? 'epd-mbadge epd-mb-up' : null,
                            badgeText: `${stats.soldListings} satış`,
                        },
                    ].map((m, i) => (
                        <div className="epd-metric" key={i} style={{ animationDelay: `${i * 60}ms` }}>
                            <div className={`epd-mval ${m.cls}`}>{m.val}</div>
                            <div className="epd-mlabel">{m.label}</div>
                            <div className="epd-msub">{m.sub}</div>
                            {m.badge && <div className={m.badge}>{m.badgeText}</div>}
                        </div>
                    ))}
                </div>

                {/* ════════════════════════════════════════
            Row 1: Mesajlar (geniş) + Randevular
        ════════════════════════════════════════ */}
                <div className="epd-row epd-r2">

                    {/* MESAJLAR — tam detay */}
                    <div className="epd-card" style={{ animationDelay: '0.12s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div className="epd-lbl" style={{ margin: 0 }}>Müşteri Mesajları</div>
                            {stats.newLeads > 0 && (
                                <span style={{
                                    fontSize: '11px', fontWeight: 700, background: '#fef2f2',
                                    color: '#dc2626', padding: '3px 10px', borderRadius: '99px',
                                }}>
                                    {stats.newLeads} yeni
                                </span>
                            )}
                        </div>

                        {sortedLeads.length === 0 ? (
                            <div className="epd-empty">Henüz mesaj yok</div>
                        ) : (
                            sortedLeads.map((l: any) => {
                                const pri = calcPriority(l)
                                const isExpanded = expandedMsgs.has(l._id)

                                return (
                                    <div
                                        key={l._id}
                                        className={`epd-msg-item priority-${pri}`}
                                        onClick={() => toggleExpand(l._id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {/* ── Mesaj başlığı ── */}
                                        <div className="epd-msg-head">
                                            <div className="epd-msg-left">
                                                {l.status === 'new' && <div className="epd-msg-ndot" />}
                                                <span className="epd-msg-name">{l.name}</span>
                                                <span className={msCls[l.status] || 'epd-msg-status'}>{msLabel[l.status] || l.status}</span>
                                                {pri !== 'low' && (
                                                    <span className={priCls[pri]}>{priLabel[pri]}</span>
                                                )}
                                            </div>
                                            <div className="epd-msg-right">
                                                <span className="epd-msg-time">{relTime(l.createdAt)}</span>
                                                <span style={{
                                                    fontSize: '10px', color: '#c4bfba',
                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                                                    transition: 'transform .2s', display: 'inline-block',
                                                }}>▾</span>
                                            </div>
                                        </div>

                                        {/* ── İletişim bilgileri — her zaman görünür ── */}
                                        <div className="epd-msg-contacts">
                                            {l.phone && (
                                                <div className="epd-msg-contact">
                                                    <span className="epd-contact-label">Tel</span>
                                                    <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{l.phone}</span>
                                                </div>
                                            )}
                                            {l.email && (
                                                <div className="epd-msg-contact">
                                                    <span className="epd-contact-label">Mail</span>
                                                    <span>{l.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Mesaj içeriği — her zaman görünür ── */}
                                        {l.message ? (
                                            <div className="epd-msg-body">"{l.message}"</div>
                                        ) : (
                                            <div className="epd-msg-nobody">Mesaj içeriği girilmemiş</div>
                                        )}

                                        {/* ── Genişletilmiş detay ── */}
                                        {isExpanded && (
                                            <div style={{
                                                borderTop: '1px solid #f5f4f0', marginTop: '10px', paddingTop: '10px',
                                                animation: 'fadeUp .25s ease both',
                                            }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                                                    <div>
                                                        <div className="epd-contact-label" style={{ marginBottom: '3px' }}>Tam Tarih</div>
                                                        <div style={{ fontSize: '12px', color: '#57534e' }}>{fullDate(l.createdAt)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="epd-contact-label" style={{ marginBottom: '3px' }}>Kaynak</div>
                                                        <div style={{ fontSize: '12px', color: '#57534e', textTransform: 'capitalize' }}>
                                                            {l.source || 'Web sitesi'}
                                                        </div>
                                                    </div>
                                                    {l.property?.title && (
                                                        <div style={{ gridColumn: '1 / -1' }}>
                                                            <div className="epd-contact-label" style={{ marginBottom: '3px' }}>İlgili İlan</div>
                                                            <div className="epd-msg-prop">{l.property.title}</div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Hızlı aksiyon butonları */}
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {l.phone && (
                                                        <a
                                                            href={`tel:${l.phone}`}
                                                            onClick={e => e.stopPropagation()}
                                                            style={{
                                                                fontSize: '11px', fontWeight: 700, padding: '6px 12px',
                                                                borderRadius: '8px', background: '#1a1a1a', color: '#fff',
                                                                textDecoration: 'none', display: 'inline-block', letterSpacing: '.04em',
                                                            }}
                                                        >
                                                            Ara
                                                        </a>
                                                    )}
                                                    {l.phone && (
                                                        <a
                                                            href={`https://wa.me/${toWaNumber(l.phone)}?text=${encodeURIComponent(
                                                                `Merhaba ${l.name}, emlak ofisimizden mesajınıza dönüş yapıyoruz.${l.property?.title ? ` "${l.property.title}" hakkında görüşebilir miyiz?` : ''
                                                                }`
                                                            )}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={e => e.stopPropagation()}
                                                            style={{
                                                                fontSize: '11px', fontWeight: 700, padding: '6px 12px',
                                                                borderRadius: '8px', background: '#15803d', color: '#fff',
                                                                textDecoration: 'none', display: 'inline-block', letterSpacing: '.04em',
                                                            }}
                                                        >
                                                            WhatsApp
                                                        </a>
                                                    )}
                                                    {l.email && (
                                                        <a
                                                            href={`mailto:${l.email}`}
                                                            onClick={e => e.stopPropagation()}
                                                            style={{
                                                                fontSize: '11px', fontWeight: 700, padding: '6px 12px',
                                                                borderRadius: '8px', background: '#fff', color: '#1a1a1a',
                                                                border: '1px solid #e7e5e4', textDecoration: 'none',
                                                                display: 'inline-block', letterSpacing: '.04em',
                                                            }}
                                                        >
                                                            E-posta Gönder
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Alt footer */}
                                        <div className="epd-msg-footer" style={{ marginTop: '8px' }}>
                                            <span className="epd-msg-date">
                                                {new Date(l.createdAt).toLocaleDateString('tr-TR', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                })}
                                            </span>
                                            {!isExpanded && l.property?.title && (
                                                <span className="epd-msg-prop">{l.property.title}</span>
                                            )}
                                            <span style={{ fontSize: '11px', color: '#c4bfba' }}>
                                                {isExpanded ? 'Kapat ▲' : 'Detay ▾'}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* RANDEVULAR */}
                    <div className="epd-card" style={{ animationDelay: '0.18s' }}>
                        <div className="epd-lbl">Yaklaşan Randevular</div>
                        {stats.upcomingAppointments.length === 0 ? (
                            <div className="epd-empty">Yaklaşan randevu yok</div>
                        ) : (
                            stats.upcomingAppointments.map((a: any) => {
                                const d = new Date(a.date)
                                return (
                                    <div className="epd-apt" key={a._id}>
                                        <div className="epd-apt-row">
                                            <div>
                                                <div className="epd-apt-name">{a.clientName}</div>
                                                <div className="epd-apt-time">
                                                    {d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="epd-apt-meta">
                                                    {d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' })}
                                                </div>
                                                <div className="epd-apt-meta" style={{ marginTop: '2px' }}>
                                                    {tLabel[a.type] || a.type}
                                                </div>
                                                {a.property?.title && (
                                                    <div className="epd-apt-meta" style={{ marginTop: '3px', color: '#78716c' }}>
                                                        {a.property.title}
                                                    </div>
                                                )}
                                                {a.agent?.name && (
                                                    <div className="epd-apt-meta">{a.agent.name}</div>
                                                )}
                                            </div>
                                            <span className={aCls[a.status] || 'epd-apt-status'}>
                                                {aLabel[a.status] || a.status}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* ════════════════════════════════════════
            Row 2: Dağılım + İlanlar + Özet
        ════════════════════════════════════════ */}
                <div className="epd-row epd-r3">

                    {/* Tip dağılımı */}
                    <div className="epd-card" style={{ animationDelay: '0.22s' }}>
                        <div className="epd-lbl">Tip Dağılımı</div>
                        {(stats.propertiesByType || []).filter((t: any) => t.count > 0).map((item: any, i: number) => (
                            <div className="epd-bar" key={item.type}>
                                <div className="epd-bar-lbl">
                                    <span className="epd-bar-n">{typeLabelMap[item.type] || item.type}</span>
                                    <span className="epd-bar-v">{item.count}</span>
                                </div>
                                <div className="epd-bar-track">
                                    <div className="epd-bar-fill" style={{
                                        '--w': `${Math.round(item.count / maxType * 100)}%`,
                                        width: `${Math.round(item.count / maxType * 100)}%`,
                                        background: typeColors[item.type] || '#a8a29e',
                                        animationDelay: `${i * 80 + 350}ms`,
                                    } as any} />
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f5f4f0' }}>
                            <div className="epd-lbl">Durum</div>
                            {(stats.propertiesByStatus || []).map((item: any) => {
                                const cc: Record<string, string> = {
                                    satilik: '#3b82f6', kiralik: '#15803d', satildi: '#dc2626', kiralandi: '#b45309',
                                }
                                const pct = stats.totalProperties
                                    ? Math.round(item.count / stats.totalProperties * 100) : 0
                                return (
                                    <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: cc[item.status] || '#a8a29e', flexShrink: 0 }} />
                                        <div style={{ flex: 1, fontSize: '12px', color: '#a8a29e' }}>{sLabel[item.status] || item.status}</div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{item.count}</div>
                                        <div style={{
                                            fontSize: '10px', fontWeight: 700,
                                            color: cc[item.status], background: cc[item.status] + '18',
                                            padding: '1px 7px', borderRadius: '99px',
                                        }}>%{pct}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Son ilanlar */}
                    <div className="epd-card" style={{ animationDelay: '0.28s' }}>
                        <div className="epd-lbl">Son Eklenen İlanlar</div>
                        {(stats.recentProperties || []).map((p: any) => (
                            <div className="epd-prop" key={p._id}>
                                <div style={{ minWidth: 0 }}>
                                    <div className="epd-prop-t">{p.title}</div>
                                    <div className="epd-prop-p">{formatPrice(p.price)}</div>
                                    <div className="epd-prop-m">
                                        {p.city && `${p.city} · `}
                                        {new Date(p.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>
                                <span className={sPill[p.status] || 'epd-pill'}>{sLabel[p.status] || p.status}</span>
                            </div>
                        ))}
                    </div>

                    {/* Özet & İpucu */}
                    <div className="epd-card" style={{ animationDelay: '0.34s' }}>
                        <div className="epd-lbl">Genel Özet</div>
                        <div className="epd-qs">
                            {[
                                { lbl: 'Danışman', val: stats.totalAgents, sub: 'aktif' },
                                { lbl: 'Vitrin', val: stats.featuredListings, sub: 'öne çıkan' },
                                { lbl: 'Tamamlanan', val: stats.soldListings, sub: 'satış/kiralama' },
                                { lbl: 'Toplam Müşteri', val: stats.totalLeads, sub: `${stats.newLeads} yeni` },
                            ].map((q, i) => (
                                <div className="epd-qs-cell" key={q.lbl} style={{ animationDelay: `${i * 70 + 200}ms` }}>
                                    <div className="epd-qs-lbl">{q.lbl}</div>
                                    <div className="epd-qs-val">{q.val}</div>
                                    <div className="epd-qs-sub">{q.sub}</div>
                                </div>
                            ))}
                        </div>

                        <div className="epd-tip">
                            <div className="epd-tip-lbl">Öneri</div>
                            <div className="epd-tip-text">
                                {stats.newLeads > 2
                                    ? `${stats.newLeads} müşteri yanıt bekliyor. En eski mesaj ${stats.recentLeads?.[stats.recentLeads.length - 1]?.createdAt
                                        ? Math.floor((Date.now() - new Date(stats.recentLeads[stats.recentLeads.length - 1].createdAt).getTime()) / 3600000) + ' saat önce'
                                        : 'bir süre önce'
                                    } geldi — hızlı dönüş kapanma oranını ciddi artırır.`
                                    : stats.newLeads === 1
                                        ? 'Yeni bir müşteri mesajı var. Şimdi dönüş yapmak için ideal an.'
                                        : stats.featuredListings === 0
                                            ? 'Vitrin ilanı eklemediniz. Öne çıkan ilanlar %60 daha fazla görüntüleme alır.'
                                            : `${stats.activeListings} aktif ilanınız var. Açıklamaları güncel tutmak arama sıralamasını yükseltir.`
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}