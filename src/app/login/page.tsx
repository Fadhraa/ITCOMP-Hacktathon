"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      console.log("[AUTH] Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("[AUTH Response]:", { data, error });

      if (error) {
        console.error("[AUTH Error]:", error.message);
        setErrorMsg("Email atau kata sandi salah. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log("[AUTH Success] User logged in:", data.user.id);
        // Berhasil login, arahkan ke dashboard admin
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("[AUTH Exception]:", err);
      setErrorMsg("Terjadi kesalahan pada sistem. Periksa koneksi Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#102e91] rounded-sm flex items-center justify-center text-white mb-3 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-[#102e91] tracking-tight">
            Portal Petugas DLH
          </h1>
          <p className="text-[11px] font-mono text-[#64748b] mt-1 text-center leading-relaxed">
            AQUAGUARD COMMAND CENTER
            <br />
            OTENTIKASI INTERNAL
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-sm p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-[#fee2e2] border border-[#dc2626] rounded-sm text-xs font-medium text-[#991b1b]">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-[#102e91]">
                EMAIL PETUGAS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#64748b]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dlh.kota.go.id"
                  className="w-full h-10 pl-9 pr-3 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm text-sm focus:bg-[#ffffff] focus:border-[#1257bb] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-[#102e91]">
                KATA SANDI
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#64748b]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-3 bg-[#f1f5f9] border border-[#cbd5e1] rounded-sm text-sm focus:bg-[#ffffff] focus:border-[#1257bb] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#1257bb] hover:bg-[#102e91] text-white font-bold text-sm rounded-sm flex items-center justify-center gap-2 mt-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-[10px] font-mono text-[#64748b] leading-relaxed">
          <br />
          Hubungi IT Support jika Anda melupakan kredensial.
        </div>
      </div>
    </div>
  );
}
