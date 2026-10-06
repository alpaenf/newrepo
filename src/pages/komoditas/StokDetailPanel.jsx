import React, { useState } from 'react'
import {
  X,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Store,
  QrCode,
  Sparkles,
  SendHorizontal,
  Package,
  Layers,
  Building
} from '../../components/icons.jsx'

export default function StokDetailPanel({ item, onClose, isAdmin = true }) {
  const [showOrderToast, setShowOrderToast] = useState(false)

  if (!item) return null

  const isAman = item.status === 'Aman'
  const isMenipis = item.status === 'Menipis'
  const isKritis = item.status === 'Kritis'

  const statusColor = isAman ? '#10B981' : isMenipis ? '#F5A623' : '#EF4444'

  // Calculate buffer fulfillment ratio %
  const stokNum = parseFloat(String(item.stok).replace(/[^0-9.]/g, '')) || 0
  const bufferNum = parseFloat(String(item.minBuffer).replace(/[^0-9.]/g, '')) || 1
  const bufferRatio = Math.round((stokNum / bufferNum) * 100)

  const statusBg = isAman
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isMenipis
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200'

  // Per-commodity breakdown list with explicit kg / Ton formatting
  const rincianStok = item.rincianStok || [
    { nama: item.komoditas || 'Komoditas Utama', jumlah: item.stok || '100 Ton', status: item.status || 'Aman' }
  ]

  // Helper to format ton into kg description if applicable
  const formatJumlahText = (jumlahStr) => {
    if (!jumlahStr) return ''
    const num = parseFloat(String(jumlahStr).replace(/[^0-9.]/g, ''))
    if (!isNaN(num) && String(jumlahStr).toLowerCase().includes('ton')) {
      const kgNum = (num * 1000).toLocaleString('id-ID')
      return `${jumlahStr} (${kgNum} kg)`
    }
    return jumlahStr
  }

  // Helper to determine specific commodity price per kg
  const getCommodityPrice = (nama, hargaExplicit) => {
    if (hargaExplicit) return hargaExplicit
    if (!nama) return 'Rp 25.000/kg'
    const lower = nama.toLowerCase()
    if (lower.includes('telur')) return 'Rp 28.500/kg'
    if (lower.includes('daging ayam') || lower.includes('broiler')) return 'Rp 36.500/kg'
    if (lower.includes('daging sapi') || lower.includes('sapi')) return 'Rp 130.000/kg'
    if (lower.includes('daging kambing')) return 'Rp 140.000/kg'
    if (lower.includes('cabai rawit') || lower.includes('cabe rawit')) return 'Rp 55.000/kg'
    if (lower.includes('cabai') || lower.includes('cabe')) return 'Rp 48.000/kg'
    if (lower.includes('beras medium') || lower.includes('pandan wangi')) return 'Rp 13.500/kg'
    if (lower.includes('beras super') || lower.includes('beras premium')) return 'Rp 15.500/kg'
    if (lower.includes('beras')) return 'Rp 14.000/kg'
    if (lower.includes('gula')) return 'Rp 17.500/kg'
    if (lower.includes('minyak')) return 'Rp 16.000/kg'
    if (lower.includes('bawang merah')) return 'Rp 32.000/kg'
    if (lower.includes('bawang putih')) return 'Rp 38.000/kg'
    if (lower.includes('bawang')) return 'Rp 34.000/kg'
    if (lower.includes('tepung')) return 'Rp 12.000/kg'
    if (lower.includes('ikan')) return 'Rp 35.000/kg'
    if (lower.includes('udang')) return 'Rp 85.000/kg'
    if (lower.includes('cumi')) return 'Rp 75.000/kg'
    if (lower.includes('jagung')) return 'Rp 7.500/kg'
    if (lower.includes('kacang')) return 'Rp 22.000/kg'
    return 'Rp 25.000/kg'
  }

  // UMKM Count Simulation based on location/stok
  const umkmCount = item.umkmCount || Math.floor((parseFloat(String(item.stok).replace(/[^0-9.]/g, '')) || 50) * 1.8) + 42
  const mapUrl = item.gmapsLink || `https://www.google.com/maps/search/?api=1&query=${item.lat || -7.4247},${item.lng || 109.2461}`

  // Dynamic Restock & Supply Recommendation using clean SVG icons (NO EMOJIS)
  const getSupplyRecommendation = () => {
    if (isKritis) {
      return {
        icon: <AlertTriangle size={15} className="text-rose-600 shrink-0" />,
        title: 'REKOMENDASI INTERVENSI PASOKAN URGENT',
        amount: '+30 Ton Pasokan Darurat',
        desc: `Alokasikan tambahan pasokan darurat dari Banyumas via Kerjasama Antar Daerah (KAD). Penyelesaian otomatis via QRIS B2B Wholesale.`,
        boxStyle: 'bg-rose-50/60 border-rose-200 text-rose-900'
      }
    }
    if (isMenipis) {
      return {
        icon: <Clock size={15} className="text-amber-600 shrink-0" />,
        title: 'REKOMENDASI PENAMBAHAN BUFFER',
        amount: '+15 Ton Restock Rutin',
        desc: `Jadwalkan pengiriman stok tambahan dalam 48 jam untuk menjaga kestabilan harga pasar UMKM pedagang.`,
        boxStyle: 'bg-amber-50/60 border-amber-200 text-amber-900'
      }
    }
    return {
      icon: <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />,
      title: 'WILAYAH PENYANGGA STOK SURPLUS',
      amount: 'Siap Transfer Stok',
      desc: `Kondisi stok melimpah & aman. Gudang ini direkomendasikan menjadi pemasok utama transfer stok KAD ke wilayah defisit.`,
      boxStyle: 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
    }
  }

  const recommendation = getSupplyRecommendation()

  const handleSimulateQRISOrder = () => {
    setShowOrderToast(true)
    setTimeout(() => setShowOrderToast(false), 4500)
  }

  return (
    <div className="absolute inset-x-2 bottom-2 top-auto max-h-[88%] sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 sm:w-[350px] bg-white rounded-xl sm:rounded-2xl shadow-2xl sm:shadow-lg border border-surface-border z-[550] overflow-y-auto transition-all animate-float-in">
      {/* Mobile Handle */}
      <div className="w-10 h-1 bg-surface-border rounded-full mx-auto my-1.5 block sm:hidden shrink-0" />

      {/* Toast Notification */}
      {showOrderToast && (
        <div className="absolute top-2 left-2 right-2 bg-ink-900 text-white p-3 rounded-xl shadow-2xl z-50 text-xs flex items-center justify-between border border-brand/40 animate-float-in">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand text-white rounded-lg shrink-0">
              <QrCode size={15} />
            </div>
            <div>
              <p className="font-extrabold text-xs text-white">Order Pasokan QRIS B2B Terkirim</p>
              <p className="text-[10px] text-slate-300">Sinyal KAD dikirim ke Bulog Banyumas Raya.</p>
            </div>
          </div>
          <button onClick={() => setShowOrderToast(false)} className="text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header Panel matching Heatmap style */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 sticky top-0 bg-white border-b border-surface-border z-10 shrink-0">
        <div className="min-w-0 pr-2">
          <p className="text-[11px] text-ink-300 font-semibold flex items-center gap-1 truncate">
            <Layers size={12} className="text-brand shrink-0" />
            <span>{item.wilayahName || 'Wilayah Stok'} · Kabupaten {item.wilayahName || 'Banyumas'}</span>
          </p>
          <h3 className="text-base font-extrabold text-ink-900 mt-0.5 truncate">
            {item.gudang || item.name || 'Detail Stok Wilayah'}
          </h3>
          <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBg}`}>
            {isAman && <CheckCircle2 size={11} />}
            {isMenipis && <Clock size={11} />}
            {isKritis && <AlertTriangle size={11} />}
            Status: {item.status || 'Aman'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-muted shrink-0 text-ink-500 transition-colors"
          title="Tutup Panel"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Top 2 KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-surface-muted rounded-xl p-3 text-center border border-surface-border/60">
            <p className="text-[11px] text-ink-300 font-semibold mb-1 flex items-center justify-center gap-1">
              <Package size={12} className="text-brand" />
              Komoditas Dipantau
            </p>
            <p className="text-sm font-bold text-ink-900 tabular-nums">
              {rincianStok.length} Jenis
            </p>
          </div>
          <div className="bg-surface-muted rounded-xl p-3 text-center border border-surface-border/60">
            <p className="text-[11px] text-ink-300 font-semibold mb-1 flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-brand" />
              Target Buffer
            </p>
            <p className="text-sm font-bold text-brand tabular-nums">
              {item.minBuffer || '500 Ton'}
            </p>
          </div>
        </div>

        {/* INTEGRASI JARINGAN UMKM PANGAN QRIS (Heatmap Clean Style) */}
        <section className="bg-surface-muted rounded-xl p-3.5 space-y-2.5 border border-surface-border/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <QrCode size={14} className="text-brand shrink-0" />
              <span className="text-xs font-semibold text-ink-900">Integrasi Pedagang UMKM</span>
            </div>
            <span className="px-2 py-0.5 bg-brand-light text-brand border border-brand/20 rounded-full text-[10px] font-bold">
              QRIS B2B Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="bg-white p-2.5 rounded-lg border border-surface-border/70 text-center shadow-2xs">
              <span className="text-[10px] text-ink-400 block font-medium">UMKM Terlayani</span>
              <strong className="text-xs font-bold text-ink-900 tabular-nums">{umkmCount} Merchant</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-surface-border/70 text-center shadow-2xs">
              <span className="text-[10px] text-ink-400 block font-medium">Settlement QRIS</span>
              <strong className="text-xs font-bold text-emerald-600">Wholesale 0%</strong>
            </div>
          </div>
        </section>

        {/* REKOMENDASI PASOKAN PER KABUPATEN */}
        <section className={`p-3.5 rounded-xl border ${recommendation.boxStyle} space-y-2`}>
          <div className="flex items-center gap-2">
            {recommendation.icon}
            <h5 className="font-extrabold text-xs tracking-tight">{recommendation.title}</h5>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-700">{recommendation.desc}</p>
          <div className="pt-1.5 flex items-center justify-between text-[11px] font-bold border-t border-surface-border/60">
            <span className="text-ink-500">Rekomendasi Pasokan:</span>
            <span className="text-brand font-extrabold">{recommendation.amount}</span>
          </div>
        </section>

        {/* RINCIAN STOK & HARGA PER KOMODITAS */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-ink-900">Rincian Stok & Harga Pasar</span>
            <span className="text-[10px] font-bold text-brand bg-brand-light px-2 py-0.5 rounded-full">
              {rincianStok.length} Jenis Komoditas
            </span>
          </div>

          <div className="space-y-2">
            {rincianStok.map((k, idx) => {
              const isKomAman = k.status === 'Aman'
              const isKomMenipis = k.status === 'Menipis'
              const kColor = isKomAman ? '#22B07D' : isKomMenipis ? '#F5A623' : '#E85D2F'
              const hargaFmt = getCommodityPrice(k.nama, k.harga)

              return (
                <div
                  key={idx}
                  className="bg-surface-muted rounded-xl p-3 space-y-2 border border-surface-border/60 hover:bg-slate-100/60 transition-colors"
                >
                  {/* Row 1: Commodity Name + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Package size={13} className="text-brand shrink-0" />
                      <span className="font-semibold text-xs text-ink-900 truncate">{k.nama}</span>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: `${kColor}1A`, color: kColor }}
                    >
                      {k.status}
                    </span>
                  </div>

                  {/* Row 2: Volume Stok & Harga Spesifik Komoditas */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-surface-border/40">
                    <span className="font-semibold text-brand tabular-nums">
                      {formatJumlahText(k.jumlah)}
                    </span>
                    <span className="font-bold text-ink-900 bg-white px-2 py-0.5 rounded-md border border-surface-border shadow-2xs tabular-nums">
                      {hargaFmt}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Target Buffer Progress Bar */}
        {item.minBuffer && (
          <section className="bg-surface-muted rounded-xl p-3.5 space-y-2 border border-surface-border/60">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-ink-900 font-extrabold">
                <ShieldCheck size={14} className="text-brand shrink-0" />
                Keterpenuhan Buffer Stok BI
              </span>
              <span className={`font-extrabold tabular-nums ${isAman ? 'text-emerald-600' : isMenipis ? 'text-amber-600' : 'text-rose-600'}`}>
                {bufferRatio}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-ink-500 font-medium">
              <span>Fisik Gudang: <strong className="text-ink-900 font-bold">{formatJumlahText(item.stok)}</strong></span>
              <span>Target Min BI: <strong className="text-ink-900 font-bold">{formatJumlahText(item.minBuffer)}</strong></span>
            </div>

            <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  backgroundColor: statusColor,
                  width: `${Math.min(bufferRatio, 100)}%`
                }}
              />
            </div>
          </section>
        )}

        {/* Action Buttons: Order QRIS B2B & Google Maps */}
        <div className="space-y-2 pt-1">
          {isAdmin && (
            <button
              onClick={handleSimulateQRISOrder}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand hover:bg-brand-dark text-white font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-98"
            >
              <SendHorizontal size={14} />
              <span>Order Pasokan Darurat (QRIS B2B)</span>
            </button>
          )}

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-surface-muted text-ink-700 font-semibold text-xs rounded-xl border border-surface-border transition-all shadow-sm active:scale-98"
          >
            <MapPin size={14} className="text-brand" />
            <span>Telusuri Rute & Lokasi (Google Maps)</span>
            <ExternalLink size={13} className="text-ink-400" />
          </a>
        </div>
      </div>
    </div>
  )
}
