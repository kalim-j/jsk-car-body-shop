"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Plus, Trash2, Camera, Car, Truck, Wrench, Sparkles, Loader2, Save, XCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface RepairJob {
  id: string;
  title: string;
  description: string;
  vehicleType: "Car" | "Tipper" | "Truck";
  beforeImage: string;
  afterImage: string;
}

export default function AdminRepairsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [repairs, setRepairs] = useState<RepairJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vehicleType, setVehicleType] = useState<"Car" | "Tipper" | "Truck">("Car");
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchRepairs = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const res = await fetch(`${backendUrl}/repairs`);
      const data = await res.json();
      setRepairs(data.repairs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleAddRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("jsk_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const res = await fetch(`${backendUrl}/repairs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, vehicleType, beforeImage, afterImage }),
      });

      if (!res.ok) throw new Error("Failed to add repair");
      
      toast.success("Repair entry added to showcase", { icon: "✅" });
      setIsAdding(false);
      setTitle("");
      setDescription("");
      setBeforeImage("");
      setAfterImage("");
      fetchRepairs();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this entry from the showcase?")) return;
    try {
      const token = localStorage.getItem("jsk_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const res = await fetch(`${backendUrl}/repairs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Entry removed");
      fetchRepairs();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (authLoading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand" /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground pb-40">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-1 shadow-lg bg-brand rounded-full" />
            <div>
              <h1 className="text-4xl font-black tracking-tight font-arabic-heading uppercase italic metallic-gold flex items-center gap-3">
                Repair Portfolio Manager
              </h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Admin Terminal // Showcase Hub</p>
            </div>
          </div>

          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="group flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-brand-light transition-all gold-glow"
          >
            {isAdding ? <><XCircle size={18} /> Cancel</> : <><Plus size={18} /> New Showcase Entry</>}
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
               initial={{ opacity: 0, height: 0, marginBottom: 0 }}
               animate={{ opacity: 1, height: "auto", marginBottom: 48 }}
               exit={{ opacity: 0, height: 0, marginBottom: 0 }}
               className="overflow-hidden"
            >
               <div className="bg-zinc-900/60 p-8 rounded-[2rem] border border-brand/20 backdrop-blur-xl gold-glow shadow-2xl relative">
                  <div className="mb-8 flex items-center gap-4 text-brand">
                     <Sparkles size={24} />
                     <h2 className="text-xl font-black uppercase tracking-widest italic">Create Restoration Story</h2>
                  </div>

                  <form onSubmit={handleAddRepair} className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Restoration Title</label>
                        <input 
                          value={title} onChange={e => setTitle(e.target.value)} required
                          placeholder="e.g., Heavy Tipper Restoration"
                          className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm focus:border-brand/40 focus:ring-4 focus:ring-brand/10 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Description / Service Details</label>
                        <textarea 
                          value={description} onChange={e => setDescription(e.target.value)} required
                          placeholder="Describe the repair work performed..."
                          className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm focus:border-brand/40 focus:ring-4 focus:ring-brand/10 outline-none transition-all h-32 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Vehicle Type</label>
                        <div className="flex gap-4">
                          {(["Car", "Truck", "Tipper"] as const).map(type => (
                             <button
                                key={type} type="button" onClick={() => setVehicleType(type)}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${vehicleType === type ? "bg-brand text-black border-brand gold-glow" : "border-white/5 text-zinc-500 hover:text-white"}`}
                             >
                                {type}
                             </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Before Image URL</label>
                        <div className="relative group">
                          <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand transition-colors" size={18} />
                          <input 
                            value={beforeImage} onChange={e => setBeforeImage(e.target.value)} required
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 text-sm focus:border-brand/40 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">After Image URL</label>
                        <div className="relative group">
                          <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand transition-colors" size={18} />
                          <input 
                            value={afterImage} onChange={e => setAfterImage(e.target.value)} required
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 text-sm focus:border-brand/40 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          disabled={submitting}
                          className="w-full bg-brand hover:bg-brand-light text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl gold-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                          {submitting ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Publish to Portfolio</>}
                        </button>
                      </div>
                    </div>
                  </form>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand h-12 w-12" /></div>
        ) : (
          <div className="grid gap-6">
            {repairs.length === 0 && <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10 text-zinc-500 font-bold uppercase tracking-widest">No entries listed in showcase terminal</div>}
            {repairs.map((job) => (
              <div 
                key={job.id} 
                className="group flex flex-col md:flex-row items-center gap-8 bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5 hover:border-brand/20 transition-all"
              >
                <div className="flex items-center gap-2 h-24 w-40 overflow-hidden rounded-2xl border border-white/10">
                   <img src={job.beforeImage} alt="Before" className="h-full w-1/2 object-cover opacity-50" />
                   <img src={job.afterImage} alt="After" className="h-full w-1/2 object-cover" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand/10 text-brand border border-brand/20">{job.vehicleType}</span>
                  </div>
                  <h3 className="text-xl font-bold italic text-white">{job.title}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-1">{job.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="h-12 w-12 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all ring-1 ring-red-500/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
