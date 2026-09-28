"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Droplets,
  Waves,
  Activity,
  Bell,
  MapPin,
  Search,
  FileText,
  ArrowRight,
  Loader2,
  WifiOff,
  ChevronDown,
} from "lucide-react";
import { SensorNode } from "@/types/database";
import { supabase } from "@/lib/supabase/client";

export default function CitizenDashboard() {
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [selectedSensorIndex, setSelectedSensorIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [waAlertEnabled, setWaAlertEnabled] = useState(true);

  const fetchSensorsData = (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    console.log("[FETCH] Fetching sensors data from /api/sensors...");
    fetch("/api/sensors")
      .then((res) => res.json())
      .then((data) => {
        console.log("[API /api/sensors Response]:", data);
        if (data?.status === "success") {
          setSensors(data.data ?? []);
          setFetchError(null);
        } else {
          setFetchError(data?.message ?? "Gagal memuat data sensor.");
        }
      })
      .catch((err) => {
        console.error("[API /api/sensors Error]:", err);
        setFetchError("Tidak dapat terhubung ke server.");
      })
      .finally(() => {
        if (showLoader) setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSensorsData(true);

    // Supabase Realtime Subscription for instant EWS updates
    console.log("[CITIZEN REALTIME] Subscribing to sensor_telemetry_logs channel...");
    const telemetryChannel = supabase
      .channel('citizen_realtime_telemetry')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sensor_telemetry_logs' },
        (payload) => {
          console.log('[CITIZEN REALTIME] Sensor telemetry update received:', payload);
          fetchSensorsData(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(telemetryChannel);
    };
  }, []);

  const activeSensor = sensors[selectedSensorIndex] ?? null;
  const telemetry = activeSensor?.latest_telemetry ?? null;
  const isWarning = telemetry?.status === "WARNING";
  const isDanger = telemetry?.status === "DANGER";

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
              <h1 className="font-bold text-base tracking-tight text-[#102e91]">
                AquaGuard Coastal
              </h1>
              <p className="text-[11px] font-mono text-[#64748b]">
                EARLY WARNING SYSTEM
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-8 flex flex-col items-center gap-3 text-center">
            <Loader2 className="w-8 h-8 text-[#1257bb] animate-spin" />
            <p className="text-sm text-[#64748b]">
              Menghubungkan ke jaringan sensor pesisir...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && fetchError && (
          <div className="bg-[#fee2e2] border border-[#dc2626] rounded-sm p-4 flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-[#991b1b]">
                Sensor Tidak Terjangkau
              </div>
              <p className="text-xs text-[#991b1b] mt-0.5">{fetchError}</p>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!isLoading && !fetchError && sensors.length === 0 && (
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-8 text-center space-y-2">
            <Activity className="w-8 h-8 text-[#cbd5e1] mx-auto" />
            <p className="text-sm font-semibold text-[#64748b]">
              Belum ada sensor terdaftar
            </p>
            <p className="text-xs text-[#94a3b8]">
              Data sensor akan muncul setelah perangkat IoT dikonfigurasi di
              database.
            </p>
          </div>
        )}

        {/* Main Content — hanya tampil jika ada data */}
        {!isLoading && !fetchError && activeSensor && (
          <>
            {/* Sector Selector Dropdown */}
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-1.5 flex items-center relative focus-within:border-[#1257bb] transition-colors">
              <MapPin className="w-4 h-4 text-[#1257bb] absolute left-3" />
              <select
                value={selectedSensorIndex}
                onChange={(e) => setSelectedSensorIndex(Number(e.target.value))}
                className="w-full pl-8 pr-8 py-2 text-sm font-medium text-[#102e91] bg-transparent outline-none appearance-none cursor-pointer"
              >
                {sensors.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    {s.location_name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <ChevronDown className="w-4 h-4 text-[#64748b]" />
              </div>
            </div>

            {/* Status Banner */}
            {telemetry ? (
              <div
                className={`p-4 rounded-sm border ${
                  isDanger
                    ? "bg-[#fee2e2] border-[#dc2626] text-[#991b1b]"
                    : isWarning
                      ? "bg-[#f0c059] border-[#d97706] text-[#102e91]"
                      : "bg-[#b5e6c5] border-[#059669] text-[#065f46]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-mono font-bold tracking-wide text-xs">
                    STATUS: {telemetry.status}
                  </span>
                </div>
                <p className="font-semibold text-sm leading-snug">
                  {telemetry.action_directive}
                </p>
                <div className="mt-2 text-[11px] font-mono opacity-80">
                  Terakhir diperbarui:{" "}
                  {new Date(telemetry.recorded_at).toLocaleTimeString("id-ID")}{" "}
                  WIB
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-sm border bg-[#f1f5f9] border-[#cbd5e1] text-[#64748b] text-sm text-center">
                Belum ada data telemetri untuk sensor ini.
              </div>
            )}

            {/* Telemetry Cards */}
            {telemetry && (
              <div className="grid grid-cols-1 gap-3">
                {/* pH Card */}
                <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-2">
                    <span className="flex items-center gap-1.5 font-semibold text-[#102e91]">
                      <Activity className="w-4 h-4 text-[#1257bb]" />
                      KEASAMAN AIR (pH)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-sm font-bold text-[11px] ${
                        telemetry.ph_level < 6.5
                          ? "bg-[#f0c059] text-[#102e91]"
                          : "bg-[#b5e6c5] text-[#065f46]"
                      }`}
                    >
                      {telemetry.ph_level < 6.5
                        ? "Terlalu Asam (Waspada)"
                        : "Normal"}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold tracking-tight text-[#102e91]">
                      {telemetry.ph_level.toFixed(1)}
                    </span>
                    <span className="text-xs font-mono text-[#4d93b1]">pH</span>
                  </div>

                  <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#dc2626] w-1/4 h-full"
                      title="Bahaya Asam (< 5.5)"
                    ></div>
                    <div
                      className="bg-[#f0c059] w-1/6 h-full"
                      title="Waspada (5.5 - 6.5)"
                    ></div>
                    <div
                      className="bg-[#b5e6c5] w-2/4 h-full"
                      title="Rentang Aman (6.5 - 8.5)"
                    ></div>
                    <div
                      className="bg-[#4d93b1] w-1/12 h-full"
                      title="Basa (> 8.5)"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#64748b] mt-1">
                    <span>Batas Benur Aman: 6.5 - 8.5 pH</span>
                    <span className="text-[#dc2626] font-semibold">
                      Toleransi Kritis &lt; 5.5
                    </span>
                  </div>
                </div>

                {/* Water Level / ROB Card */}
                <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4">
                  <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-2">
                    <span className="flex items-center gap-1.5 font-semibold text-[#102e91]">
                      <Waves className="w-4 h-4 text-[#1784e1]" />
                      PASANG AIR LAUT (ROB)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-sm font-bold text-[11px] border ${
                        telemetry.water_level_cm >= 150
                          ? "bg-[#fee2e2] text-[#dc2626] border-[#dc2626]"
                          : telemetry.water_level_cm >= 120
                            ? "bg-[#f0c059] text-[#102e91] border-[#d97706]"
                            : "bg-[#f1f5f9] text-[#102e91] border-[#cbd5e1]"
                      }`}
                    >
                      {telemetry.water_level_cm >= 150
                        ? "Bahaya ROB"
                        : telemetry.water_level_cm >= 120
                          ? "Waspada Pasang"
                          : "Normal"}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold tracking-tight text-[#102e91]">
                      {telemetry.water_level_cm}
                    </span>
                    <span className="text-xs font-mono text-[#4d93b1]">cm</span>
                  </div>

                  <p className="text-xs text-[#475569]">
                    Batas Ketinggian Tanggul:{" "}
                    <strong className="text-[#102e91]">160 cm</strong>
                  </p>
                </div>

                {/* Salinity Card */}
                <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4">
                  <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-2">
                    <span className="flex items-center gap-1.5 font-semibold text-[#102e91]">
                      <Droplets className="w-4 h-4 text-[#54b7b0]" />
                      SALINITAS AIR
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-sm font-bold text-[11px] ${
                        telemetry.salinity_ppt >= 18 &&
                        telemetry.salinity_ppt <= 25
                          ? "bg-[#b5e6c5] text-[#065f46]"
                          : "bg-[#fee2e2] text-[#dc2626]"
                      }`}
                    >
                      {telemetry.salinity_ppt >= 18 &&
                      telemetry.salinity_ppt <= 25
                        ? "Normal"
                        : "Anomali"}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-[#102e91]">
                      {telemetry.salinity_ppt}
                    </span>
                    <span className="text-xs font-mono text-[#4d93b1]">
                      ppt
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-1 font-mono">
                    Rentang optimal tambak: 18 - 25 ppt
                  </p>
                </div>
              </div>
            )}

            {/* Proactive Push EWS */}
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1257bb]" />
                <h2 className="text-xs font-mono font-bold text-[#102e91]">
                  PERINGATAN PROAKTIF (EWS DARURAT)
                </h2>
              </div>
              <p className="text-xs text-[#475569]">
                Dapatkan peringatan otomatis di ponsel saat pH turun atau air
                ROB naik tanpa perlu membuka web terus-menerus.
              </p>

              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-sm bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-xs font-medium text-[#102e91]">
                    WhatsApp Alert Siaga Tambak
                  </span>
                  <input
                    type="checkbox"
                    checked={waAlertEnabled}
                    onChange={(e) => setWaAlertEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#1257bb]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-sm bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-xs font-medium text-[#102e91]">
                    Web Push Notification Browser
                  </span>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#1257bb]"
                  />
                </label>
              </div>
            </div>
          </>
        )}
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
            className="flex items-center justify-center gap-2 h-12 bg-[#ffffff] border border-[#1257bb] text-[#1257bb] rounded-sm font-bold text-sm hover:bg-[#f8fafc] transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Lacak Tiket</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
