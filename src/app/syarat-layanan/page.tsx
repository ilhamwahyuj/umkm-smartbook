import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-800 py-12 px-6 lg:px-12 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 lg:p-14 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200">
        <Link href="/login" className="inline-flex text-teal-700 font-semibold text-sm hover:text-teal-800 transition-colors items-center gap-2 mb-8 bg-teal-50 px-4 py-2 rounded-xl border border-teal-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali
        </Link>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Syarat & Ketentuan Layanan</h1>
        <div className="space-y-8 text-slate-600 leading-relaxed text-[15px]">
          <p className="text-sm font-medium text-slate-400">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p>
            Selamat datang di <strong>Smartbook POS Cloud</strong>. Dengan mendaftar dan menggunakan layanan atau aplikasi kami, Anda setuju untuk terikat oleh Syarat dan Ketentuan berikut. Harap membacanya dengan saksama.
          </p>
          
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-sm">1</span>
              Ketentuan Penggunaan Umum
            </h2>
            <p>
              Smartbook memberikan lisensi terbatas, non-eksklusif, dan dapat dibatalkan untuk mengakses platform demi kebutuhan pencatatan transaksi dan operasional UMKM Anda. Penggunaan aplikasi untuk aktivitas ilegal yang melanggar hukum di Indonesia adalah dilarang keras.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-sm">2</span>
              Kewajiban Pengguna
            </h2>
            <p className="mb-3">
              Sebagai pengguna, Anda bertanggung jawab untuk:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Menjaga kerahasiaan kata sandi akun Owner dan PIN Kasir.</li>
              <li>Memberikan informasi bisnis yang akurat saat pendaftaran.</li>
              <li>Memastikan setiap transaksi sesuai dengan kondisi asli di lapangan (menghindari manipulasi data).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-sm">3</span>
              Ketersediaan & Dukungan
            </h2>
            <p>
              Kami berkomitmen untuk menjaga ketersediaan layanan hingga 99.9%. Meskipun begitu, kami mungkin melakukan pemeliharaan server berkala yang akan diinfokan terlebih dahulu. Dukungan pelanggan (CS) kami siap membantu kendala teknis Anda melalui portal Bantuan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
