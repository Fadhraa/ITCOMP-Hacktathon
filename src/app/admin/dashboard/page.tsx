'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Activity, 
  Waves, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Layers, 
  RefreshCw,
  Clock,
  ArrowLeft
} from 'lucide-react';

export default function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<'map' | 'tickets' | 'sensors'>('map');
  const [selectedTicket, setSelectedTicket] = useState({
    id: 'TK-2026-0925-081',
    reporter: 'Petambak Pak Sugeng (+62 812-7890-XXXX)',
    time: '25 Menit Lalu (11:50 WIB)',
    coords: 'Lat: -7.1245, Long: 112.7891 (Saluran Primer Tambak Delta Timur)',
    desc: 'Pembuangan limbah hitam berbusa tebal dan berbau menyengat dari pipa outfall industri.',
    correlation: 94,
    correlatedNode: 'Node A-04 (pH 5.4)',
    status: 'INVESTIGATING',
    officerNotes: 'Tim PPNS Lingkungan Hidup diterjunkan ke titik outfall Pabrik Kimia Blok C untuk uji sampel lab.'
  });

  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  const triggerScenario = (scenarioName: string) => {
    setSimulationStatus(`Skenario "${scenarioName}" aktif. Data tersinkronisasi via Supabase.`);
    setTimeout(() => setSimulationStatus(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col">
      {/* Top Tactical Navigation Bar */}
      <header className="bg-[#ffffff] border-b border-[#e2e8f0] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#102e91]">
            <ArrowLeft className="w-4 h-4" />
            <span>Portal Warga</span>
          </Link>
          <div className="h-4 w-px bg-[#cbd5e1]"></div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-[#102e91]">AquaGuard Command Center</h1>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm font-semibold text-[#102e91]">
                DLH MONITORING V1.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#64748b]">DINAS LINGKUNGAN HIDUP KOTA // BIDANG PENGAWASAN PESISIR</p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 border border-[#e2e8f0] rounded-sm text-xs font-semibold">
          <button 
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-sm transition-colors ${activeTab === 'map' ? 'bg-[#102e91] text-white' : 'text-[#475569] hover:text-[#102e91]'}`}
          >
            Peta Krisis &amp; Dispersi
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-3 py-1.5 rounded-sm transition-colors ${activeTab === 'tickets' ? 'bg-[#102e91] text-white' : 'text-[#475569] hover:text-[#102e91]'}`}
          >
            Manajemen Tiket (4 Pending)
          </button>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#b5e6c5] text-[#065f46] rounded-full font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#065f46] animate-pulse"></span>
            <span>IoT Stream Active</span>
          </div>
          <span className="font-mono text-[#64748b]">12:15 WIB</span>
          <div className="px-2.5 py-1 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm font-bold text-[#102e91]">
            Petugas: Sdr. Hendra (PPNS)
          </div>
        </div>
      </header>

      {/* Top 4-Column KPI Telemetry Strip */}
      <section className="bg-[#ffffff] border-b border-[#e2e8f0] px-6 py-3">
        <div className="grid grid-cols-4 gap-4">
          <div className="border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
            <div className="text-[11px] font-mono text-[#64748b] uppercase">Status Zonasi Pesisir</div>
            <div className="text-lg font-bold text-[#d97706] mt-0.5">SIAGA 1 (WASPADA)</div>
            <div className="text-[11px] text-[#475569]">Sektor Delta Tambak Timur</div>
          </div>

          <div className="border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
            <div className="text-[11px] font-mono text-[#64748b] uppercase">Rerata Keasaman (pH)</div>
            <div className="text-lg font-bold text-[#dc2626] mt-0.5">5.6 pH <span className="text-xs text-[#dc2626] font-normal">(-1.8 dari normal)</span></div>
            <div className="text-[11px] text-[#475569]">Anomali asam pekat di Muara</div>
          </div>

          <div className="border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
            <div className="text-[11px] font-mono text-[#64748b] uppercase">Prediksi Pasang ROB</div>
            <div className="text-lg font-bold text-[#102e91] mt-0.5">142 cm <span className="text-xs text-[#4d93b1] font-normal">(Batas 160 cm)</span></div>
            <div className="text-[11px] text-[#475569]">Puncak diprediksi: 14:15 WIB</div>
          </div>

          <div className="border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
            <div className="text-[11px] font-mono text-[#64748b] uppercase">Antrean Laporan Warga</div>
            <div className="text-lg font-bold text-[#1257bb] mt-0.5">4 Butuh Verifikasi</div>
            <div className="text-[11px] text-[#475569]">Total 14 laporan hari ini</div>
          </div>
        </div>
      </section>

      {/* Main Split Desktop Grid */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Left Side: GIS Map View (7 Cols) */}
        <section className="col-span-7 bg-[#ffffff] border border-[#e2e8f0] rounded-sm flex flex-col overflow-hidden">
          {/* Map Header & Controls */}
          <div className="p-3 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1257bb]" />
              <span className="font-mono text-xs font-bold text-[#102e91]">PETA GIS KRISIS LINGKUNGAN PESISIR</span>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#1257bb]" />
                <span>Sensor Buoy (3)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#dc2626]" />
                <span>Laporan Warga</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#f0c059]" />
                <span>Zona Bahaya Tambak</span>
              </label>
            </div>
          </div>

          {/* Map Viewport Placeholder / Canvas */}
          <div className="flex-1 bg-[#f1f5f9] relative p-6 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1.5 bg-[#ffffff] border border-[#cbd5e1] rounded-sm shadow-sm text-xs font-mono">
                Pusat Koordinat: -7.1245, 112.7891 (Estuari Sektor Delta)
              </div>
            </div>

            {/* Visual Simulated Map Elements */}
            <div className="relative w-full h-80 border border-dashed border-[#cbd5e1] rounded-sm bg-[#ffffff] p-4 flex flex-col justify-center items-center text-center">
              <div className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm max-w-sm space-y-2">
                <div className="text-xs font-bold text-[#102e91]">Area Leaflet Map Terintegrasi</div>
                <p className="text-[11px] text-[#64748b]">
                  Rekan tim Anda dapat langsung memasang komponen <code>react-leaflet</code> di komponen ini menggunakan data dari <code>/api/sensors</code>.
                </p>
                <div className="flex justify-center gap-2 pt-1 font-mono text-[10px]">
                  <span className="px-2 py-0.5 bg-[#fee2e2] text-[#dc2626] border border-[#dc2626] rounded-sm font-bold">
                    NODE-A04: 5.4 pH (Alert)
                  </span>
                  <span className="px-2 py-0.5 bg-[#b5e6c5] text-[#065f46] rounded-sm font-bold">
                    NODE-B01: 7.4 pH
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Simulation Action Bar (Hackathon Demo Trigger) */}
            <div className="mt-4 p-3 bg-[#ffffff] border border-[#e2e8f0] rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#102e91]">SIMULATION SCENARIO TRIGGER (DEMO JURI)</span>
                {simulationStatus && (
                  <span className="text-xs text-[#059669] font-mono font-bold animate-pulse">
                    {simulationStatus}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerScenario('Lonjakan Limbah Asam (pH 5.2)')}
                  className="px-3 py-2 bg-[#f0c059] text-[#102e91] font-bold text-xs rounded-sm hover:bg-[#d97706]"
                >
                  Simulasi Lonjakan Limbah Asam
                </button>
                <button
                  onClick={() => triggerScenario('Puncak Pasang ROB (155 cm)')}
                  className="px-3 py-2 bg-[#1257bb] text-white font-bold text-xs rounded-sm hover:bg-[#102e91]"
                >
                  Simulasi Puncak ROB
                </button>
                <button
                  onClick={() => triggerScenario('Reset Status Normal')}
                  className="px-3 py-2 bg-[#ffffff] border border-[#cbd5e1] text-[#475569] font-bold text-xs rounded-sm hover:bg-[#f1f5f9]"
                >
                  Reset Normal
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Incident Ticketing & Action Dispatch (5 Cols) */}
        <section className="col-span-5 bg-[#ffffff] border border-[#e2e8f0] rounded-sm flex flex-col p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
            <div>
              <span className="text-[11px] font-mono text-[#64748b]">TIKET LAPORAN PRIORITAS</span>
              <h2 className="text-base font-mono font-bold text-[#102e91]">#{selectedTicket.id}</h2>
            </div>
            <span className="px-2 py-0.5 bg-[#fee2e2] text-[#dc2626] font-mono font-bold text-xs rounded-sm border border-[#dc2626]">
              PRIORITAS TINGGI
            </span>
          </div>

          {/* AI Correlation Callout */}
          <div className="p-3 bg-[#f8fafc] border border-[#1257bb] rounded-sm space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1257bb]">
              <ShieldCheck className="w-4 h-4" />
              <span>Korelasi {selectedTicket.correlation}% dengan {selectedTicket.correlatedNode}</span>
            </div>
            <p className="text-[11px] text-[#475569]">
              Sistem mendeteksi selisih waktu 12 menit antara laporan foto warga dengan anomali penurunan pH pada saluran muara.
            </p>
          </div>

          {/* Reporter & Location Meta */}
          <div className="space-y-1 text-xs">
            <div className="text-[#64748b]">Pelapor: <strong className="text-[#102e91]">{selectedTicket.reporter}</strong></div>
            <div className="text-[#64748b]">Waktu Masuk: <strong className="text-[#102e91]">{selectedTicket.time}</strong></div>
            <div className="text-[#64748b]">Lokasi: <span className="font-mono text-[#102e91]">{selectedTicket.coords}</span></div>
          </div>

          {/* Photo Proof Container */}
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-[#102e91]">FOTO BUKTI LAPORAN WARGA:</div>
            <div className="h-44 w-full bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80" 
                alt="Bukti limbah" 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-2 py-0.5 bg-black/75 text-white font-mono text-[10px] rounded-sm">
                GPS Verified
              </span>
            </div>
            <p className="text-[11px] text-[#475569] italic pt-1">
              &quot;{selectedTicket.desc}&quot;
            </p>
          </div>

          {/* Action Dispatch Form */}
          <div className="space-y-2 border-t border-[#e2e8f0] pt-3">
            <label className="block text-xs font-mono font-bold text-[#102e91]">
              DISPOSISI &amp; CATATAN PETUGAS PPNS:
            </label>
            <textarea
              rows={3}
              defaultValue={selectedTicket.officerNotes}
              className="w-full p-2.5 bg-[#ffffff] border border-[#cbd5e1] rounded-sm text-xs focus:border-[#1257bb] focus:outline-none"
            />
            
            <button
              onClick={() => alert('Disposisi terkirim! Status tiket telah diperbarui dan notifikasi dikirim ke pelapor.')}
              className="w-full h-11 bg-[#102e91] hover:bg-[#1257bb] text-white font-bold text-xs rounded-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Disposisi &amp; Update Status Pelapor</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
