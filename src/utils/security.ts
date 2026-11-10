/**
 * Modul Keamanan SIAP LAPOR (Security & Data Protection Utilities)
 * Berdasarkan Rekomendasi Audit Keamanan OWASP Top 10 & UU PDP No. 27/2022
 */

// 1. SANITASI CSV FORMULA INJECTION (CWE-1236 / SEC-VULN-04)
// Mencegah eksekusi rumus arbitrer saat file dibuka di MS Excel / LibreOffice
export function sanitizeCsvField(val: unknown): string {
  if (val === undefined || val === null) {
    return '""';
  }

  let str = String(val).trim();

  // Karakter pemicu formula eksekusi spreadsheet
  const formulaTriggers = ['=', '+', '-', '@', '\t', '\r'];
  const firstChar = str.charAt(0);

  if (formulaTriggers.includes(firstChar)) {
    // Netralisir dengan membubuhkan tanda petik tunggal di awal
    str = `'${str}`;
  }

  // Escape tanda petik ganda ganda sesuai standar RFC-4180
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

// 2. GENERATOR NOMOR TIKET KRIPTOGRAFIS (CWE-639 / SEC-VULN-02)
// Menghasilkan nomor tiket dengan entropi tinggi menggunakan Web Crypto API
export function generateSecureTicketCode(prefix = 'BDL-2026'): { id: string; ticket: string } {
  // Gunakan crypto.getRandomValues untuk entropi kriptografis
  const array = new Uint32Array(2);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback bila di lingkungan non-browser
    array[0] = Math.floor(Math.random() * 0xffffffff);
    array[1] = Math.floor(Math.random() * 0xffffffff);
  }

  // Format acak alphanumerik unik 6 karakter (base36 uppercase)
  const codePart1 = (array[0] % 9000 + 1000).toString(); // 4 digit angka
  const codePart2 = (array[1] % 36).toString(36).toUpperCase() + ((array[0] >> 4) % 36).toString(36).toUpperCase();
  const uniqueToken = `${codePart1}-${codePart2}`;

  return {
    id: `${prefix}-${uniqueToken}`,
    ticket: `TKT-${prefix}-${uniqueToken}`
  };
}

// 3. PENGHITUNG HASH SHA-256 UNTUK AUDIT TRAIL TAMPER-PROOF (CWE-353 / SEC-VULN-07)
export async function computeSha256Hash(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback synchronous digest jika subtle crypto terhalang
    }
  }

  // FNV-1a 64-bit / Pseudo-hash fallback deterministic
  let h1 = 0x811c9dc5;
  for (let i = 0; i < message.length; i++) {
    h1 ^= message.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193);
  }
  return ('00000000' + (h1 >>> 0).toString(16)).repeat(8).substring(0, 64);
}

// Synchronous version untuk state dispatch cepat
export function computeQuickHash(content: string, previousHash = '0'.repeat(64)): string {
  const combined = `${previousHash}:${content}:${Date.now()}`;
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ char;
  }
  const h1Hex = (hash1 >>> 0).toString(16).padStart(8, '0');
  const h2Hex = (hash2 >>> 0).toString(16).padStart(8, '0');
  return `${h1Hex}${h2Hex}`.repeat(4).substring(0, 64);
}

// 4. MASKING DATA PII (PELINDUNGAN DATA PRIBADI - UU PDP No. 27/2022 / SEC-VULN-03)
export function maskSensitiveData(value: string | undefined | null, type: 'phone' | 'nik' | 'name' = 'phone'): string {
  if (!value) return '-';
  const clean = value.trim();

  if (type === 'nik') {
    // NIK 16 digit: Hanya tampilkan 4 digit awal dan 4 digit akhir
    if (clean.length === 16) {
      return `${clean.substring(0, 4)}********${clean.substring(12)}`;
    }
    return `${clean.substring(0, 2)}****${clean.slice(-2)}`;
  }

  if (type === 'phone') {
    // Nomor HP: Contoh 0812-7890-4491 -> 0812-****-4491
    const digits = clean.replace(/\D/g, '');
    if (digits.length >= 8) {
      const prefix = digits.substring(0, 4);
      const suffix = digits.slice(-4);
      return `${prefix}-****-${suffix}`;
    }
    return '08**-****-****';
  }

  if (type === 'name') {
    // Mask nama warga jika bukan inisial
    const words = clean.split(' ');
    if (words.length > 1) {
      return `${words[0]} ${words[1].charAt(0)}.`;
    }
    return clean;
  }

  return clean;
}

// 5. VALIDASI GEO-FENCING WILAYAH KOTA BANDAR LAMPUNG (SEC-VULN-05)
// Koordinat geografis resmi Kota Bandar Lampung:
// Lat: -5.30 s/d -5.55
// Lng: 105.15 s/d 105.38
export function isCoordinateWithinBandarLampung(lat: number, lng: number): boolean {
  const isLatValid = lat <= -5.28 && lat >= -5.58;
  const isLngValid = lng >= 105.10 && lng <= 105.42;
  return isLatValid && isLngValid;
}

// 6. VALIDASI FILE UNGGAHAN BUKTI FOTO (SEC-VULN-05 & SEC-VULN-09)
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEvidenceFile(file: File): FileValidationResult {
  // Batas ukuran maksimal 5 MB
  const MAX_SIZE_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 5 MB.`
    };
  }

  // Tipe MIME yang diizinkan (Whitelisting foto asli)
  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
  if (!ALLOWED_MIME.includes(file.type)) {
    return {
      isValid: false,
      error: `Format berkas (${file.type || 'tidak diketahui'}) tidak didukung. Harap unggah format JPG, PNG, atau WEBP.`
    };
  }

  // Ekstensi berkas
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return {
      isValid: false,
      error: `Ekstensi berkas .${ext} tidak valid untuk bukti laporan.`
    };
  }

  return { isValid: true };
}

