import Link from "next/link";
import { Palette } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fff7d6] p-6 text-[#222]">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-10">
        <header className="w-full pt-10">
          <h1 className="text-center text-6xl font-black text-[#e83e7b]">Bé Học Vui</h1>
        </header>

        <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/to-mau"
            aria-label="TÔ MÀU"
            className="flex aspect-square flex-col items-center justify-center gap-5 rounded-3xl border-4 border-white bg-[#fff5f8] p-6 text-[#e83e7b] shadow-sm transition-transform active:scale-95"
          >
            <span className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#ffe1ec]">
              <Palette aria-hidden="true" size={58} strokeWidth={3} />
            </span>
            <span className="text-3xl font-black">TÔ MÀU</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
