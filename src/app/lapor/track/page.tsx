'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  FileText
} from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialTicket = searchParams.get('ticket') || '';
  const [ticketInput, setTicketInput] = useState(initialTicket);
  const [searchedTicket, setSearchedTicket] = useState(initialTicket || 'TK-2026-0925-081');

  useEffect(() => {
    if (initialTicket) {
      setTicketInput(initialTicket);
      setSearchedTicket(initialTicket);
    }
  }, [initialTicket]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketInput.trim()) {
      setSearchedTicket(ticketInput.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-[#64748b]" />
          <input
            type="text"
            required
            placeholder="Masukkan Kode Tiket (Contoh: TK-2026-0925-081)"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            className="w-full h-11 pl-9 pr-3 bg-[#ffffff] border border-[#cbd5e1] rounded-sm text-sm font-mono focus:border-[#1257bb] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-11 px-4 bg-[#1257bb] text-white font-bold text-xs rounded-sm hover:bg-[#102e91]"
        >
          Cari
        </button>
      </form>

      {/* Ticket Details & Timeline Card */}
      {searchedTicket && (
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
            <div>
              <span className="text-[11px] font-mono text-[#64748b]">KODE TIKET RESMI</span>
              <h2 className="text-base font-mono font-bold text-[#102e91]">{searchedTicket}</h2>
            </div>
            <span className="px-2.5 py-1 bg-[#f0c059] text-[#102e91] font-mono font-bold text-xs rounded-sm">
              SEDANG INVESTIGASI
            </span>
          </div>

          {/* AI Correlation Callout */}
          <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1257bb]">
              <ShieldCheck className="w-4 h-4" />
              <span>TERVALIDASI INCIDENT CORRELATION ENGINE (94%)</span>
            </div>
            <p className="text-xs text-[#475569]">
              Laporan terkonfirmasi berkorelasi langsung dengan penurunan drastis pH pada Sensor Node A-04 di Muara Tambak Delta Timur.
            </p>
          </div>

          {/* Status Timeline */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-mono font-bold text-[#102e91]">TAHAPAN TINDAK LANJUT DLH</h3>
            
            <div className="relative border-l-2 border-[#1257bb] ml-3 pl-4 space-y-4">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-[#1257bb]"></span>
                <div className="text-xs font-bold text-[#102e91]">1. Laporan Diterima Sistem</div>
                <div className="text-[11px] text-[#64748b]">Terkonfirmasi via verifikasi WhatsApp dan koordinat GPS.</div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-[#1257bb]"></span>
                <div className="text-xs font-bold text-[#102e91]">2. Analisis Spasial & Verifikasi Sensor</div>
                <div className="text-[11px] text-[#64748b]">Korelasi terverifikasi dengan arah pasang air laut ROB.</div>
              </div>

              {/* Step 3 - Active */}
              <div className="relative">
                <span className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-[#f0c059] border-2 border-[#102e91]"></span>
                <div className="text-xs font-bold text-[#d97706]">3. Investigasi Lapangan PPNS (Sedang Berjalan)</div>
                <div className="text-xs text-[#475569] mt-0.5 bg-[#f8fafc] p-2 border border-[#e2e8f0] rounded-sm">
                  <strong>Catatan Petugas DLH:</strong> Tim Pengawas PPNS telah dikerahkan ke titik outfall Pabrik Kimia Blok C untuk pengambilan sampel air baku laboratorium.
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative opacity-40">
                <span className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-[#cbd5e1]"></span>
                <div className="text-xs font-bold text-[#64748b]">4. Penindakan Hukum & Rekomendasi Selesai</div>
                <div className="text-[11px] text-[#64748b]">Pemberian sanksi administratif / penutupan saluran pembuangan ilegal.</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e2e8f0] flex justify-between items-center text-xs">
            <span className="text-[#64748b]">Pelapor: Petambak Sektor Timur</span>
            <span className="font-mono text-[#102e91]">Update: 20 Menit Lalu</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link href="/" className="p-1 rounded-sm text-[#102e91] hover:bg-[#f1f5f9]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-base text-[#102e91]">Lacak Tiket Laporan</h1>
            <p className="text-[11px] font-mono text-[#64748b]">TRANSPARANSI TINDAK LANJUT DLH</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4">
        <Suspense fallback={<div className="text-center text-xs p-4">Memuat pelacak tiket...</div>}>
          <TrackContent />
        </Suspense>
      </main>
    </div>
  );
}
