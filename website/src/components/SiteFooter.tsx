import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-brand/10 bg-black/80 backdrop-blur-3xl pb-24 md:pb-0 geometric-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4">
          <BrandLogo size={120} />
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">© {year} JSK Motors Group</span>
            <p className="mt-1 text-[10px] uppercase font-bold tracking-widest text-zinc-500">Premium Restoration · Industrial Painting · Luxury Detailing</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 sm:flex sm:items-center sm:gap-8">
          <div className="flex flex-col gap-3">
             <Link href="/services" className="text-xs font-black uppercase tracking-tighter text-zinc-400 hover:text-brand transition-colors">Services</Link>
             <Link href="/dealers" className="text-xs font-black uppercase tracking-tighter text-zinc-400 hover:text-brand transition-colors">Dealers</Link>
          </div>
          <div className="flex flex-col gap-3">
             <Link href="/contact" className="text-xs font-black uppercase tracking-tighter text-zinc-400 hover:text-brand transition-colors">Contact</Link>
          </div>
          <div className="flex flex-col gap-3 pt-4 sm:pt-0">
             <Link href="/admin/cars" className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand hover:bg-brand/10 transition-colors">
                Staff Terminal
             </Link>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/5 py-8 text-center">
         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Crafted for Excellence · JSK Signature</p>
      </div>
    </footer>
  );
}

