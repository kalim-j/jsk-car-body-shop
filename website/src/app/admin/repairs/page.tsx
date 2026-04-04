"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Trash2, Edit3, Image as ImageIcon, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientCreateRepairForm, ClientUpdateRepairForm } from "./ClientForms";

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingRepair, setEditingRepair] = useState<any | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/repairs`);
      if (res.ok) {
        const data = await res.json();
        setRepairs(data.repairs);
      }
    } catch {
      toast.error("Failed to fetch repairs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRepairs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this repair job?")) return;
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
      const res = await fetch(`${backendUrl}/repairs/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Repair deleted");
        fetchRepairs();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-12">
        <div>
          <div className="flex gap-4 mb-4 text-lg font-bold">
            <Link href="/admin/cars" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 pb-1">Cars</Link>
            <Link href="/admin/dealers" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 pb-1">Dealers</Link>
            <Link href="/admin/repairs" className="text-zinc-900 border-b-2 border-brand pb-1">Repairs</Link>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Moderation · Repair Showcase</h1>
          <p className="mt-2 text-zinc-500 max-w-xl">
            Control the "Before & After" gallery. Highlight your best work for Cars, Tippers, and Trucks.
          </p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-brand text-white px-8 py-3 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-brand-light transition-all shadow-xl shadow-brand/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Repair Work
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-zinc-500 font-bold">Loading repairs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {repairs.map((repair) => (
              <motion.div 
                key={repair.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card/50 border border-border/50 rounded-3xl overflow-hidden glass hover:border-brand/30 transition-colors group relative"
              >
                 <div className="relative h-48 overflow-hidden flex">
                    <div className="flex-1 relative border-r border-background">
                       <img src={repair.beforeImage} className="w-full h-full object-cover grayscale opacity-50 transition-all group-hover:grayscale-0 group-hover:opacity-100" />
                       <span className="absolute bottom-2 left-2 bg-black/60 text-[10px] font-black text-white px-2 py-0.5 rounded uppercase">Before</span>
                    </div>
                    <div className="flex-1 relative">
                       <img src={repair.afterImage} className="w-full h-full object-cover" />
                       <span className="absolute bottom-2 right-2 bg-brand text-[10px] font-black text-white px-2 py-0.5 rounded uppercase">After</span>
                    </div>
                 </div>
                 
                 <div className="p-6">
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="text-xl font-bold line-clamp-1">{repair.title}</h3>
                       <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1 text-brand">{repair.vehicleType}</p>
                     </div>
                   </div>
                   <p className="text-sm text-zinc-400 line-clamp-2 mb-6 h-10">{repair.description}</p>
                   
                   <div className="flex gap-2">
                     <button 
                       onClick={() => setEditingRepair(repair)}
                       className="flex-1 bg-white/5 border border-white/10 text-zinc-300 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                     >
                       <Edit3 size={14} />
                       Edit
                     </button>
                     <button 
                       onClick={() => handleDelete(repair.id)}
                       className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal Overlay */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="relative bg-card border border-border/50 max-w-2xl w-full p-8 rounded-3xl overflow-hidden glass shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <ImageIcon className="text-brand" />
                Post New Repair
              </h2>
              <ClientCreateRepairForm onComplete={() => { setShowCreate(false); fetchRepairs(); }} />
            </motion.div>
          </div>
        )}

        {editingRepair && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingRepair(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="relative bg-card border border-border/50 max-w-2xl w-full p-8 rounded-3xl overflow-hidden glass shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Edit3 className="text-brand" />
                Edit Repair Record
              </h2>
              <ClientUpdateRepairForm repair={editingRepair} onComplete={() => { setEditingRepair(null); fetchRepairs(); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
