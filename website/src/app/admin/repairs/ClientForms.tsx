"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { X, Check, Save, Image as ImageIcon } from "lucide-react";

interface RepairFormProps {
  onComplete: () => void;
}

export function ClientCreateRepairForm({ onComplete }: RepairFormProps) {
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title"),
      description: fd.get("description"),
      vehicleType: fd.get("vehicleType"),
      beforeImage: fd.get("beforeImage"),
      afterImage: fd.get("afterImage"),
    };

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
      const res = await fetch(`${backendUrl}/repairs`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Create failed");
      toast.success("Repair work saved!");
      onComplete();
    } catch {
      toast.error("Could not save repair");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Repair Title</label>
          <input className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all" name="title" placeholder="e.g., Tipper Engine Restoration" required />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Vehicle Category</label>
          <select className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all appearance-none" name="vehicleType">
            <option value="Car">Car</option>
            <option value="Tipper">Tipper</option>
            <option value="Truck">Truck</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Repair Description</label>
        <textarea className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all h-24 resize-none" name="description" placeholder="Briefly describe the work done..." required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block font-black">Before Image URL</label>
          <input className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all" name="beforeImage" placeholder="https://..." required />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-brand ml-1 mb-2 block font-black">After Image URL</label>
          <input className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all" name="afterImage" placeholder="https://..." required />
        </div>
      </div>

      <button 
        disabled={loading}
        className="w-full bg-brand text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-light transition-all flex items-center justify-center gap-2 group mt-4 shadow-xl shadow-brand/20"
      >
        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={18} /> Publish Showroom Case</>}
      </button>
    </form>
  );
}

export function ClientUpdateRepairForm({ repair, onComplete }: RepairFormProps & { repair: any }) {
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title"),
      description: fd.get("description"),
      vehicleType: fd.get("vehicleType"),
      beforeImage: fd.get("beforeImage"),
      afterImage: fd.get("afterImage"),
    };

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
      const res = await fetch(`${backendUrl}/repairs/${repair.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Repair details updated!");
      onComplete();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Repair Title</label>
          <input className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all" name="title" defaultValue={repair.title} required />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Vehicle Category</label>
          <select className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all appearance-none" name="vehicleType" defaultValue={repair.vehicleType}>
            <option value="Car">Car</option>
            <option value="Tipper">Tipper</option>
            <option value="Truck">Truck</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Repair Description</label>
        <textarea className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all h-24 resize-none" name="description" defaultValue={repair.description} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Before Image URL</label>
          <input className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all" name="beforeImage" defaultValue={repair.beforeImage} required />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-brand ml-1 mb-2 block">After Image URL</label>
          <input className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all" name="afterImage" defaultValue={repair.afterImage} required />
        </div>
      </div>

      <button 
        disabled={loading}
        className="w-full bg-zinc-100 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 group mt-4 shadow-xl"
      >
        {loading ? <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save size={18} /> Update Record</>}
      </button>
    </form>
  );
}
