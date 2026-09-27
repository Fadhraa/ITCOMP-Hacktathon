'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Droplets, 
  Waves, 
  Activity, 
  Bell, 
  MapPin, 
  Search, 
  FileText, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { SensorNode } from '@/types/database';

export default function CitizenDashboard() {
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [selectedSensorIndex, setSelectedSensorIndex] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [waAlertEnabled, setWaAlertEnabled] = useState(true);

  useEffect(() => {
    fetch('/api/sensors')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length > 0) {
          setSensors(data.data);
        }
      })
      .catch((err) => console.error('Failed to load sensors:', err));
  }, []);

  const activeSensor = sensors[selectedSensorIndex] || {
    sensor_code: 'NODE-A04',
    location_name: 'Muara Tambak Delta Timur',
    latest_telemetry: {
      ph_level: 5.4,
      water_level_cm: 138,
      salinity_ppt: 22.5,
      status: 'WARNING',
      action_directive: 'Tindakan Segera: Tutup pintu air primer tambak! Terdeteksi anomali keasaman air laut mendekati batas toleransi benur.',
      recorded_at: new Date().toISOString()
    }
  };

  const telemetry = activeSensor.latest_telemetry;
  const isWarning = telemetry?.status === 'WARNING';
  const isDanger = telemetry?.status === 'DANGER';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-[#102e91] flex items-center justify-center text-white font-bold text-sm">
              AG
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-[#102e91]">AquaGuard Coastal</h1>
              <p className="text-[11px] font-mono text-[#64748b]">EARLY WARNING SYSTEM</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b5e6c5] text-[#065f46] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#065f46] animate-pulse"></span>
            <span>Sensor Aktif</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Sector Selector */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-[#102e91]">
            <MapPin className="w-4 h-4 text-[#1257bb]" />
            <span>{activeSensor.location_name}</span>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm font-semibold">
            {activeSensor.sensor_code}
          </span>
        </div>

        {/* Action Directive Emergency Banner */}
        <div className={`p-4 rounded-sm border ${
          isDanger 
            ? 'bg-[#fee2e2] border-[#dc2626] text-[#991b1b]'
            : isWarning 
            ? 'bg-[#f0c059] border-[#d97706] text-[#102e91]'
            : 'bg-[#b5e6c5] border-[#059669] text-[#065f46]'
        }`}>
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="font-mono font-bold tracking-wide text-xs">
              STATUS: {telemetry?.status || 'NORMAL'}
            </span>
          </div>
          <p className="font-semibold text-sm leading-snug">
            {telemetry?.action_directive || 'Kondisi air terpantau aman.'}
          </p>
          <div className="mt-2 text-[11px] font-mono opacity-80">
            Terakhir diperbarui: {new Date(telemetry?.recorded_at || Date.now()).toLocaleTimeString('id-ID')} WIB
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-1 gap-3">
          {/* pH Card */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#102e91]">
                <Activity className="w-4 h-4 text-[#1257bb]" />
                KEASAMAN AIR (pH)
              </span>
              <span className={`px-2 py-0.5 rounded-sm font-bold text-[11px] ${
                telemetry?.ph_level && telemetry.ph_level < 6.5 
                  ? 'bg-[#f0c059] text-[#102e91]' 
                  : 'bg-[#b5e6c5] text-[#065f46]'
              }`}>
                {telemetry?.ph_level && telemetry.ph_level < 6.5 ? 'Terlalu Asam (Waspada)' : 'Normal'}
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold tracking-tight text-[#102e91]">
                {telemetry?.ph_level?.toFixed(1) || '7.0'}
              </span>
              <span className="text-xs font-mono text-[#4d93b1]">pH</span>
            </div>

            <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#dc2626] w-1/4 h-full" title="Bahaya Asam (< 5.5)"></div>
              <div className="bg-[#f0c059] w-1/6 h-full" title="Waspada (5.5 - 6.5)"></div>
              <div className="bg-[#b5e6c5] w-2/4 h-full" title="Rentang Aman (6.5 - 8.5)"></div>
              <div className="bg-[#4d93b1] w-1/12 h-full" title="Basa (> 8.5)"></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#64748b] mt-1">
              <span>Batas Benur Aman: 6.5 - 8.5 pH</span>
              <span className="text-[#dc2626] font-semibold">Toleransi Kritis &lt; 5.5</span>
            </div>
          </div>

          {/* Water Level / ROB Card */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4">
            <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#102e91]">
                <Waves className="w-4 h-4 text-[#1784e1]" />
                PASANG AIR LAUT (ROB)
              </span>
              <span className="px-2 py-0.5 rounded-sm font-bold text-[11px] bg-[#f1f5f9] text-[#102e91] border border-[#cbd5e1]">
                Menuju Puncak Pasang
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold tracking-tight text-[#102e91]">
                {telemetry?.water_level_cm || 0}
              </span>
              <span className="text-xs font-mono text-[#4d93b1]">cm</span>
            </div>

            <p className="text-xs text-[#475569]">
              Batas Ketinggian Tanggul: <strong className="text-[#102e91]">160 cm</strong> (Margin aman: 22 cm)
            </p>
            <p className="text-[11px] font-mono text-[#1784e1] mt-1">
              Estimasi Puncak ROB: 14:15 WIB
            </p>
          </div>

          {/* Salinity Card */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4">
            <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#102e91]">
                <Droplets className="w-4 h-4 text-[#54b7b0]" />
                SALINITAS AIR
              </span>
              <span className="px-2 py-0.5 rounded-sm font-bold text-[11px] bg-[#b5e6c5] text-[#065f46]">
                Normal
              </span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[#102e91]">
                {telemetry?.salinity_ppt || 0}
              </span>
              <span className="text-xs font-mono text-[#4d93b1]">ppt</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-1 font-mono">Rentang optimal tambak: 18 - 25 ppt</p>
          </div>
        </div>

        {/* 6-Hour Trend Chart Preview (SVG Minimalist) */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-mono font-bold text-[#102e91]">TREN PENURUNAN pH (6 JAM TERAKHIR)</h2>
            <span className="text-[11px] text-[#dc2626] font-mono font-semibold">-2.0 pH / 6 Jam</span>
          </div>

          <div className="h-28 w-full relative border-l border-b border-[#cbd5e1] pt-2 pb-1 px-1">
            {/* Dashed Threshold Line */}
            <div className="absolute top-[42%] left-0 right-0 border-t border-dashed border-[#dc2626] flex items-center justify-end">
              <span className="text-[9px] font-mono bg-[#ffffff] text-[#dc2626] px-1 -mt-2.5">
                Batas Aman (6.5 pH)
              </span>
            </div>

            {/* SVG Step Line */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
              <polyline
                fill="none"
                stroke="#1257bb"
                strokeWidth="2.5"
                points="0,15 60,18 120,22 180,45 240,65 300,72"
              />
              <circle cx="0" cy="15" r="3.5" fill="#1257bb" />
              <circle cx="60" cy="18" r="3.5" fill="#1257bb" />
              <circle cx="120" cy="22" r="3.5" fill="#1257bb" />
              <circle cx="180" cy="45" r="3.5" fill="#f0c059" />
              <circle cx="240" cy="65" r="3.5" fill="#dc2626" />
              <circle cx="300" cy="72" r="4.5" fill="#dc2626" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#64748b] mt-2">
            <span>06:00</span>
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span className="text-[#102e91] font-bold">Sekarang</span>
          </div>
        </div>

        {/* Proactive Push EWS Switch Card */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#1257bb]" />
            <h2 className="text-xs font-mono font-bold text-[#102e91]">PERINGATAN PROAKTIF (EWS DARURAT)</h2>
          </div>
          <p className="text-xs text-[#475569]">
            Dapatkan peringatan otomatis di ponsel saat pH turun atau air ROB naik tanpa perlu membuka web terus-menerus.
          </p>
          
          <div className="space-y-2 pt-1">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-sm bg-[#f8fafc] border border-[#e2e8f0]">
              <span className="text-xs font-medium text-[#102e91]">WhatsApp Alert Siaga Tambak</span>
              <input
                type="checkbox"
                checked={waAlertEnabled}
                onChange={(e) => setWaAlertEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#1257bb]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-sm bg-[#f8fafc] border border-[#e2e8f0]">
              <span className="text-xs font-medium text-[#102e91]">Web Push Notification Browser</span>
              <input
                type="checkbox"
                checked={pushEnabled}
                onChange={(e) => setPushEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#1257bb]"
              />
            </label>
          </div>
        </div>

        {/* Government Portal Link Banner */}
        <div className="p-3 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#102e91]">Portal Khusus Petugas DLH?</div>
            <div className="text-[11px] text-[#64748b]">Buka Command Center & Peta Krisis GIS</div>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-3 py-1.5 bg-[#102e91] text-white text-xs font-bold rounded-sm flex items-center gap-1 hover:bg-[#1230b3]"
          >
            <span>Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      {/* Floating Bottom Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff] border-t border-[#e2e8f0] p-3 shadow-sm">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          <Link
            href="/lapor"
            className="flex items-center justify-center gap-2 h-12 bg-[#1257bb] text-white rounded-sm font-bold text-sm hover:bg-[#102e91] transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Lapor Limbah</span>
          </Link>

          <Link
            href="/lapor/track"
            className="flex items-center justify-center gap-2 h-12 bg-[#ffffff] border-1.5 border-[#1257bb] text-[#1257bb] rounded-sm font-bold text-sm hover:bg-[#f8fafc] transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Lacak Tiket</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
