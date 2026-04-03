import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-black/60 backdrop-blur-xl pb-24 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-sm font-bold text-white">© {year} JSK CAR BODY SHOP</span>
          <p className="mt-1 text-xs text-zinc-600">Body repair · Painting · Detailing</p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/services" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">Services</Link>
          <Link href="/gallery" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">Gallery</Link>
          <Link href="/contact" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">Contact</Link>
          <Link href="/login" className="text-xs font-semibold text-brand hover:text-brand-light transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}

