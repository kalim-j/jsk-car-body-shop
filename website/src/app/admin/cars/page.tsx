"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Car, CheckCircle, XCircle, Trash2, MapPin, IndianRupee } from "lucide-react";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
      if (!token) throw new Error("No admin token found. Please log in.");

      const res = await fetch(`${backendUrl}/admin/cars`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to fetch cars");
      }

      const data = await res.json();
      setCars(data.cars);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleStatus = async (id: string, status: "Approved" | "Rejected") => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
      const res = await fetch(`${backendUrl}/admin/cars/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(`Car marked as ${status}`);
      fetchCars();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
      const res = await fetch(`${backendUrl}/admin/cars/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`Listing deleted successfully`);
      fetchCars();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-black mb-4">Admin · Cars Moderation</h1>
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl">
          {error}
        </div>
        <Link href="/login" className="mt-4 inline-block bg-brand text-white px-6 py-2 rounded-xl font-bold">Log In Again</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <div className="flex gap-4 mb-4 text-lg font-bold">
            <Link href="/admin/cars" className="text-zinc-900 dark:text-zinc-50 border-b-2 border-brand pb-1 text-brand">Cars</Link>
            <Link href="/admin/dealers" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 pb-1">Dealers</Link>
          </div>
          <h1 className="text-3xl font-black">Moderation · Cars</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Review, approve, or reject used cars submitted by independent users.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden glass shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/5 dark:bg-white/5 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-black">Car Details</th>
                <th className="px-6 py-4 font-black">Price</th>
                <th className="px-6 py-4 font-black">Location</th>
                <th className="px-6 py-4 font-black">Seller</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500">Loading records...</td></tr>
              ) : cars.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No cars found in database.</td></tr>
              ) : cars.map(car => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  key={car.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-800 rounded overflow-hidden shadow">
                        {(() => {
                           let img = "";
                           try { img = JSON.parse(car.images)[0] } catch(e){}
                           return <img src={img || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd"} className="w-full h-full object-cover" />
                        })()}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{car.name}</div>
                        <div className="text-xs text-brand font-black tracking-widest">{car.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <div className="flex items-center"><IndianRupee size={12}/>{car.price.toLocaleString("en-IN")}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 font-medium">
                    {car.district}, {car.state}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{car?.seller?.name || "Unknown"}</div>
                    <div className="text-xs text-zinc-500">{car?.seller?.email || "N/A"}</div>
                    <div className="text-xs font-bold text-blue-500">{car.sellerType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      car.status === "Approved" ? "bg-emerald-500/10 text-emerald-500" :
                      car.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {car.status !== "Approved" && (
                         <button onClick={() => handleStatus(car.id, "Approved")} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded transition-colors" title="Approve">
                           <CheckCircle size={16} />
                         </button>
                       )}
                       {car.status !== "Rejected" && (
                         <button onClick={() => handleStatus(car.id, "Rejected")} className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded transition-colors" title="Reject">
                           <XCircle size={16} />
                         </button>
                       )}
                       <button onClick={() => handleDelete(car.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" title="Delete">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
