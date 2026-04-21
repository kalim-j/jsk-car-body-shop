"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  X,
  Package,
  Loader2,
  Tag,
  DollarSign,
  BarChart2,
  AlignLeft,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "spare", label: "Spare Parts" },
  { value: "accessory", label: "Accessory" },
  { value: "oil", label: "Oil & Fluids" },
  { value: "tyre", label: "Tyres" },
];

const BRANDS = [
  "Bosch", "Denso", "NGK", "MRF", "CEAT", "Apollo", "JK Tyre",
  "Castrol", "Mobil", "Shell", "Gulf", "Exide", "Amaron",
  "Maruti Genuine", "Hyundai Genuine", "Tata Genuine", "Mahindra Genuine",
  "Minda", "Valeo", "Fag", "SKF", "Moog", "Gabriel", "Monroe", "Others",
];

interface UploadProgress {
  file: File;
  preview: string;
  progress: number;
  url?: string;
  error?: string;
}

export default function AddProductPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "spare",
    brand: "",
    price: "",
    quantity: "",
    description: "",
  });

  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Admin guard
  if (!authLoading && !isAdmin) {
    router.push("/");
    return null;
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newUploads: UploadProgress[] = Array.from(files)
      .slice(0, 6 - uploads.length)
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }));
    setUploads((prev) => [...prev, ...newUploads]);
  };

  const removeUpload = (idx: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadAllImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < uploads.length; i++) {
      const up = uploads[i];
      if (up.url) { urls.push(up.url); continue; }

      const path = `products/${Date.now()}_${i}_${up.file.name}`;
      const storageRef = ref(storage, path);

      await new Promise<void>((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, up.file);
        task.on(
          "state_changed",
          (snap) => {
            const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setUploads((prev) =>
              prev.map((u, idx) => (idx === i ? { ...u, progress: pct } : u))
            );
          },
          (err) => {
            setUploads((prev) =>
              prev.map((u, idx) => (idx === i ? { ...u, error: err.message } : u))
            );
            reject(err);
          },
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            setUploads((prev) =>
              prev.map((u, idx) => (idx === i ? { ...u, url, progress: 100 } : u))
            );
            urls.push(url);
            resolve();
          }
        );
      });
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) {
      toast.error("Please fill all required fields");
      return;
    }
    if (uploads.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Uploading images & saving product...");

    try {
      const imageUrls = await uploadAllImages();

      await addDoc(collection(db, "products"), {
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        stock: parseInt(formData.quantity), // keep compatibility
        description: formData.description.trim(),
        images: imageUrls,
        image: imageUrls[0] || "", // backward compat
        status: "approved",
        addedBy: "admin",
        addedByEmail: user?.email || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Product published successfully!", { id: toastId });
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product. Please try again.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Product Published!</h2>
          <p className="text-gray-400 mb-8">
            The product is now live in the marketplace.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setDone(false); setFormData({ name: "", category: "spare", brand: "", price: "", quantity: "", description: "" }); setUploads([]); }}
              className="px-6 py-3 bg-[#111] border border-white/10 text-white rounded-xl hover:border-gold-500/30 transition-all"
            >
              Add Another
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition-all"
            >
              View Inventory
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Add <span className="text-[#D4AF37]">Product</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Fill in the details to publish a new spare part
            </p>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Image Upload Zone */}
          <div className="bg-[#0c0c0c] border border-white/8 rounded-2xl p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-4">
              <ImageIcon size={16} className="text-[#D4AF37]" />
              Product Images
              <span className="text-gray-600 font-normal ml-1">
                (up to 6 images)
              </span>
            </label>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[#D4AF37]/40 hover:bg-white/[0.02] transition-all group"
            >
              <Upload
                size={32}
                className="mx-auto text-gray-600 group-hover:text-[#D4AF37] transition-colors mb-3"
              />
              <p className="text-gray-400 text-sm">
                Click to upload images
              </p>
              <p className="text-gray-600 text-xs mt-1">
                JPG, PNG, WebP — max 10MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Image previews */}
            {uploads.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                {uploads.map((up, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10"
                  >
                    <Image
                      src={up.preview}
                      alt=""
                      fill
                      className="object-cover"
                    />
                    {/* Progress bar */}
                    {up.progress > 0 && up.progress < 100 && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/60">
                        <div
                          className="h-full bg-[#D4AF37] transition-all"
                          style={{ width: `${up.progress}%` }}
                        />
                      </div>
                    )}
                    {up.progress === 100 && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                    )}
                    {!saving && (
                      <button
                        type="button"
                        onClick={() => removeUpload(idx)}
                        className="absolute top-1 left-1 w-5 h-5 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    )}
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 right-1 text-center">
                        <span className="text-[9px] bg-[#D4AF37] text-black px-1 rounded font-bold">
                          MAIN
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {uploads.length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-[#D4AF37]/40 transition-all flex items-center justify-center text-gray-600 hover:text-[#D4AF37]"
                  >
                    <Upload size={20} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-[#0c0c0c] border border-white/8 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Package size={16} className="text-[#D4AF37]" />
              Product Details
            </h2>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Bosch Spark Plug Set — Maruti Swift"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none placeholder-gray-600 transition-colors"
                required
              />
            </div>

            {/* Category + Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                  <Tag size={12} /> Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Brand <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none transition-colors"
                  required
                >
                  <option value="">Select Brand</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                  <DollarSign size={12} /> Price (₹){" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none placeholder-gray-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                  <BarChart2 size={12} /> Stock Quantity{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  placeholder="0"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none placeholder-gray-600 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                <AlignLeft size={12} /> Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                placeholder="Detailed description of the product — compatibility, features, condition..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none placeholder-gray-600 resize-none transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.01 }}
            whileTap={{ scale: saving ? 1 : 0.99 }}
            className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Package size={20} />
                Publish Product to Marketplace
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
