'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  FileText,
  Loader2,
  Inbox,
} from 'lucide-react';
import { IncidentReport } from '@/types/database';

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

function getStatusLabel(status: string): { text: string; className: string } {
  switch (status) {
    case 'PENDING':
      return { text: 'MENUNGGU VERIFIKASI', className: 'bg-[#fee2e2] text-[#dc2626]' };
    case 'INVESTIGATING':
      return { text: 'SEDANG INVESTIGASI', className: 'bg-[#f0c059] text-[#102e91]' };
    case 'RESOLVED':
      return { text: 'SELESAI', className: 'bg-[#b5e6c5] text-[#065f46]' };
    default:
      return { text: status, className: 'bg-[#f1f5f9] text-[#64748b]' };
  }
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialTicket = searchParams.get('ticket') || '';
  const [ticketInput, setTicketInput] = useState(initialTicket);
  const [searchedTicket, setSearchedTicket] = useState(initialTicket);
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchReport = useCallback(async (ticketCode: string) => {
    if (!ticketCode.trim()) return;
    setIsLoading(true);
    setNotFound(false);
    setFetchError(null);
    setReport(null);

    try {
      console.log("[TRACK] Searching for ticket:", ticketCode);
      const res = await fetch('/api/reports');
      const json = await res.json();
      console.log("[TRACK /api/reports Response]:", json);

      if (json.status !== 'success') {
        setFetchError(json.message ?? 'Gagal memuat data laporan.');
        return;
      }

      const found = (json.data as IncidentReport[]).find(
        (r) => r.ticket_code.toLowerCase() === ticketCode.toLowerCase()
      );

      if (found) {
        console.log("[TRACK] Ticket found:", found.ticket_code);
        setReport(found);
      } else {
        console.log("[TRACK] Ticket not found:", ticketCode);
        setNotFound(true);
      }
    } catch (err) {
      console.error("[TRACK Error]:", err);
      setFetchError('Tidak dapat terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialTicket) {
      fetchReport(initialTicket);
    }
  }, [initialTicket, fetchReport]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ticketInput.trim();
    if (trimmed) {
      setSearchedTicket(trimmed);
      fetchReport(trimmed);
    }
  };

  const statusInfo = report ? getStatusLabel(report.status) : null;

  // Determine timeline step completion
  const stepIndex = report
    ? report.status === 'RESOLVED' ? 4
    : report.status === 'INVESTIGATING' ? 3
    : 1
    : 0;

  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-[#64748b]" />
          <input
            type="text"
            required
            placeholder="Masukkan Kode Tiket (Contoh: TK-20260928-1234)"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            className="w-full h-11 pl-9 pr-3 bg-[#ffffff] border border-[#cbd5e1] rounded-sm text-sm font-mono focus:border-[#1257bb] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 px-4 bg-[#1257bb] text-white font-bold text-xs rounded-sm hover:bg-[#102e91] disabled:opacity-50"
        >
          {isLoading ? 'Mencari...' : 'Cari'}
        </button>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-8 flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-[#1257bb] animate-spin" />
          <p className="text-sm text-[#64748b]">Mencari tiket laporan...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && fetchError && (
        <div className="bg-[#fee2e2] border border-[#dc2626] rounded-sm p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-[#991b1b]">Gagal Memuat Data</div>
            <p className="text-xs text-[#991b1b] mt-0.5">{fetchError}</p>
          </div>
        </div>
      )}

      {/* Not Found State */}
      {!isLoading && notFound && (
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-8 text-center space-y-2">
          <Inbox className="w-8 h-8 text-[#cbd5e1] mx-auto" />
          <p className="text-sm font-semibold text-[#64748b]">
            Tiket tidak ditemukan
          </p>
          <p className="text-xs text-[#94a3b8]">
            Kode tiket <strong className="font-mono text-[#102e91]">{searchedTicket}</strong> tidak ditemukan dalam sistem. Pastikan kode yang dimasukkan sudah benar.
          </p>
        </div>
      )}

      {/* Ticket Details & Timeline Card */}
      {!isLoading && report && statusInfo && (
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
            <div>
              <span className="text-[11px] font-mono text-[#64748b]">KODE TIKET RESMI</span>
              <h2 className="text-base font-mono font-bold text-[#102e91]">{report.ticket_code}</h2>
            </div>
            <span className={`px-2.5 py-1 font-mono font-bold text-xs rounded-sm ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          </div>

          {/* Correlation Callout - only show if correlation exists */}
          {report.correlation_score > 0 && (
            <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1257bb]">
                <ShieldCheck className="w-4 h-4" />
                <span>TERVALIDASI INCIDENT CORRELATION ENGINE ({report.correlation_score}%)</span>
              </div>
              {report.correlated_sensor_id && (
                <p className="text-xs text-[#475569]">
                  Laporan berkorelasi dengan data sensor terdekat.
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm">
            <div className="text-[11px] font-mono text-[#64748b] uppercase mb-1">Deskripsi Laporan</div>
            <p className="text-xs text-[#475569] italic">&quot;{report.description}&quot;</p>
          </div>

          {/* Photo Evidence */}
          {report.image_url && (
            <div className="space-y-1">
              <div className="text-[11px] font-mono font-bold text-[#102e91]">FOTO BUKTI:</div>
              <div className="h-44 w-full bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm overflow-hidden">
                <img 
                  src={report.image_url} 
                  alt="Bukti limbah" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-mono font-bold text-[#102e91]">TAHAPAN TINDAK LANJUT DLH</h3>
            
            <div className="relative border-l-2 border-[#1257bb] ml-3 pl-4 space-y-4">
              {/* Step 1 - Laporan Diterima */}
              <div className="relative">
                <span className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full ${stepIndex >= 1 ? 'bg-[#1257bb]' : 'bg-[#cbd5e1]'}`}></span>
                <div className="text-xs font-bold text-[#102e91]">1. Laporan Diterima Sistem</div>
                <div className="text-[11px] text-[#64748b]">Terkonfirmasi via verifikasi WhatsApp dan koordinat GPS.</div>
              </div>

              {/* Step 2 - Analisis Spasial */}
              <div className={`relative ${stepIndex < 2 ? 'opacity-40' : ''}`}>
                <span className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full ${stepIndex >= 2 ? 'bg-[#1257bb]' : 'bg-[#cbd5e1]'}`}></span>
                <div className="text-xs font-bold text-[#102e91]">2. Analisis Spasial & Verifikasi Sensor</div>
                <div className="text-[11px] text-[#64748b]">Korelasi terverifikasi dengan data sensor terdekat.</div>
              </div>

              {/* Step 3 - Investigasi Lapangan */}
              <div className={`relative ${stepIndex < 3 ? 'opacity-40' : ''}`}>
                <span className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full ${
                  stepIndex === 3 ? 'bg-[#f0c059] border-2 border-[#102e91]' 
                  : stepIndex > 3 ? 'bg-[#1257bb]' 
                  : 'bg-[#cbd5e1]'
                }`}></span>
                <div className={`text-xs font-bold ${stepIndex === 3 ? 'text-[#d97706]' : 'text-[#102e91]'}`}>
                  3. Investigasi Lapangan PPNS {stepIndex === 3 ? '(Sedang Berjalan)' : ''}
                </div>
                {report.officer_notes && stepIndex >= 3 && (
                  <div className="text-xs text-[#475569] mt-0.5 bg-[#f8fafc] p-2 border border-[#e2e8f0] rounded-sm">
                    <strong>Catatan Petugas DLH:</strong> {report.officer_notes}
                  </div>
                )}
              </div>

              {/* Step 4 - Penindakan Hukum */}
              <div className={`relative ${stepIndex < 4 ? 'opacity-40' : ''}`}>
                <span className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full ${stepIndex >= 4 ? 'bg-[#1257bb]' : 'bg-[#cbd5e1]'}`}></span>
                <div className="text-xs font-bold text-[#64748b]">4. Penindakan Hukum & Rekomendasi Selesai</div>
                <div className="text-[11px] text-[#64748b]">Pemberian sanksi administratif / penutupan saluran pembuangan ilegal.</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e2e8f0] flex justify-between items-center text-xs">
            <span className="text-[#64748b]">Pelapor: {report.reporter_phone}</span>
            <span className="font-mono text-[#102e91]">
              Dibuat: {formatTimestamp(report.created_at)}
            </span>
          </div>
          {report.updated_at && report.updated_at !== report.created_at && (
            <div className="text-right text-[11px] font-mono text-[#64748b]">
              Terakhir diperbarui: {formatTimestamp(report.updated_at)}
            </div>
          )}
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
