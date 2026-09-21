import Link from 'next/link';
import { ArrowLeft, Wrench } from 'lucide-react';

export default function PlaceholderPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 text-center animate-fade-in">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Wrench className="w-8 h-8 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Segera Hadir</h1>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Halaman pengaturan ini sedang dalam tahap pengembangan dan akan tersedia pada pembaruan berikutnya.
      </p>
      <Link href="/pengaturan" className="btn btn-outline inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Pengaturan
      </Link>
    </div>
  );
}
