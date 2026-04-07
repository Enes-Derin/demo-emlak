'use client'

import { useEffect, useState, useCallback } from 'react'
import { useClient } from 'sanity'
import { groq } from 'next-sanity'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
  @keyframes shimmer { 0%{background-position:-500px 0}100%{background-position:500px 0} }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
  @keyframes backdrop{ from{opacity:0}to{opacity:1} }
  @keyframes spin    { to{transform:rotate(360deg)} }

  /* ── Base ───────────────────────────── */
  .epc *{box-sizing:border-box;margin:0;padding:0}
  .epc{
    font-family:'DM Sans',system-ui,sans-serif;
    background:#f5f4f0;min-height:100vh;color:#1a1a1a;
    padding:26px 28px 52px;
  }

  /* ── Header ─────────────────────────── */
  .epc-hdr{
    display:flex;align-items:flex-end;justify-content:space-between;
    margin-bottom:24px;animation:fadeIn .4s ease both;flex-wrap:wrap;gap:12px;
  }
  .epc-title{
    font-family:'Playfair Display',serif;
    font-size:30px;font-weight:900;letter-spacing:-.02em;color:#1a1a1a;
  }
  .epc-sub{font-size:11px;color:#a8a29e;margin-top:3px;letter-spacing:.07em;text-transform:uppercase}
  .epc-hdr-btns{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .epc-btn{
    background:#fff;border:1px solid #e7e5e4;color:#78716c;
    font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
    padding:7px 16px;border-radius:9px;cursor:pointer;
    transition:all .2s;font-family:'DM Sans',sans-serif;
    box-shadow:0 1px 3px rgba(0,0,0,.05);
  }
  .epc-btn:hover{border-color:#d6d3d1;color:#1a1a1a;box-shadow:0 2px 6px rgba(0,0,0,.08)}
  .epc-btn-primary{
    background:#1a1a1a;border:1px solid #1a1a1a;color:#fff;
    font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
    padding:7px 18px;border-radius:9px;cursor:pointer;
    transition:all .2s;font-family:'DM Sans',sans-serif;
  }
  .epc-btn-primary:hover{background:#333}

  /* ── Layout ─────────────────────────── */
  .epc-layout{display:grid;grid-template-columns:1fr;gap:16px}
  @media(min-width:900px){.epc-layout{grid-template-columns:1fr 360px}}

  /* ── Card ───────────────────────────── */
  .epc-card{
    background:#fff;border:1px solid #e7e5e4;border-radius:16px;
    padding:22px;box-shadow:0 1px 4px rgba(0,0,0,.04);
    animation:fadeUp .45s ease both;
  }

  /* ── Calendar nav ───────────────────── */
  .epc-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
  .epc-month{
    font-family:'Playfair Display',serif;
    font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:-.01em;
  }
  .epc-nav-btns{display:flex;gap:6px;align-items:center}
  .epc-nav-btn{
    width:34px;height:34px;border-radius:9px;border:1px solid #e7e5e4;
    background:#fff;color:#78716c;font-size:16px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all .2s;
  }
  .epc-nav-btn:hover{border-color:#d6d3d1;color:#1a1a1a}
  .epc-nav-today{
    padding:0 12px;height:34px;border-radius:9px;border:1px solid #e7e5e4;
    background:#fff;color:#78716c;font-size:11px;font-weight:600;
    letter-spacing:.07em;text-transform:uppercase;cursor:pointer;
    transition:all .2s;font-family:'DM Sans',sans-serif;
  }
  .epc-nav-today:hover{border-color:#d6d3d1;color:#1a1a1a}

  /* ── Day headers ────────────────────── */
  .epc-days{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:4px}
  .epc-dh{
    text-align:center;font-size:10px;font-weight:700;
    color:#c4bfba;letter-spacing:.1em;text-transform:uppercase;padding:5px 0;
  }

  /* ── Calendar grid ──────────────────── */
  .epc-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
  .epc-cell{
    min-height:52px;border-radius:10px;padding:6px;
    display:flex;flex-direction:column;align-items:center;
    cursor:pointer;transition:all .15s;
    border:1.5px solid transparent;background:transparent;
  }
  .epc-cell:hover{background:#f5f4f0}
  .epc-cell.today{border-color:#fde68a;background:#fffdf5}
  .epc-cell.selected{border-color:#1a1a1a;background:#fafaf9}
  .epc-cell.has-content{background:#fafaf9}
  .epc-cday{
    font-size:13px;font-weight:600;color:#a8a29e;
    width:26px;height:26px;display:flex;align-items:center;justify-content:center;
    border-radius:50%;transition:all .15s;
  }
  .epc-cell.today .epc-cday{color:#b45309;font-weight:800}
  .epc-cell.selected .epc-cday{color:#1a1a1a;font-weight:900}
  .epc-cell.has-content .epc-cday{color:#1a1a1a}
  .epc-dots{display:flex;gap:2px;margin-top:3px;justify-content:center;flex-wrap:wrap}
  .epc-dot{width:5px;height:5px;border-radius:50%}
  .epc-dot-appt{background:#b45309}
  .epc-dot-note{background:#3b82f6}

  /* ── Legend ─────────────────────────── */
  .epc-legend{display:flex;gap:14px;margin-top:16px;flex-wrap:wrap}
  .epc-leg{display:flex;align-items:center;gap:5px;font-size:11px;color:#a8a29e}
  .epc-leg-dot{width:6px;height:6px;border-radius:50%}

  /* ── Detail panel ───────────────────── */
  .epc-detail{animation:fadeUp .5s ease both;animation-delay:.05s}
  .epc-detail-date{
    font-family:'Playfair Display',serif;
    font-size:18px;font-weight:700;color:#1a1a1a;
    padding-bottom:14px;margin-bottom:16px;
    border-bottom:1px solid #f5f4f0;
  }

  /* Add buttons */
  .epc-add-btns{display:flex;gap:8px;margin-bottom:18px}
  .epc-add-btn{
    flex:1;padding:10px 8px;border-radius:10px;border:1.5px dashed #e7e5e4;
    background:#fafaf9;color:#78716c;font-size:12px;font-weight:600;
    cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;
    text-align:center;
  }
  .epc-add-btn:hover{border-color:#d6d3d1;background:#fff;color:#1a1a1a}
  .epc-add-btn.appt:hover{border-color:#b45309;color:#b45309;background:#fffdf5}
  .epc-add-btn.note:hover{border-color:#3b82f6;color:#3b82f6;background:#eff6ff}

  /* ── Randevu kartı ──────────────────── */
  .epc-appt{
    border-radius:12px;padding:14px;margin-bottom:10px;
    border-left:3px solid;transition:all .2s;
  }
  .epc-appt:last-child{margin-bottom:0}
  .epc-appt:hover{filter:brightness(.98)}
  .epc-appt.pending  {background:#fffdf5;border-left-color:#b45309}
  .epc-appt.confirmed{background:#f0fdf4;border-left-color:#15803d}
  .epc-appt.cancelled{background:#fff5f5;border-left-color:#dc2626;opacity:.75}
  .epc-appt.completed{background:#fafaf9;border-left-color:#d6d3d1;opacity:.7}
  .epc-appt-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
  .epc-appt-name{font-size:14px;font-weight:700;color:#1a1a1a}
  .epc-appt-time{
    font-family:'Playfair Display',serif;
    font-size:22px;font-weight:900;line-height:1;margin:4px 0 2px;
  }
  .epc-appt-time.pending  {color:#b45309}
  .epc-appt-time.confirmed{color:#15803d}
  .epc-appt-time.cancelled{color:#dc2626}
  .epc-appt-time.completed{color:#a8a29e}
  .epc-appt-type{font-size:12px;color:#78716c}
  .epc-appt-info{font-size:11px;color:#a8a29e;margin-top:2px}
  .epc-appt-st{font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;flex-shrink:0;letter-spacing:.05em}
  .epc-as-pending  {background:#fef3c7;color:#b45309}
  .epc-as-confirmed{background:#dcfce7;color:#15803d}
  .epc-as-cancelled{background:#fef2f2;color:#dc2626}
  .epc-as-completed{background:#f5f4f0;color:#a8a29e}

  /* ── Not kartı ──────────────────────── */
  .epc-note{
    background:#eff6ff;border:1px solid #bfdbfe;
    border-radius:12px;padding:14px;margin-bottom:10px;
    transition:all .2s;
  }
  .epc-note:hover{border-color:#93c5fd}
  .epc-note-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px}
  .epc-note-title{font-size:13px;font-weight:700;color:#1d4ed8}
  .epc-note-body{font-size:13px;color:#3b82f6;line-height:1.55}
  .epc-note-time{font-size:10px;color:#93c5fd;margin-top:6px}
  .epc-note-del{
    background:none;border:none;cursor:pointer;color:#bfdbfe;
    font-size:14px;line-height:1;padding:0;transition:color .2s;flex-shrink:0;
  }
  .epc-note-del:hover{color:#dc2626}

  /* ── Empty ──────────────────────────── */
  .epc-empty{
    text-align:center;padding:28px 0;
    font-size:13px;color:#c4bfba;font-style:italic;
  }

  /* ── Divider label ──────────────────── */
  .epc-section-lbl{
    font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
    color:#c4bfba;margin:14px 0 10px;
  }

  /* ════════════════════════════════════
     MODAL
  ════════════════════════════════════ */
  .epc-overlay{
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,.35);backdrop-filter:blur(4px);
    display:flex;align-items:center;justify-content:center;padding:20px;
    animation:backdrop .2s ease both;
  }
  .epc-modal{
    background:#fff;border-radius:20px;width:100%;max-width:480px;
    box-shadow:0 24px 64px rgba(0,0,0,.18);
    animation:slideUp .3s cubic-bezier(.16,1,.3,1) both;
    overflow:hidden;
  }
  .epc-modal-hdr{
    padding:22px 24px 18px;border-bottom:1px solid #f5f4f0;
    display:flex;align-items:center;justify-content:space-between;
  }
  .epc-modal-title{
    font-family:'Playfair Display',serif;
    font-size:20px;font-weight:900;color:#1a1a1a;letter-spacing:-.01em;
  }
  .epc-modal-sub{font-size:12px;color:#a8a29e;margin-top:2px}
  .epc-modal-close{
    width:32px;height:32px;border-radius:8px;border:1px solid #e7e5e4;
    background:#fafaf9;color:#78716c;font-size:16px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .2s;
    flex-shrink:0;
  }
  .epc-modal-close:hover{background:#fff;border-color:#d6d3d1;color:#1a1a1a}
  .epc-modal-body{padding:22px 24px}
  .epc-modal-foot{padding:16px 24px;border-top:1px solid #f5f4f0;display:flex;gap:10px;justify-content:flex-end}

  /* Form elements */
  .epc-field{margin-bottom:16px}
  .epc-field:last-child{margin-bottom:0}
  .epc-label{
    display:block;font-size:11px;font-weight:700;letter-spacing:.09em;
    text-transform:uppercase;color:#a8a29e;margin-bottom:6px;
  }
  .epc-input{
    width:100%;border:1.5px solid #e7e5e4;border-radius:10px;
    padding:10px 14px;font-size:13px;color:#1a1a1a;
    font-family:'DM Sans',sans-serif;outline:none;
    transition:border-color .2s;background:#fafaf9;
  }
  .epc-input:focus{border-color:#1a1a1a;background:#fff}
  .epc-textarea{
    width:100%;border:1.5px solid #e7e5e4;border-radius:10px;
    padding:10px 14px;font-size:13px;color:#1a1a1a;
    font-family:'DM Sans',sans-serif;outline:none;resize:vertical;min-height:90px;
    transition:border-color .2s;background:#fafaf9;
  }
  .epc-textarea:focus{border-color:#1a1a1a;background:#fff}
  .epc-select{
    width:100%;border:1.5px solid #e7e5e4;border-radius:10px;
    padding:10px 14px;font-size:13px;color:#1a1a1a;
    font-family:'DM Sans',sans-serif;outline:none;
    transition:border-color .2s;background:#fafaf9;appearance:none;cursor:pointer;
  }
  .epc-select:focus{border-color:#1a1a1a;background:#fff}
  .epc-row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}

  /* Submit btn */
  .epc-submit{
    background:#1a1a1a;color:#fff;border:none;border-radius:10px;
    padding:10px 22px;font-size:13px;font-weight:700;
    cursor:pointer;font-family:'DM Sans',sans-serif;
    transition:all .2s;letter-spacing:.03em;
    display:flex;align-items:center;gap:8px;
  }
  .epc-submit:hover{background:#333}
  .epc-submit:disabled{opacity:.5;cursor:not-allowed}
  .epc-cancel{
    background:#fafaf9;color:#78716c;border:1.5px solid #e7e5e4;border-radius:10px;
    padding:10px 18px;font-size:13px;font-weight:600;
    cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;
  }
  .epc-cancel:hover{border-color:#d6d3d1;color:#1a1a1a}

  /* Note type toggle */
  .epc-type-toggle{display:flex;gap:6px}
  .epc-type-opt{
    flex:1;padding:9px;border-radius:10px;border:1.5px solid #e7e5e4;
    background:#fafaf9;color:#78716c;font-size:12px;font-weight:600;
    cursor:pointer;text-align:center;transition:all .2s;font-family:'DM Sans',sans-serif;
  }
  .epc-type-opt:hover{border-color:#d6d3d1;color:#1a1a1a}
  .epc-type-opt.active-appt{border-color:#b45309;background:#fffdf5;color:#b45309}
  .epc-type-opt.active-note{border-color:#3b82f6;background:#eff6ff;color:#3b82f6}

  /* Spinner */
  .epc-spin{
    width:14px;height:14px;border:2px solid rgba(255,255,255,.3);
    border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;
  }

  /* Skeleton */
  .epc-sk{
    background:linear-gradient(90deg,#f5f4f0 25%,#ece9e4 50%,#f5f4f0 75%);
    background-size:500px 100%;animation:shimmer 1.4s infinite;border-radius:10px;
  }

  /* Scrollbar */
  .epc ::-webkit-scrollbar{width:4px}
  .epc ::-webkit-scrollbar-track{background:transparent}
  .epc ::-webkit-scrollbar-thumb{background:#e7e5e4;border-radius:4px}

  @media(max-width:640px){
    .epc{padding:18px 16px 48px}
    .epc-title{font-size:24px}
    .epc-cell{min-height:42px}
    .epc-row2{grid-template-columns:1fr}
  }
`

/* ── Tipler ──────────────────────────── */
interface Appointment {
    _id: string
    clientName: string
    clientPhone?: string
    clientEmail?: string
    date: string
    type: 'visit' | 'consultation' | 'contract'
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    propertyTitle?: string
    agentName?: string
    notes?: string
}

interface CalendarNote {
    id: string
    date: string // YYYY-MM-DD
    title: string
    body: string
    createdAt: string
}

type ModalMode = null | 'appointment' | 'note'

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const typeLabel: Record<string, string> = {
    visit: 'Mülk Gezisi', consultation: 'Danışma', contract: 'Sözleşme',
}
const statusLabel: Record<string, string> = {
    pending: 'Bekliyor', confirmed: 'Onaylandı',
    cancelled: 'İptal Edildi', completed: 'Tamamlandı',
}
const NOTES_KEY = 'ep_calendar_notes'

/* ── LocalStorage helpers ──────────── */
function loadNotes(): CalendarNote[] {
    try {
        return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]')
    } catch { return [] }
}
function saveNotes(notes: CalendarNote[]) {
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)) } catch { }
}

export function AppointmentCalendar() {
    const client = useClient({ apiVersion: '2024-01-01' })
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [notes, setNotes] = useState<CalendarNote[]>([])
    const [loading, setLoading] = useState(true)
    const today = new Date()
    const [currentMonth, setCurrentMonth] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    )
    const [selected, setSelected] = useState<Date>(today)
    const [modalMode, setModalMode] = useState<ModalMode>(null)
    const [saving, setSaving] = useState(false)

    /* Randevu form state */
    const [aptForm, setAptForm] = useState({
        clientName: '', clientPhone: '', clientEmail: '',
        time: '10:00', type: 'visit', status: 'pending',
        propertyTitle: '', notes: '',
    })
    /* Not form state */
    const [noteForm, setNoteForm] = useState({ title: '', body: '' })
    const [formErr, setFormErr] = useState('')

    /* ── Veri çek ──────────────────────── */
    const fetchAppointments = useCallback(() => {
        client.fetch(groq`
      *[_type == "appointment"] | order(date asc) {
        _id, clientName, clientPhone, clientEmail, date, type, status, notes,
        "propertyTitle": property->title,
        "agentName": agent->name
      }
    `).then((data: Appointment[]) => {
            setAppointments(data)
            setLoading(false)
        })
    }, [client])

    useEffect(() => {
        fetchAppointments()
        setNotes(loadNotes())
    }, [fetchAppointments])

    /* ── Takvim hesapla ────────────────── */
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7
    const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7
    const cells: (Date | null)[] = []
    for (let i = 0; i < totalCells; i++) {
        const n = i - startOffset + 1
        cells.push(n >= 1 && n <= lastDay.getDate() ? new Date(year, month, n) : null)
    }

    const dateKey = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    const apptsByDate = (d: Date) =>
        appointments.filter(a => a.date?.slice(0, 10) === dateKey(d))

    const notesByDate = (d: Date) =>
        notes.filter(n => n.date === dateKey(d))

    const isToday = (d: Date) =>
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()

    const isSel = (d: Date) =>
        d.getDate() === selected.getDate() &&
        d.getMonth() === selected.getMonth() &&
        d.getFullYear() === selected.getFullYear()

    const selAppts = apptsByDate(selected)
    const selNotes = notesByDate(selected)
    const selDateStr = selected.toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', weekday: 'long',
    })

    /* ── Modal aç ──────────────────────── */
    const openModal = (mode: ModalMode) => {
        setFormErr('')
        if (mode === 'appointment') {
            setAptForm({
                clientName: '', clientPhone: '', clientEmail: '',
                time: '10:00', type: 'visit', status: 'pending',
                propertyTitle: '', notes: '',
            })
        } else {
            setNoteForm({ title: '', body: '' })
        }
        setModalMode(mode)
    }

    /* ── Randevu kaydet ────────────────── */
    const saveAppointment = async () => {
        if (!aptForm.clientName.trim()) {
            setFormErr('Müşteri adı zorunludur.')
            return
        }
        setSaving(true)
        setFormErr('')
        try {
            const [h, m] = aptForm.time.split(':')
            const dt = new Date(selected)
            dt.setHours(Number(h), Number(m), 0, 0)

            await client.create({
                _type: 'appointment',
                clientName: aptForm.clientName.trim(),
                clientPhone: aptForm.clientPhone.trim() || undefined,
                clientEmail: aptForm.clientEmail.trim() || undefined,
                date: dt.toISOString(),
                type: aptForm.type,
                status: aptForm.status,
                notes: aptForm.notes.trim() || undefined,
                createdAt: new Date().toISOString(),
            })

            await fetchAppointments()
            setModalMode(null)

            // Randevu bildirimini WhatsApp ile kendinize gönderin
            const typeMap: Record<string, string> = {
                visit: 'Mülk Gezisi', consultation: 'Danışma', contract: 'Sözleşme',
            }
            const statusMap: Record<string, string> = {
                pending: 'Bekliyor', confirmed: 'Onaylandı',
            }
            const lines = [
                '📅 *YENİ RANDEVU EKLENDİ*',
                '',
                `👤 *Müşteri:* ${aptForm.clientName}`,
                aptForm.clientPhone ? `📞 *Telefon:* ${aptForm.clientPhone}` : '',
                aptForm.clientEmail ? `📧 *E-posta:* ${aptForm.clientEmail}` : '',
                `🕐 *Tarih/Saat:* ${dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })} — ${aptForm.time}`,
                `📋 *Tür:* ${typeMap[aptForm.type] || aptForm.type}`,
                `🔵 *Durum:* ${statusMap[aptForm.status] || aptForm.status}`,
                aptForm.propertyTitle ? `🏡 *İlan:* ${aptForm.propertyTitle}` : '',
                aptForm.notes ? `💬 *Not:* ${aptForm.notes}` : '',
                '',
                '_Sanity Admin Paneli üzerinden eklendi._',
            ].filter(Boolean).join('\n')

            const waNumber = process.env.NEXT_PUBLIC_EMLAKCI_WHATSAPP?.replace(/\D/g, '') || ''
            if (waNumber) {
                window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`, '_blank')
            }

        } catch {
            setFormErr('Kayıt başarısız. Lütfen tekrar deneyin.')
        }
        setSaving(false)
    }

    /* ── Not kaydet ────────────────────── */
    const saveNote = () => {
        if (!noteForm.title.trim() && !noteForm.body.trim()) {
            setFormErr('Başlık veya not içeriği girin.')
            return
        }
        const newNote: CalendarNote = {
            id: Date.now().toString(),
            date: dateKey(selected),
            title: noteForm.title.trim() || 'Not',
            body: noteForm.body.trim(),
            createdAt: new Date().toISOString(),
        }
        const updated = [...notes, newNote]
        setNotes(updated)
        saveNotes(updated)
        setModalMode(null)
    }

    /* ── Not sil ───────────────────────── */
    const deleteNote = (id: string) => {
        const updated = notes.filter(n => n.id !== id)
        setNotes(updated)
        saveNotes(updated)
    }

    return (
        <>
            <style>{css}</style>
            <div className="epc">

                {/* ── Header ── */}
                <div className="epc-hdr">
                    <div>
                        <div className="epc-title">Takvim</div>
                        <div className="epc-sub">Randevu & Görüşme Planı</div>
                    </div>
                    <div className="epc-hdr-btns">
                        <button className="epc-btn" onClick={fetchAppointments}>Yenile</button>
                        <button className="epc-btn-primary" onClick={() => openModal('appointment')}>
                            Randevu Ekle
                        </button>
                    </div>
                </div>

                <div className="epc-layout">

                    {/* ── Takvim ── */}
                    <div className="epc-card">
                        <div className="epc-nav">
                            <div className="epc-month">{MONTHS[month]} {year}</div>
                            <div className="epc-nav-btns">
                                <button className="epc-nav-btn"
                                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>‹</button>
                                <button className="epc-nav-today"
                                    onClick={() => { setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today) }}>
                                    Bugün
                                </button>
                                <button className="epc-nav-btn"
                                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>›</button>
                            </div>
                        </div>

                        <div className="epc-days">
                            {DAYS.map(d => <div key={d} className="epc-dh">{d}</div>)}
                        </div>

                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
                                {[...Array(35)].map((_, i) => (
                                    <div key={i} className="epc-sk" style={{ height: '52px', animationDelay: `${i * 15}ms` }} />
                                ))}
                            </div>
                        ) : (
                            <div className="epc-grid">
                                {cells.map((date, i) => {
                                    if (!date) return <div key={i} />
                                    const dayAppts = apptsByDate(date)
                                    const dayNotes = notesByDate(date)
                                    const hasContent = dayAppts.length > 0 || dayNotes.length > 0
                                    const cls = ['epc-cell',
                                        isToday(date) ? 'today' : '',
                                        isSel(date) ? 'selected' : '',
                                        hasContent ? 'has-content' : '',
                                    ].join(' ')
                                    return (
                                        <button key={i} className={cls} onClick={() => setSelected(date)}>
                                            <span className="epc-cday">{date.getDate()}</span>
                                            {hasContent && (
                                                <div className="epc-dots">
                                                    {dayAppts.slice(0, 2).map(a => (
                                                        <div key={a._id} className="epc-dot epc-dot-appt" />
                                                    ))}
                                                    {dayNotes.slice(0, 2).map(n => (
                                                        <div key={n.id} className="epc-dot epc-dot-note" />
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        <div className="epc-legend">
                            <div className="epc-leg">
                                <div className="epc-leg-dot" style={{ background: '#b45309' }} />
                                Randevu
                            </div>
                            <div className="epc-leg">
                                <div className="epc-leg-dot" style={{ background: '#3b82f6' }} />
                                Not
                            </div>
                            <div className="epc-leg">
                                <div className="epc-leg-dot" style={{ background: '#fbbf24', border: '1.5px solid #fde68a' }} />
                                Bugün
                            </div>
                        </div>
                    </div>

                    {/* ── Detail panel ── */}
                    <div className="epc-detail">
                        <div className="epc-card">
                            <div className="epc-detail-date">{selDateStr}</div>

                            {/* Ekle butonları */}
                            <div className="epc-add-btns">
                                <button className="epc-add-btn appt" onClick={() => openModal('appointment')}>
                                    + Randevu
                                </button>
                                <button className="epc-add-btn note" onClick={() => openModal('note')}>
                                    + Not
                                </button>
                            </div>

                            {/* Randevular */}
                            {selAppts.length > 0 && (
                                <>
                                    <div className="epc-section-lbl">Randevular</div>
                                    {selAppts.map(apt => (
                                        <div key={apt._id} className={`epc-appt ${apt.status}`}>
                                            <div className="epc-appt-top">
                                                <div className="epc-appt-name">{apt.clientName}</div>
                                                <span className={`epc-appt-st epc-as-${apt.status}`}>
                                                    {statusLabel[apt.status]}
                                                </span>
                                            </div>
                                            <div className={`epc-appt-time ${apt.status}`}>
                                                {new Date(apt.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="epc-appt-type">{typeLabel[apt.type] || apt.type}</div>
                                            {apt.propertyTitle && <div className="epc-appt-info">{apt.propertyTitle}</div>}
                                            {apt.agentName && <div className="epc-appt-info">{apt.agentName}</div>}
                                            {apt.clientPhone && <div className="epc-appt-info">{apt.clientPhone}</div>}
                                            {apt.clientEmail && <div className="epc-appt-info">{apt.clientEmail}</div>}
                                            {apt.notes && (
                                                <div style={{
                                                    marginTop: '8px', fontSize: '12px', color: '#78716c',
                                                    background: '#fff', borderRadius: '8px', padding: '8px 10px',
                                                    border: '1px solid #f5f4f0',
                                                }}>
                                                    {apt.notes}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Notlar */}
                            {selNotes.length > 0 && (
                                <>
                                    <div className="epc-section-lbl" style={{ marginTop: selAppts.length > 0 ? '16px' : '0' }}>
                                        Notlar
                                    </div>
                                    {selNotes.map(note => (
                                        <div key={note.id} className="epc-note">
                                            <div className="epc-note-top">
                                                <div className="epc-note-title">{note.title}</div>
                                                <button className="epc-note-del" onClick={() => deleteNote(note.id)} title="Sil">
                                                    ×
                                                </button>
                                            </div>
                                            {note.body && <div className="epc-note-body">{note.body}</div>}
                                            <div className="epc-note-time">
                                                {new Date(note.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                {' saat '}
                                                {new Date(note.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {selAppts.length === 0 && selNotes.length === 0 && (
                                <div className="epc-empty">
                                    Bu gün için kayıt yok.<br />
                                    <span style={{ fontSize: '12px' }}>Randevu veya not ekleyin.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════
          MODAL
      ════════════════════════════════════ */}
            {modalMode && (
                <div className="epc-overlay" onClick={() => setModalMode(null)}>
                    <div className="epc-modal" onClick={e => e.stopPropagation()}>

                        {/* Modal header */}
                        <div className="epc-modal-hdr">
                            <div>
                                <div className="epc-modal-title">
                                    {modalMode === 'appointment' ? 'Randevu Ekle' : 'Not Ekle'}
                                </div>
                                <div className="epc-modal-sub">{selDateStr}</div>
                            </div>
                            <button className="epc-modal-close" onClick={() => setModalMode(null)}>×</button>
                        </div>

                        {/* Modal body */}
                        <div className="epc-modal-body">

                            {/* Tip seçici */}
                            <div className="epc-field">
                                <div className="epc-label">Tür</div>
                                <div className="epc-type-toggle">
                                    <button
                                        className={`epc-type-opt ${modalMode === 'appointment' ? 'active-appt' : ''}`}
                                        onClick={() => { setModalMode('appointment'); setFormErr('') }}
                                    >
                                        Randevu
                                    </button>
                                    <button
                                        className={`epc-type-opt ${modalMode === 'note' ? 'active-note' : ''}`}
                                        onClick={() => { setModalMode('note'); setFormErr('') }}
                                    >
                                        Not
                                    </button>
                                </div>
                            </div>

                            {/* ── Randevu formu ── */}
                            {modalMode === 'appointment' && (
                                <>
                                    <div className="epc-row2">
                                        <div className="epc-field">
                                            <label className="epc-label">Müşteri Adı *</label>
                                            <input
                                                className="epc-input"
                                                placeholder="Ad Soyad"
                                                value={aptForm.clientName}
                                                onChange={e => setAptForm(f => ({ ...f, clientName: e.target.value }))}
                                            />
                                        </div>
                                        <div className="epc-field">
                                            <label className="epc-label">Saat</label>
                                            <input
                                                type="time"
                                                className="epc-input"
                                                value={aptForm.time}
                                                onChange={e => setAptForm(f => ({ ...f, time: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="epc-row2">
                                        <div className="epc-field">
                                            <label className="epc-label">Telefon</label>
                                            <input
                                                className="epc-input"
                                                placeholder="+90 5XX XXX XX XX"
                                                value={aptForm.clientPhone}
                                                onChange={e => setAptForm(f => ({ ...f, clientPhone: e.target.value }))}
                                            />
                                        </div>
                                        <div className="epc-field">
                                            <label className="epc-label">E-posta</label>
                                            <input
                                                className="epc-input"
                                                placeholder="ornek@mail.com"
                                                value={aptForm.clientEmail}
                                                onChange={e => setAptForm(f => ({ ...f, clientEmail: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="epc-row2">
                                        <div className="epc-field">
                                            <label className="epc-label">Görüşme Türü</label>
                                            <select
                                                className="epc-select"
                                                value={aptForm.type}
                                                onChange={e => setAptForm(f => ({ ...f, type: e.target.value }))}
                                            >
                                                <option value="visit">Mülk Gezisi</option>
                                                <option value="consultation">Danışma</option>
                                                <option value="contract">Sözleşme</option>
                                            </select>
                                        </div>
                                        <div className="epc-field">
                                            <label className="epc-label">Durum</label>
                                            <select
                                                className="epc-select"
                                                value={aptForm.status}
                                                onChange={e => setAptForm(f => ({ ...f, status: e.target.value }))}
                                            >
                                                <option value="pending">Bekliyor</option>
                                                <option value="confirmed">Onaylandı</option>
                                                <option value="cancelled">İptal</option>
                                                <option value="completed">Tamamlandı</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="epc-field">
                                        <label className="epc-label">İlgili İlan (opsiyonel)</label>
                                        <input
                                            className="epc-input"
                                            placeholder="İlan adı veya adresi"
                                            value={aptForm.propertyTitle}
                                            onChange={e => setAptForm(f => ({ ...f, propertyTitle: e.target.value }))}
                                        />
                                    </div>

                                    <div className="epc-field">
                                        <label className="epc-label">Notlar</label>
                                        <textarea
                                            className="epc-textarea"
                                            placeholder="Görüşme hakkında notlar..."
                                            value={aptForm.notes}
                                            onChange={e => setAptForm(f => ({ ...f, notes: e.target.value }))}
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── Not formu ── */}
                            {modalMode === 'note' && (
                                <>
                                    <div className="epc-field">
                                        <label className="epc-label">Başlık</label>
                                        <input
                                            className="epc-input"
                                            placeholder="Not başlığı"
                                            value={noteForm.title}
                                            onChange={e => setNoteForm(f => ({ ...f, title: e.target.value }))}
                                        />
                                    </div>
                                    <div className="epc-field">
                                        <label className="epc-label">Not</label>
                                        <textarea
                                            className="epc-textarea"
                                            placeholder="Not içeriğinizi buraya yazın..."
                                            style={{ minHeight: '120px' }}
                                            value={noteForm.body}
                                            onChange={e => setNoteForm(f => ({ ...f, body: e.target.value }))}
                                        />
                                    </div>
                                </>
                            )}

                            {formErr && (
                                <div style={{
                                    fontSize: '12px', color: '#dc2626',
                                    background: '#fef2f2', border: '1px solid #fecaca',
                                    borderRadius: '8px', padding: '9px 12px', marginTop: '4px',
                                }}>
                                    {formErr}
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}
                        <div className="epc-modal-foot">
                            <button className="epc-cancel" onClick={() => setModalMode(null)}>İptal</button>
                            <button
                                className="epc-submit"
                                onClick={modalMode === 'appointment' ? saveAppointment : saveNote}
                                disabled={saving}
                            >
                                {saving ? <span className="epc-spin" /> : null}
                                {modalMode === 'appointment' ? 'Randevu Kaydet' : 'Not Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}