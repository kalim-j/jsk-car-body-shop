import Link from "next/link";
import { business } from "../../config/business";
import { Phone, Mail, MapPin, Send, MessageSquare, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="mb-20 text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand uppercase">
            <MessageSquare size={14} />
            Get in Touch
          </div>
          <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-7xl">Contact us</h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-500 lg:mx-0 mx-auto">
            Ready to give your vehicle the showroom treatment? Contact JSK Body Shop for expert repairs and detailing.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Contact Info Card */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-zinc-900/40 p-10 transition-all hover:border-brand/40 hover:bg-zinc-900/60 showroom-glow">
            <h3 className="text-3xl font-black text-white mb-10">Connect With Us</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-1">Phone</p>
                  <p className="text-xl font-bold text-white">{business.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <Mail size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-1">Email</p>
                  <p className="text-xl font-bold text-white">{business.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-1">Showroom Location</p>
                  <p className="text-xl font-bold text-white">Visit our facility for a personal consultation.</p>
                  <a 
                    href={business.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                  >
                    Open in Google Maps
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/5">
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                View Our Work
              </Link>
            </div>
          </div>

          {/* Form Card */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-zinc-900/40 p-10 transition-all hover:border-brand/40 hover:bg-zinc-900/60 showroom-glow">
            <h3 className="text-3xl font-black text-white mb-10">Request a Quote</h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold tracking-widest text-zinc-500 uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder-zinc-600 outline-none transition-all focus:border-brand focus:bg-white/10"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold tracking-widest text-zinc-500 uppercase mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder-zinc-600 outline-none transition-all focus:border-brand focus:bg-white/10"
                  placeholder="+00 000 000 0000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold tracking-widest text-zinc-500 uppercase mb-2">Message</label>
                <textarea
                  className="w-full min-h-[160px] rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder-zinc-600 outline-none transition-all focus:border-brand focus:bg-white/10 resize-none"
                  placeholder="Tell us about the services you need (repair, painting, detailing...)"
                />
              </div>

              <button
                type="button"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-brand py-5 text-sm font-black text-white transition-all hover:bg-brand-light hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]"
              >
                Submit Request
                <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

