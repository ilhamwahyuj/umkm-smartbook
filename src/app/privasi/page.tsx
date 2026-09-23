import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-800 py-12 px-6 lg:px-12 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 lg:p-14 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200">
        <Link href="/login" className="inline-flex text-teal-700 font-semibold text-sm hover:text-teal-800 transition-colors items-center gap-2 mb-8 bg-teal-50 px-4 py-2 rounded-xl border border-teal-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali
        </Link>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Kebijakan Privasi</h1>
        <div className="space-y-8 text-slate-600 leading-relaxed text-[15px]">
          <p className="text-sm font-medium text-slate-400">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p>
            Di <strong>Smartbook</strong>, kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi serta data transaksi bisnis yang Anda bagikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi Anda di platform Smartbook POS Cloud.
          </p>
          
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-sm">1</span>
              Informasi yang Kami Kumpulkan
            </h2>
            <p className="mb-3">Kami mengumpulkan informasi penting untuk menjalankan layanan, di antaranya:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Data Profil (nama, alamat email, nomor telepon).</li>
              <li>Data Bisnis UMKM (nama gerai, alamat cabang, kategori bisnis).</li>
              <li>Data Transaksi & Stok (catatan penjualan harian, inventori gudang).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-sm">2</span>
              Penggunaan Data
            </h2>
            <p className="mb-3">
              Data yang dikumpulkan sepenuhnya digunakan untuk operasional layanan Anda. Kami <strong>tidak</strong> menjual data Anda kepada pihak ketiga. Penggunaan data meliputi:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Penyediaan fitur Dashboard dan Rekapitulasi Laba Rugi.</li>
              <li>Sistem kasir cerdas yang dapat digunakan multi-perangkat.</li>
              <li>Penyempurnaan sistem dan keamanan (Analitik Internal).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-sm">3</span>
              Keamanan Data
            </h2>
            <p>
              Kami menerapkan standar keamanan industri yang ketat, termasuk <strong>enkripsi SSL 256-bit</strong> pada setiap transmisi data, dan otentikasi lapis ganda (2FA) untuk akun Pemilik/Manajer. Data sensitif Anda aman bersama ekosistem komputasi awan yang andal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
