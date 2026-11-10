import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BANDAR_LAMPUNG_DISTRICTS } from '../../data/mockData';
import { validateEvidenceFile, isCoordinateWithinBandarLampung } from '../../utils/security';
import { 
  CheckCircle2, MapPin, Camera, AlertCircle, Shield, UploadCloud, 
  Search, ArrowRight, Check, Sparkles, PhoneCall, HelpCircle, FileCheck, X
} from 'lucide-react';

export const CitizenReportForm: React.FC = () => {
  const { addNewReport, openTrackingModal, setActivePage, preselectedCategory, showToast } = useApp();

  // Form State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [category, setCategory] = useState<string>(preselectedCategory || 'cat-jalan');
  const [title, setTitle] = useState<string>('Lubang Aspal Sedalam 15cm di dekat Bundaran Hajimena');
  const [description, setDescription] = useState<string>(
    'Kondisi aspal jalan amblas cukup lebar dan berlubang sekitar 15 cm. Saat hujan tergenang air dan tidak terlihat sehingga banyak pengendara motor terperosok. Mohon perbaikan secepatnya.'
  );
  const [district, setDistrict] = useState<string>('Rajabasa');
  const [referencePoint, setReferencePoint] = useState<string>('Sekitar 50 meter sebelum gapura selamat datang, seberang deretan ruko');
  const [coords, setCoords] = useState<{ lat: number; lng: number; address: string }>({
    lat: -5.3824,
    lng: 105.2578,
    address: 'Jl. ZA. Pagar Alam - Rajabasa, Kota Bandar Lampung (Akurasi ±4 meter)'
  });
  const [isGpsLocked, setIsGpsLocked] = useState<boolean>(true);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; preview: string }>>([
    {
      name: 'pothole_rajabasa_01.jpg',
      size: '1.8 MB',
      preview: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
    }
  ]);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (preselectedCategory) {
      setCategory(preselectedCategory);
    }
  }, [preselectedCategory]);

  const categories = [
    { id: 'cat-jalan', name: 'Jalan Rusak', opd: 'Dinas Bina Marga & Bina Konstruksi (BMBK)' },
    { id: 'cat-sampah', name: 'Sampah Menumpuk', opd: 'Dinas Lingkungan Hidup (DLH)' },
    { id: 'cat-pju', name: 'Lampu PJU Mati', opd: 'Dinas Perhubungan (Dishub)' },
    { id: 'cat-drainase', name: 'Drainase Tersumbat', opd: 'Dinas SDA & Pemukiman' },
    { id: 'cat-taman', name: 'Fasilitas Umum', opd: 'Dinas Perkim' },
    { id: 'cat-trantibum', name: 'Lain-lain / Aspirasi', opd: 'Satpol PP / Terkait' },
  ];

  const handleUseMyGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          
          // Validasi batas wilayah teritorial (SEC-VULN-05)
          const inBdl = isCoordinateWithinBandarLampung(lat, lng);
          if (!inBdl) {
            showToast('Peringatan: Posisi GPS terdeteksi di luar batas yurisdiksi Kota Bandar Lampung.', 'warning');
          }

          setCoords({
            lat,
            lng,
            address: `Jl. ZA. Pagar Alam - Kec. ${district}, Kota Bandar Lampung (GPS Terkunci ±${Math.round(pos.coords.accuracy || 3)}m)`
          });
          setIsGpsLocked(true);
          showToast('Koordinat GPS berhasil dikunci secara akurat.', 'success');
        },
        () => {
          setCoords({
            lat: -5.3824,
            lng: 105.2578,
            address: `Jl. ZA. Pagar Alam - Kec. ${district}, Kota Bandar Lampung (Terdeteksi GPS ±3 meter)`
          });
          setIsGpsLocked(true);
          showToast('Menggunakan titik koordinat GPS standar Bandar Lampung.', 'info');
        }
      );
    } else {
      setCoords({
        lat: -5.3824,
        lng: 105.2578,
        address: `Jl. ZA. Pagar Alam - Kec. ${district}, Kota Bandar Lampung (Terdeteksi GPS ±3 meter)`
      });
      setIsGpsLocked(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length >= 3) {
      showToast('Maksimal lampiran adalah 3 foto.', 'warning');
      return;
    }

    const file = files[0];

    // Validasi Keamanan Berkas (MIME-type, ukuran max 5MB, ekstensi) (SEC-VULN-05 & SEC-VULN-09)
    const validation = validateEvidenceFile(file);
    if (!validation.isValid) {
      showToast(validation.error || 'Format berkas tidak valid atau membahayakan.', 'error');
      e.target.value = '';
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const reader = new FileReader();

    reader.onload = () => {
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: `${sizeMb} MB`,
          preview: reader.result as string
        }
      ].slice(0, 3));
      showToast(`Foto ${file.name} tervalidasi aman dan memenuhi syarat verifikasi.`, 'success');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Judul dan deskripsi aduan wajib diisi!', 'warning');
      return;
    }

    const selectedCat = categories.find((c) => c.id === category);

    const newTicket = addNewReport({
      title: title.trim(),
      description: description.trim(),
      categoryId: category,
      categoryName: selectedCat?.name || 'Jalan Rusak',
      opd: selectedCat?.opd || 'Dinas Bina Marga & Bina Konstruksi (BMBK)',
      district,
      referencePoint: referencePoint.trim(),
      coordinates: coords,
      isAnonymous,
      reporterName: isAnonymous ? 'Warga Anonim' : 'Rayhan Pratama',
      reporterPhone: isAnonymous ? '0812-****-9901' : '0812-7890-4491',
      evidencePhotoUrl: uploadedFiles[0]?.preview || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    });

    setCreatedTicketId(newTicket);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner Metric */}
      <div className="bg-primary text-white rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-md border border-primary-container">
        <div>
          <span className="text-xs font-mono font-bold text-secondary-light uppercase tracking-wider block">
            Formulir Aspirasi & Pengaduan Fasilitas Publik
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Buat Laporan Pengaduan Warga
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Sampaikan permasalahan infrastruktur lingkungan Anda dengan data lokasi akurat dan foto bukti untuk penanganan sigap oleh OPD Pemkot Bandar Lampung.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-slate-400 block">Rerata Respon OPD:</span>
            <span className="text-xl font-bold font-mono text-emerald-400">1x24 Jam</span>
          </div>
          <div>
            <span className="text-slate-400 block">Tingkat Penanganan:</span>
            <span className="text-xl font-bold font-mono text-secondary-light">94.8%</span>
            <span className="text-[10px] text-slate-400 block">(1.482 Tuntas)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                currentStep >= 1 ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                currentStep >= 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                1
              </span>
              <span>1. Informasi Pelaporan</span>
            </button>

            <span className="w-8 h-0.5 bg-slate-200"></span>

            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                currentStep >= 2 ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                currentStep >= 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                2
              </span>
              <span>2. Lokasi & Acuan</span>
            </button>

            <span className="w-8 h-0.5 bg-slate-200"></span>

            <button
              onClick={() => setCurrentStep(3)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                currentStep >= 3 ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                currentStep >= 3 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                3
              </span>
              <span>3. Bukti Lampiran</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Informasi Pelaporan */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* Category Pills */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Kategori Laporan <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {categories.map((cat) => {
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-50 border-secondary ring-2 ring-secondary/20 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isSelected ? 'text-secondary' : 'text-slate-800'}`}>
                              {cat.name}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-secondary" />}
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cat.opd}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Judul Singkat */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Judul Singkat Laporan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lubang Aspal Sedalam 15cm di dekat Bundaran Hajimena"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm font-medium"
                  />
                  <p className="text-[11px] text-slate-400">Gunakan judul padat 5 - 10 kata yang langsung menjelaskan keluhan.</p>
                </div>

                {/* Deskripsi Lengkap */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Deskripsi Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        description.length > 500 ? 'text-rose-600' : 'text-slate-400'
                      }`}
                    >
                      {description.length}/500 karakter
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    maxLength={500}
                    placeholder="Jelaskan detail kondisi kerusakan, waktu kejadian, dampak lalu lintas, dsb."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm leading-relaxed focus:outline-none focus:ring-2 transition-colors ${
                      description.length > 500
                        ? 'border-rose-400 focus:ring-rose-500/50 bg-rose-50/30'
                        : 'border-slate-300 focus:ring-secondary/50'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400">
                    Tidak boleh memuat kata kasar, SARA, atau data pribadi pihak lain tanpa izin.
                  </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-secondary hover:bg-secondary-dark text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all"
                  >
                    Lanjut ke Lokasi & Acuan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Lokasi & Titik Acuan */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Kecamatan Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Kecamatan (Kota Bandar Lampung) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm font-medium bg-white"
                    >
                      {BANDAR_LAMPUNG_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          Kec. {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Patokan Acuan */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Titik Acuan / Patokan Khusus <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Sekitar 50 meter sebelum gapura selamat datang..."
                      value={referencePoint}
                      onChange={(e) => setReferencePoint(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm"
                    />
                  </div>
                </div>

                {/* Geotagging Map Simulation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      Pin Titik Koordinat GPS
                    </label>
                    <button
                      type="button"
                      onClick={handleUseMyGps}
                      className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Gunakan Titik Lokasi Saya
                    </button>
                  </div>

                  <div className="h-60 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-900 shadow-inner flex items-center justify-center">
                    {/* Simulated Map View */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-70"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')`
                      }}
                    />
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px]"></div>

                    {/* Pin Center */}
                    <div className="relative z-10 flex flex-col items-center animate-bounce">
                      <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="w-3 h-1 bg-black/60 rounded-full blur-[2px] mt-1"></div>
                    </div>

                    {/* Coordinates Overlay Bar */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-white/50 text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="font-mono font-bold text-slate-800">
                          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </span>
                        <span className="text-slate-500 text-[11px] hidden sm:inline">• {coords.address}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        Akurasi ±4m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-800 px-4 py-2"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bg-secondary hover:bg-secondary-dark text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all"
                  >
                    Lanjut ke Bukti Foto
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Bukti Lampiran & Opsi Rahasia */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                {/* File Upload Dropzone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Unggah Bukti Foto Kondisi Fisik <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-secondary rounded-2xl p-6 text-center bg-surface-soft hover:bg-blue-50/30 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-secondary flex items-center justify-center mx-auto mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Klik untuk memilih berkas foto dari galeri/kamera atau seret foto ke sini
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Format JPG, JPEG, PNG (Maks. 3 foto, metadata EXIF otomatis tervalidasi)
                    </p>
                  </div>

                  {/* Uploaded Files Previews */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Berkas Terlampir ({uploadedFiles.length}/3):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-sm relative group"
                        >
                          <img
                            src={file.preview}
                            alt="Preview"
                            className="w-14 h-14 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-bold text-slate-800 truncate">{file.name}</p>
                            <p className="text-slate-400 text-[11px]">{file.size}</p>
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded mt-1">
                              <CheckCircle2 className="w-3 h-3" /> EXIF Valid
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(idx);
                            }}
                            className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus foto"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Anonymous Switch Toggle */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Lapor Secara Anonim / Rahasia</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Nama dan nomor telepon Anda disembunyikan dari publik dan hanya dapat dilihat oleh verifikator Diskominfo.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-[11px] text-slate-600 leading-relaxed">
                  Data laporan Anda dilindungi oleh standar keamanan arsitektur SPBE Pemkot Bandar Lampung serta ketentuan Undang-Undang Perlindungan Data Pribadi (UU PDP).
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-800 px-4 py-2"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-light text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Kirim Laporan Pengaduan
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Sidebar Info & History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Instant Ticket Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-3">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2">
              <Search className="w-4 h-4 text-secondary" />
              Lacak Tiket Instan
            </h4>
            <p className="text-xs text-slate-500">
              Punya tiket pengaduan terdahulu? Periksa statusnya di sini:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="BDL-2026-089"
                id="sidebarTicketInput"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono uppercase"
              />
              <button
                type="button"
                onClick={() => {
                  const input = (document.getElementById('sidebarTicketInput') as HTMLInputElement)?.value;
                  openTrackingModal(input || '0892');
                }}
                className="bg-secondary text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-secondary-dark"
              >
                Cek
              </button>
            </div>
          </div>

          {/* Previous Reports History Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-primary flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Aduan Anda Sebelumnya
              </h4>
              <span className="text-[11px] font-mono text-slate-400">4 total</span>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => openTrackingModal('0890')}
                className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-primary">#TKT-BDL-2026-089</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.2 rounded font-bold">Diproses</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                  Lampu PJU Padam di Jl. Teuku Umar
                </p>
                <span className="text-[10px] text-slate-400 block">Dinas Perhubungan (Dishub)</span>
              </div>

              <div 
                onClick={() => openTrackingModal('102')}
                className="p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-primary">#TKT-BDL-2026-042</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-bold">Selesai</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                  Tumpukan Sampah Liar Pasar Bawah
                </p>
                <span className="text-[10px] text-slate-400 block">Dinas Lingkungan Hidup (DLH)</span>
              </div>
            </div>
          </div>

          {/* Quick SLA Tips */}
          <div className="bg-gradient-to-br from-slate-900 to-primary text-white rounded-2xl p-6 shadow-card space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-secondary-light flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Tips Cepat Ditindaklanjuti
            </h4>
            <ol className="space-y-2 text-xs text-slate-200 list-decimal list-inside leading-relaxed">
              <li>Ambil foto jelas pada siang hari dengan sudut pandang yang memperlihatkan skala kerusakan.</li>
              <li>Pastikan GPS ponsel aktif agar titik koordinat tervalidasi otomatis anti-hoaks.</li>
              <li>Hindari laporan ganda; periksa peta sebaran aduan terlebih dahulu.</li>
            </ol>
          </div>

          {/* Emergency 112 Sidebar Callout */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              Kejadian Darurat Kota?
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Hubungi <strong>Call Center 112</strong> bebas pulsa atau WhatsApp Siaga 24 Jam <strong>+62 811-7200-112</strong> untuk evakuasi darurat.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Success Modal */}
      {createdTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-primary">Laporan Resmi Diterbitkan!</h3>
              <p className="text-xs text-slate-500">
                Aduan Anda telah berhasil didaftarkan ke sistem SIAP LAPOR Kota Bandar Lampung.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-soft border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Nomor Tiket Anda:</span>
              <div className="text-xl font-black font-mono text-secondary tracking-wider">
                {createdTicketId}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                Tercatat pada Server SPBE Pemkot BDL
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Simpan nomor tiket di atas untuk memeriksa riwayat tindak lanjut fisik oleh petugas lapangan.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  const id = createdTicketId;
                  setCreatedTicketId(null);
                  setTitle('');
                  setDescription('');
                  setCurrentStep(1);
                  openTrackingModal(id);
                }}
                className="flex-1 bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                Lacak Tiket Sekarang
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedTicketId(null);
                  setTitle('');
                  setDescription('');
                  setCurrentStep(1);
                  setActivePage('landing');
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

