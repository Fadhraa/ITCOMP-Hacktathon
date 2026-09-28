'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Activity, 
  Waves, 
  FileText, 
  AlertTriangle, 
  Send, 
  Layers, 
  RefreshCw,
  Clock,
  ArrowLeft,
  Loader2,
  WifiOff,
  Inbox,
} from 'lucide-react';
import { SensorNode, IncidentReport } from '@/types/database';

export default function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<'map' | 'tickets'>('map');

  // Sensor state
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [sensorsLoading, setSensorsLoading] = useState(true);
  const [sensorsError, setSensorsError] = useState<string | null>(null);

  // Tickets state
  const [tickets, setTickets] = useState<IncidentReport[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Officer notes state
  const [officerNotes, setOfficerNotes] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchSensors = async () => {
    setSensorsLoading(true);
    setSensorsError(null);
    try {
      const res = await fetch('/api/sensors');
      const json = await res.json();
      if (json.status === 'success') {
        setSensors(json.data ?? []);
      } else {
        setSensorsError(json.message ?? 'Gagal memuat sensor.');
      }
    } catch {
      setSensorsError('Tidak dapat terhubung ke server.');
    } finally {
      setSensorsLoading(false);
    }
  };

  const fetchTickets = async () => {
    setTicketsLoading(true);
    setTicketsError(null);
    try {
      const res = await fetch('/api/reports');
      const json = await res.json();
      if (json.status === 'success') {
        setTickets(json.data ?? []);
        if (json.data?.length > 0 && !selectedTicketId) {
          setSelectedTicketId(json.data[0].id);
        }
      } else {
        setTicketsError(json.message ?? 'Gagal memuat tiket.');
      }
    } catch {
      setTicketsError('Tidak dapat terhubung ke server.');
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
    fetchTickets();
  }, []);

  const handleRefresh = () => {
    fetchSensors();
    fetchTickets();
    setLastRefresh(new Date());
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) ?? null;
  const pendingCount = tickets.filter((t) => t.status === 'PENDING').length;

  // Aggregate KPIs dari sensor data
  const avgPh = sensors.length > 0
    ? (sensors.reduce((sum, s) => sum + (s.latest_telemetry?.ph_level ?? 0), 0) / sensors.filter(s => s.latest_telemetry).length)
    : null;
  const maxWaterLevel = sensors.length > 0
    ? Math.max(...sensors.map(s => s.latest_telemetry?.water_level_cm ?? 0))
    : null;
  const criticalSensors = sensors.filter(s => s.latest_telemetry?.status === 'DANGER' || s.latest_telemetry?.status === 'WARNING');

  const handleSendDisposisi = async () => {
    if (!selectedTicket || !officerNotes.trim()) return;
    setIsSending(true);
    // TODO: PATCH /api/reports/[id] untuk update status dan officer_notes
    // Sementara tampilkan alert sampai endpoint PATCH tersedia
    alert('Endpoint PATCH /api/reports/[id] belum diimplementasikan. Tambahkan di sprint berikutnya.');
    setIsSending(false);
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
            Manajemen Tiket {ticketsLoading ? '' : `(${pendingCount} Pending)`}
          </button>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-3 text-xs">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold ${
            sensorsLoading ? 'bg-[#f1f5f9] text-[#64748b]' 
            : sensorsError ? 'bg-[#fee2e2] text-[#dc2626]'
            : sensors.length > 0 ? 'bg-[#b5e6c5] text-[#065f46]'
            : 'bg-[#fef9c3] text-[#854d0e]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${sensorsLoading ? 'bg-[#64748b] animate-pulse' : sensorsError ? 'bg-[#dc2626]' : 'bg-[#065f46] animate-pulse'}`}></span>
            <span>{sensorsLoading ? 'Memuat...' : sensorsError ? 'Sensor Error' : `${sensors.length} Sensor Aktif`}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-2 py-1 text-[#64748b] hover:text-[#102e91] border border-[#e2e8f0] rounded-sm"
            title="Refresh data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="font-mono">{lastRefresh.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
          </button>
        </div>
      </header>

      {/* Top KPI Strip */}
      <section className="bg-[#ffffff] border-b border-[#e2e8f0] px-6 py-3">
        {sensorsLoading ? (
          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memuat data sensor...</span>
          </div>
        ) : sensorsError ? (
          <div className="flex items-center gap-2 text-xs text-[#dc2626]">
            <WifiOff className="w-4 h-4" />
            <span>{sensorsError}</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
              <div className="text-[11px] font-mono text-[#64748b] uppercase">Status Zonasi Pesisir</div>
              <div className={`text-lg font-bold mt-0.5 ${
                criticalSensors.length > 0 ? 'text-[#d97706]' : 'text-[#059669]'
              }`}>
                {criticalSensors.length > 0 ? `SIAGA (${criticalSensors.length} node)` : 'AMAN'}
              </div>
              <div className="text-[11px] text-[#475569]">{sensors.length} node terpantau</div>
            </div>

            <div className="border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
              <div className="text-[11px] font-mono text-[#64748b] uppercase">Rerata Keasaman (pH)</div>
              <div className={`text-lg font-bold mt-0.5 ${avgPh !== null && avgPh < 6.5 ? 'text-[#dc2626]' : 'text-[#102e91]'}`}>
                {avgPh !== null ? `${avgPh.toFixed(1)} pH` : '— pH'}
              </div>
              <div className="text-[11px] text-[#475569]">
                {avgPh !== null && avgPh < 6.5 ? 'Di bawah ambang aman' : 'Dalam batas normal'}
              </div>
            </div>

            <div className="border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
              <div className="text-[11px] font-mono text-[#64748b] uppercase">Pasang ROB Tertinggi</div>
              <div className={`text-lg font-bold mt-0.5 ${maxWaterLevel !== null && maxWaterLevel >= 150 ? 'text-[#dc2626]' : 'text-[#102e91]'}`}>
                {maxWaterLevel !== null ? `${maxWaterLevel} cm` : '— cm'}
                {maxWaterLevel !== null && <span className="text-xs text-[#4d93b1] font-normal"> (Batas 160 cm)</span>}
              </div>
              <div className="text-[11px] text-[#475569]">
                {maxWaterLevel !== null && maxWaterLevel >= 150 ? 'Mendekati batas tanggul' : 'Normal'}
              </div>
            </div>

            <div className="border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
              <div className="text-[11px] font-mono text-[#64748b] uppercase">Antrean Laporan Warga</div>
              <div className="text-lg font-bold text-[#1257bb] mt-0.5">
                {ticketsLoading ? '—' : `${pendingCount} Butuh Verifikasi`}
              </div>
              <div className="text-[11px] text-[#475569]">
                {ticketsLoading ? 'Memuat...' : `Total ${tickets.length} laporan`}
              </div>
            </div>
          </div>
        )}
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
                <span>Sensor Buoy ({sensors.length})</span>
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

          {/* Map Viewport Placeholder */}
          <div className="flex-1 bg-[#f1f5f9] relative p-6 flex flex-col justify-between overflow-hidden">
            {sensorsLoading ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-3">
                <Loader2 className="w-8 h-8 text-[#1257bb] animate-spin" />
                <p className="text-sm text-[#64748b]">Memuat koordinat sensor...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1.5 bg-[#ffffff] border border-[#cbd5e1] rounded-sm shadow-sm text-xs font-mono">
                    {sensors.length > 0
                      ? `Pusat Koordinat: ${sensors[0].latitude}, ${sensors[0].longitude}`
                      : 'Tidak ada sensor terdaftar'}
                  </div>
                </div>

                {/* Map Component Slot */}
                <div className="relative w-full h-80 border border-dashed border-[#cbd5e1] rounded-sm bg-[#ffffff] p-4 flex flex-col justify-center items-center text-center">
                  <div className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm max-w-sm space-y-2">
                    <div className="text-xs font-bold text-[#102e91]">Area Leaflet Map Terintegrasi</div>
                    <p className="text-[11px] text-[#64748b]">
                      Pasang komponen <code>react-leaflet</code> di sini menggunakan data dari <code>/api/sensors</code>.
                    </p>
                    {sensors.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 pt-1 font-mono text-[10px]">
                        {sensors.map((s) => (
                          <span
                            key={s.id}
                            className={`px-2 py-0.5 rounded-sm font-bold border ${
                              s.latest_telemetry?.status === 'DANGER'
                                ? 'bg-[#fee2e2] text-[#dc2626] border-[#dc2626]'
                                : s.latest_telemetry?.status === 'WARNING'
                                ? 'bg-[#f0c059] text-[#102e91] border-[#d97706]'
                                : 'bg-[#b5e6c5] text-[#065f46] border-[#059669]'
                            }`}
                          >
                            {s.sensor_code}: {s.latest_telemetry?.ph_level?.toFixed(1) ?? '—'} pH
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Right Side: Incident Ticketing (5 Cols) */}
        <section className="col-span-5 bg-[#ffffff] border border-[#e2e8f0] rounded-sm flex flex-col p-4 space-y-4 overflow-y-auto">
          {ticketsLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
              <Loader2 className="w-8 h-8 text-[#1257bb] animate-spin" />
              <p className="text-sm text-[#64748b]">Memuat tiket laporan...</p>
            </div>
          ) : ticketsError ? (
            <div className="flex items-start gap-2 p-3 bg-[#fee2e2] border border-[#dc2626] rounded-sm">
              <WifiOff className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#991b1b]">{ticketsError}</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
              <Inbox className="w-10 h-10 text-[#cbd5e1]" />
              <div>
                <p className="text-sm font-semibold text-[#64748b]">Belum ada laporan masuk</p>
                <p className="text-xs text-[#94a3b8] mt-1">Laporan dari warga akan muncul di sini setelah disubmit.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Ticket List Selector */}
              {tickets.length > 1 && (
                <div className="space-y-1 border-b border-[#e2e8f0] pb-3">
                  <div className="text-[11px] font-mono text-[#64748b] uppercase mb-1.5">Daftar Laporan Masuk</div>
                  {tickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTicketId(t.id); setOfficerNotes(t.officer_notes ?? ''); }}
                      className={`w-full text-left px-3 py-2 rounded-sm text-xs border transition-colors ${
                        t.id === selectedTicketId
                          ? 'bg-[#f0f4ff] border-[#1257bb] text-[#102e91]'
                          : 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:border-[#1257bb]'
                      }`}
                    >
                      <span className="font-mono font-bold">{t.ticket_code}</span>
                      <span className={`ml-2 px-1.5 py-0.5 rounded-sm font-bold text-[10px] ${
                        t.status === 'PENDING' ? 'bg-[#fee2e2] text-[#dc2626]'
                        : t.status === 'INVESTIGATING' ? 'bg-[#f0c059] text-[#102e91]'
                        : 'bg-[#b5e6c5] text-[#065f46]'
                      }`}>{t.status}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Ticket Detail */}
              {selectedTicket && (
                <>
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
                    <div>
                      <span className="text-[11px] font-mono text-[#64748b]">TIKET LAPORAN PRIORITAS</span>
                      <h2 className="text-base font-mono font-bold text-[#102e91]">#{selectedTicket.ticket_code}</h2>
                    </div>
                    <span className={`px-2 py-0.5 font-mono font-bold text-xs rounded-sm border ${
                      selectedTicket.priority === 'HIGH' ? 'bg-[#fee2e2] text-[#dc2626] border-[#dc2626]'
                      : selectedTicket.priority === 'MEDIUM' ? 'bg-[#f0c059] text-[#102e91] border-[#d97706]'
                      : 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]'
                    }`}>
                      {selectedTicket.priority === 'HIGH' ? 'PRIORITAS TINGGI' : selectedTicket.priority === 'MEDIUM' ? 'PRIORITAS SEDANG' : 'PRIORITAS RENDAH'}
                    </span>
                  </div>

                  {/* AI Correlation Callout */}
                  {selectedTicket.correlation_score > 0 && (
                    <div className="p-3 bg-[#f8fafc] border border-[#1257bb] rounded-sm space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1257bb]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Korelasi sensor: {selectedTicket.correlation_score}%</span>
                      </div>
                    </div>
                  )}

                  {/* Reporter & Location Meta */}
                  <div className="space-y-1 text-xs">
                    <div className="text-[#64748b]">Pelapor: <strong className="text-[#102e91]">{selectedTicket.reporter_phone}</strong></div>
                    <div className="text-[#64748b]">Waktu Masuk: <strong className="text-[#102e91]">{new Date(selectedTicket.created_at).toLocaleString('id-ID')}</strong></div>
                    {selectedTicket.latitude && selectedTicket.longitude && (
                      <div className="text-[#64748b]">Lokasi: <span className="font-mono text-[#102e91]">Lat: {selectedTicket.latitude}, Long: {selectedTicket.longitude}</span></div>
                    )}
                  </div>

                  {/* Photo Proof */}
                  {selectedTicket.image_url && (
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold text-[#102e91]">FOTO BUKTI LAPORAN WARGA:</div>
                      <div className="h-44 w-full bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm overflow-hidden relative">
                        <img 
                          src={selectedTicket.image_url} 
                          alt="Bukti limbah" 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 px-2 py-0.5 bg-black/75 text-white font-mono text-[10px] rounded-sm">
                          GPS Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-[#475569] italic pt-1">
                        &quot;{selectedTicket.description}&quot;
                      </p>
                    </div>
                  )}

                  {!selectedTicket.image_url && (
                    <p className="text-[11px] text-[#475569] italic border border-[#e2e8f0] rounded-sm p-3 bg-[#f8fafc]">
                      &quot;{selectedTicket.description}&quot;
                    </p>
                  )}

                  {/* Action Dispatch */}
                  <div className="space-y-2 border-t border-[#e2e8f0] pt-3">
                    <label className="block text-xs font-mono font-bold text-[#102e91]">
                      DISPOSISI &amp; CATATAN PETUGAS PPNS:
                    </label>
                    <textarea
                      rows={3}
                      value={officerNotes}
                      onChange={(e) => setOfficerNotes(e.target.value)}
                      placeholder="Tulis catatan disposisi dan tindak lanjut di lapangan..."
                      className="w-full p-2.5 bg-[#ffffff] border border-[#cbd5e1] rounded-sm text-xs focus:border-[#1257bb] focus:outline-none"
                    />
                    
                    <button
                      onClick={handleSendDisposisi}
                      disabled={isSending || !officerNotes.trim()}
                      className="w-full h-11 bg-[#102e91] hover:bg-[#1257bb] text-white font-bold text-xs rounded-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSending ? 'Mengirim...' : 'Kirim Disposisi & Update Status Pelapor'}</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
