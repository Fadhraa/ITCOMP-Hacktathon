---
name: AquaGuard Maritime Design System
colors:
  surface: '#ffffff'
  surface-dim: '#f1f5f9'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8fafc'
  surface-container: '#f1f5f9'
  surface-container-high: '#e2e8f0'
  surface-container-highest: '#cbd5e1'
  background: '#f8fafc'
  on-background: '#102e91'
  on-surface: '#0f172a'
  on-surface-variant: '#475569'
  outline: '#e2e8f0'
  outline-variant: '#cbd5e1'
  primary: '#1257bb'
  on-primary: '#ffffff'
  primary-container: '#102e91'
  on-primary-container: '#ffffff'
  secondary: '#1784e1'
  on-secondary: '#ffffff'
  secondary-container: '#1230b3'
  on-secondary-container: '#ffffff'
  tertiary: '#54b7b0'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d93b1'
  on-tertiary-container: '#ffffff'
  safe: '#b5e6c5'
  on-safe: '#065f46'
  warning: '#f0c059'
  on-warning: '#78350f'
  warning-container: '#f1d8b1'
  on-warning-container: '#78350f'
  error: '#dc2626'
  on-error: '#ffffff'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Public Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  telemetry-metric:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  full: 9999px
spacing:
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter: 1rem
  margin: 1rem
---

# AquaGuard Maritime Design System

## 1. Filosofi & Panduan Estetika

Design system ini dirancang khusus untuk platform **Smart Coastal Monitoring & Illegal Dumping Response (AquaGuard)**, yang melayani dua spektrum pengguna:
1. **Petambak Pesisir**: Memerlukan antarmuka *mobile-first* yang sangat kontras, cepat dipindai, dan terbaca jelas di bawah terik matahari pesisir (*high-lux outdoor direct sunlight*).
2. **Petugas Dinas Lingkungan Hidup (DLH)**: Memerlukan antarmuka desktop *GIS-centric* yang bersih, terstruktur, dengan kepadatan informasi optimal untuk pengambilan keputusan cepat dan penindakan hukum.

### Prinsip Utama Desain:
* **Keterbacaan Kontras Solid**: Tidak ada elemen buram, transparan berlebihan, atau bayangan lembut (*no fuzzy shadows*). Semua batas modul menggunakan garis tegas 1px (*hairline structural border*).
* **Tanpa Gradient**: Dilarang keras menggunakan *gradient colors*. Seluruh warna latar belakang, tombol, dan kartu wajib menggunakan warna solid datar (*flat solid colors*).
* **Tanpa Emoji**: Dilarang keras menggunakan karakter emoji pada teks antarmuka, status, atau notifikasi. Gunakan ikon garis geometri SVG (*monoline SVG*) dengan ketebalan 1.5px - 2px atau tag tipografi monospace.
* **Modern Minimalis**: Mengutamakan *whitespace* (*breathing room*), tata letak bersih, serta pemisahan informasi yang tegas tanpa ornamen dekoratif yang tidak fungsional.

---

## 2. Palet Warna Resmi

| Peran Warna | Hex Code | Penggunaan Fungsional |
| :--- | :--- | :--- |
| **Primary Blue** | `#1257bb` | Tombol aksi utama, tab aktif, ikon interaktif utama, link primer. |
| **Deep Navy** | `#102e91` | Judul layar, teks heading hierarki teratas, latar header taktis, angka metrik utama. |
| **Electric Blue** | `#1784e1` | Garis grafik tren parameter air, indikator fokus, highlight interaksi sekunder. |
| **Deep Ocean** | `#1230b3` | Tombol sekunder berbobot tinggi, status aktif sub-modul. |
| **Slate Cyan** | `#4d93b1` | Label satuan metrik (cm, pH, ppt), deskripsi pembantu, garis batas aktif sekunder. |
| **Teal Accent** | `#54b7b0` | Indikator sirkulasi air, status sensor sekunder, aksen peta zona pesisir. |
| **Safe Mint** | `#b5e6c5` | Latar badge status aman (*Normal*), dipadukan dengan teks hijau tua kontras (`#065f46`). |
| **Warning Amber** | `#f0c059` | Latar banner peringatan waspada (*Warning*), dipadukan dengan teks navy gelap (`#102e91` / `#78350f`). |
| **Soft Sand** | `#f1d8b1` | Latar kartu informasi pendukung, badge peringatan tingkat rendah. |
| **Hazard Red** | `#dc2626` | Status bahaya kritis (*Critical Danger* / *Emergency Breach*), pintu air wajib tutup. |
| **Canvas Background** | `#f8fafc` | Latar belakang kanvas luar (mengurangi silau layar outdoor). |
| **Card Surface** | `#ffffff` | Permukaan kartu modul dan dialog. |
| **Border Stroke** | `#e2e8f0` | Garis batas struktural kartu (solid 1px). Garis pembatas sekunder menggunakan `#cbd5e1`. |

---

## 3. Tipografi

Sistem tipografi menggunakan kombinasi terpadu untuk fungsi yang spesifik:
1. **Space Grotesk**: Digunakan untuk *Headlines* dan nilai angka telemetri utama (*Telemetry Metrics*). Karakter geometrisnya tajam dan mudah dibaca sekilas.
2. **Public Sans**: Digunakan untuk *Body Text*, label formulir, dan instruksi mitigasi. Memberikan kejelasan teks tinggi di perangkat mobile.
3. **JetBrains Mono**: Digunakan untuk label status, ID tiket laporan (`#TK-2026-081`), kode sensor (`NODE-A04`), koordinat GPS, dan timestamp telemetri.

### Standar Penggunaan Nilai Telemetri:
* Tampilkan angka utama dengan `telemetry-metric` (Space Grotesk Bold 40px) berwarna `#102e91`.
* Pasangkan satuan ukur (contoh: `pH`, `cm`, `ppt`) di samping atau di bawah angka menggunakan `label-sm` (JetBrains Mono Semibold 11px) berwarna `#4d93b1`.

---

## 4. Sistem Elevasi & Garis Batas (Elevation & Depth)

* **Shadowless Rule**: Tidak menggunakan drop-shadow standar. Pada pencahayaan terik matahari luar ruangan, bayangan lembut akan tampak kotor dan menurunkan kontras teks.
* **1px Planar Containment**: Seluruh kartu data, modul peta, dan pop-up mengandalkan garis tepi solid `1px solid #e2e8f0`.
* **State Hover & Focus**: Perubahan status interaktif ditandai dengan transisi warna garis batas (`1.5px solid #1257bb`), bukan melalui efek melayang (*elevation lift*).

---

## 5. Komponen Standar

### A. Tombol (Buttons)
* **Primary Button**: Background solid `#1257bb`, teks `#ffffff`, sudut `rounded-sm` (4px), tinggi minimal `48px` untuk kemudahan sentuh di perangkat mobile lapangan. Font: Space Grotesk Bold 15px.
* **Secondary Button**: Background solid `#ffffff`, border `1.5px solid #1257bb`, teks `#1257bb`, tinggi `48px`.
* **Hazard Action Button**: Background solid `#dc2626`, teks `#ffffff`, tinggi `48px`.

### B. Kartu Telemetri Sensor (Telemetry Cards)
* Background `#ffffff`, border `1px solid #e2e8f0`, padding `16px`.
* Bagian atas: Label nama sensor dalam `JetBrains Mono` huruf kapital bersama ikon SVG status monoline.
* Bagian tengah: Nilai metrik besar yang menonjol (`telemetry-metric`).
* Bagian bawah: Baris batas toleransi dan status pill padat warna (*Safe* `#b5e6c5` atau *Warning* `#f0c059`).

### C. Banner Peringatan Tindakan (Emergency Action Banner)
* Background padat solid `#f0c059` dengan teks warna `#102e91`.
* Memuat dua komponen wajib:
  1. Status Bahaya dalam huruf kapital tebal (contoh: `STATUS: WASPADA`).
  2. Rekomendasi mitigasi fisik instan (contoh: `Tindakan: Segera tutup pintu air tambak primer`).

### D. Formulir & Input (Form Fields)
* Background `#ffffff`, border `1.5px solid #cbd5e1`, tinggi `48px`, sudut `4px`.
* Status aktif/fokus: border `2px solid #1257bb`.
* Label selalu tampak di atas input (*persistent label*), tidak menggunakan *floating label* agar konteks tidak hilang bagi pengguna awam.

### E. Badge Status (Status Pills)
* Menggunakan huruf kapital monospace (`JetBrains Mono`, 11px, bold).
* **Safe**: Background `#b5e6c5`, teks `#065f46`.
* **Warning**: Background `#f0c059`, teks `#78350f`.
* **Critical**: Background `#fee2e2`, teks `#991b1b`, border `1px solid #dc2626`.
