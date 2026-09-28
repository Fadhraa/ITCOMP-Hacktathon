'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Phone, 
  Send, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6))
          });
          setIsDetectingLocation(false);
        },
        (error) => {
          console.warn('Geolocation failed, keeping default coastal coordinates:', error);
          setIsDetectingLocation(false);
        }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !description) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporter_phone: phone,
          description,
          image_url: photoPreview ?? null,
          latitude: location?.lat ?? null,
          longitude: location?.lng ?? null,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.status !== 'success') {
        alert(`Gagal mengirim laporan: ${json.message ?? 'Terjadi kesalahan server.'}`);
        return;
      }

      setSubmittedTicket(json.data.ticket_code);
    } catch {
      alert('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link href="/" className="p-1 rounded-sm text-[#102e91] hover:bg-[#f1f5f9]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-base text-[#102e91]">Form Lapor Cepat Limbah</h1>
            <p className="text-[11px] font-mono text-[#64748b]">AKSES PUBLIK TANPA LOGIN</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4">
        {submittedTicket ? (
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#b5e6c5] text-[#065f46] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-[#102e91]">Laporan Berhasil Terkirim</h2>
              <p className="text-xs text-[#475569] mt-1">
                Laporan Anda telah diteruskan ke Dinas Lingkungan Hidup (DLH) untuk verifikasi korelasi sensor.
              </p>
            </div>

            <div className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm">
              <div className="text-[11px] font-mono text-[#64748b] uppercase">Kode Tiket Pelacakan Anda:</div>
              <div className="text-xl font-mono font-bold text-[#1257bb] mt-1">{submittedTicket}</div>
              <div className="text-[11px] text-[#475569] mt-2">
                Simpan nomor tiket ini untuk melihat progres investigasi petugas di lapangan.
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/lapor/track?ticket=${submittedTicket}`}
                className="w-full h-12 bg-[#1257bb] text-white rounded-sm font-bold text-sm flex items-center justify-center hover:bg-[#102e91]"
              >
                Cek Status Tiket Sekarang
              </Link>
              <Link
                href="/"
                className="w-full h-12 bg-[#ffffff] border border-[#cbd5e1] text-[#102e91] rounded-sm font-bold text-sm flex items-center justify-center hover:bg-[#f1f5f9]"
              >
                Kembali ke Dashboard Utama
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Disclaimer notice */}
            <div className="p-3 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm flex items-start gap-2.5 text-xs text-[#475569]">
              <AlertCircle className="w-4 h-4 text-[#1257bb] flex-shrink-0 mt-0.5" />
              <span>
                Laporan foto Anda akan dikorelasikan otomatis dengan data penurunan pH sensor terdekat untuk memetakan sumber limbah.
              </span>
            </div>

            {/* Geolocation Section */}
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 space-y-2">
              <label className="block text-xs font-mono font-bold text-[#102e91]">
                KOORDINAT LOKASI INSIDEN (GPS PESISIR)
              </label>
              
              <div className="flex items-center justify-between p-2.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm">
                <div className="flex items-center gap-2 font-mono text-xs text-[#102e91]">
                  <MapPin className="w-4 h-4 text-[#dc2626]" />
                  <span>Lat: {location?.lat}, Long: {location?.lng}</span>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-2.5 py-1 text-xs font-bold bg-[#ffffff] border border-[#1257bb] text-[#1257bb] rounded-sm hover:bg-[#f1f5f9]"
                >
                  {isDetectingLocation ? 'Mendeteksi...' : 'Perbarui GPS'}
                </button>
              </div>
              <p className="text-[11px] text-[#64748b]">Koordinat otomatis mendeteksi lokasi perangkat Anda di kawasan tambak.</p>
            </div>

            {/* Phone Number Input */}
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 space-y-2">
              <label className="block text-xs font-mono font-bold text-[#102e91]">
                NOMOR KONTAK WHATSAPP (VERIFIKASI ANTI-SPAM)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3.5 text-[#64748b]" />
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 pl-10 pr-3 bg-[#ffffff] border border-[#cbd5e1] rounded-sm text-sm focus:border-[#1257bb] focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-[#64748b]">Dibutuhkan oleh petugas DLH jika perlu konfirmasi fisik di lokasi tambak.</p>
            </div>

            {/* Photo Upload */}
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 space-y-2">
              <label className="block text-xs font-mono font-bold text-[#102e91]">
                FOTO BUKTI PEMBUANGAN LIMBAH
              </label>
              
              {photoPreview ? (
                <div className="space-y-2">
                  <div className="relative h-44 w-full bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm overflow-hidden">
                    <img 
                      src={photoPreview} 
                      alt="Bukti limbah" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="text-xs text-[#dc2626] font-semibold underline"
                  >
                    Ganti Foto
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-[#cbd5e1] rounded-sm cursor-pointer hover:bg-[#f8fafc] transition-colors">
                  <Camera className="w-8 h-8 text-[#1257bb] mb-1" />
                  <span className="text-xs font-bold text-[#102e91]">Ambil Foto / Unggah Bukti</span>
                  <span className="text-[11px] text-[#64748b] mt-0.5">Format JPG/PNG (Maks 10MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Description */}
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 space-y-2">
              <label className="block text-xs font-mono font-bold text-[#102e91]">
                DESKRIPSI INDIKASI PENCEMARAN
              </label>
              <textarea
                required
                rows={3}
                placeholder="Jelaskan kondisi air: warna air (hitam/keruh), bau limbah kimia, arah buangan pipa, dll..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-[#ffffff] border border-[#cbd5e1] rounded-sm text-sm focus:border-[#1257bb] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#1257bb] hover:bg-[#102e91] text-white font-bold text-sm rounded-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim & Mengorelasikan...' : 'Kirim Laporan Resmi ke DLH'}</span>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
