"use client";

import React from "react";

export function ClientCreateDealerForm() {
  return (
    <form
      className="mt-4 grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(form);
        const brands = String(fd.get("brands") || "").split(",").map(b => b.trim()).filter(Boolean);
        const services = String(fd.get("services") || "").split(",").map(s => s.trim()).filter(Boolean);
        const payload = {
          name: String(fd.get("name") || ""),
          state: String(fd.get("state") || ""),
          district: String(fd.get("district") || ""),
          phone: String(fd.get("phone") || ""),
          email: String(fd.get("email") || ""),
          brands: brands,
          services: services,
          dealerType: String(fd.get("dealerType") || "Both"),
          experience: String(fd.get("experience") || "10+ years"),
          speciality: String(fd.get("speciality") || "Automotive Business"),
          locationLink: String(fd.get("locationLink") || ""),
          openingHours: String(fd.get("openingHours") || "9 AM - 8 PM"),
          active: Boolean(fd.get("active")),
        };
        const res = await fetch(`/api/admin/dealers`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) alert("Create failed");
        else window.location.reload();
      }}
    >
      <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="name" placeholder="Dealer Name" required />
      <div className="grid grid-cols-2 gap-2">
        <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="state" placeholder="State" required />
        <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="district" placeholder="District" required />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="phone" placeholder="Phone" required />
        <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="email" placeholder="Email" type="email" required />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="experience" placeholder="Experience (e.g. 10+ years)" />
        <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="speciality" placeholder="Speciality (e.g. Body Repair)" />
      </div>
      <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="locationLink" placeholder="Google Maps URL" />
      <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="openingHours" placeholder="Opening Hours (e.g. 9 AM - 8 PM)" />
      <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="brands" placeholder="Brands (comma separated)" />
      <input className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="services" placeholder="Services (comma separated)" />
      
      <select className="rounded-xl border px-4 py-3 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="dealerType">
        <option value="Both">Both</option>
        <option value="New">New</option>
        <option value="Used">Used</option>
      </select>
          
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked /> Active
      </label>
      <button className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-light">
        Create
      </button>
    </form>
  );
}

export function ClientUpdateDealerForm({ dealer }: { dealer: any }) {
  return (
    <form
      className="mt-5 grid gap-2 border-t border-zinc-200/80 pt-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(form);
        const brands = String(fd.get("brands") || "").split(",").map(b => b.trim()).filter(Boolean);
        const services = String(fd.get("services") || "").split(",").map(s => s.trim()).filter(Boolean);
        const payload = {
          name: String(fd.get("name") || ""),
          state: String(fd.get("state") || ""),
          district: String(fd.get("district") || ""),
          phone: String(fd.get("phone") || ""),
          email: String(fd.get("email") || ""),
          brands: brands,
          services: services,
          dealerType: String(fd.get("dealerType") || "Both"),
          experience: String(fd.get("experience") || "10+ years"),
          speciality: String(fd.get("speciality") || "Automotive Business"),
          locationLink: String(fd.get("locationLink") || ""),
          openingHours: String(fd.get("openingHours") || "9 AM - 8 PM"),
          active: Boolean(fd.get("active")),
        };
        const res = await fetch(`/api/admin/dealers/${dealer.id}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) alert("Update failed");
        else window.location.reload();
      }}
    >
      <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="name" defaultValue={dealer.name} required />
      <div className="grid grid-cols-2 gap-1">
        <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="state" defaultValue={dealer.state} required />
        <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="district" defaultValue={dealer.district} required />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="phone" defaultValue={dealer.phone} required />
        <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="email" type="email" defaultValue={dealer.email} required />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="experience" placeholder="Experience" defaultValue={dealer.experience} />
        <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="speciality" placeholder="Speciality" defaultValue={dealer.speciality} />
      </div>
      <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="locationLink" placeholder="Google Maps URL" defaultValue={dealer.locationLink} />
      <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="openingHours" placeholder="Opening Hours" defaultValue={dealer.openingHours} />
      <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="brands" placeholder="Brands (comma separated)" defaultValue={Array.isArray(dealer.brands) ? dealer.brands.join(", ") : ""} />
      <input className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="services" placeholder="Services (comma separated)" defaultValue={Array.isArray(dealer.services) ? dealer.services.join(", ") : ""} />
      
      <select className="rounded-xl border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700" name="dealerType" defaultValue={dealer.dealerType}>
        <option value="Both">Both</option>
        <option value="New">New</option>
        <option value="Used">Used</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={Boolean(dealer.active)} /> Active
      </label>
      <button className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-bold hover:bg-white/80 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-600">
        Update
      </button>
      <button type="button" onClick={async () => {
        if (!confirm("Delete dealer?")) return;
        const res = await fetch(`/api/admin/dealers/${dealer.id}`, { method: "DELETE" });
        if (res.ok) window.location.reload();
      }} className="text-xs text-red-500 font-bold mt-2 text-left">
        Delete Dealer
      </button>
    </form>
  );
}
