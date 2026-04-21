"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  X,
  Send,
  Package,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
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

export default function ShopSubmitPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "spare",
    brand: "",
    price: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (!authLoading && !user) {
    router.push("/auth/login");
    return null;
  }

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return "";
    const path = `product_submissions/${user!.uid}/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, path);

    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, imageFile);
      task.on(
        "state_changed",
        (snap) => {
          setUploadProgress(
            Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          );
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!user) { toast.error("Please login first"); return; }

    setUploading(true);
    const toastId = toast.loading("Submitting your product suggestion...");

    try {
      const imageUrl = imageFile ? await uploadImage() : "";

      await addDoc(collection(db, "product_submissions"), {
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        price: parseFloat(formData.price) || 0,
        description: formData.description.trim(),
        image: imageUrl,
        status: "pending",
        submittedBy: user.uid,
        submittedByEmail: user.email || "",
        submittedByName: user.displayName || "",
        createdAt: serverTimestamp(),
      });

      toast.success("Your product has been submitted for review!", {
        id: toastId,
        duration: 4000,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Submission Received!
          </h2>
          <p className="text-gray-400 mb-2">
            Your product suggestion has been submitted for admin review.
          </p>
          <p className="text-gray-600 text-sm mb-8">
            You&apos;ll be notified once our team reviews your submission.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", category: "spare", brand: "", price: "", description: "" });
                setImageFile(null);
                setImagePreview("");
              }}
              className="px-6 py-3 bg-[#111] border border-white/10 text-white rounded-xl hover:border-[#D4AF37]/30 transition-all text-sm"
            >
              Submit Another
            </button>
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition-all text-sm"
            >
              Back to Shop
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/shop"
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Suggest a <span className="text-[#D4AF37]">Product</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Can&apos;t find what you need? Let us know!
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl px-4 py-3 mb-8 flex items-start gap-3">
          <Package size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 text-sm leading-relaxed">
            Your suggestion will be reviewed by our admin team. If approved, the
            product will be added to the marketplace within 24–48 hours.
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Product Name */}
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
              placeholder="e.g. Bosch Spark Plug for Swift Dzire"
              className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none placeholder-gray-600"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              placeholder="e.g. Bosch, NGK, MRF"
              className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none placeholder-gray-600"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Estimated Price (₹) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0"
                className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none placeholder-gray-600"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Describe the product, why you need it, car compatibility..."
              className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#D4AF37] outline-none placeholder-gray-600 resize-none"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Reference Image{" "}
              <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            {imagePreview ? (
              <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain bg-black"
                />
                {uploading && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-black/60">
                    <div
                      className="h-full bg-[#D4AF37] transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(""); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={12} className="text-white" />
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37]/30 transition-all group"
              >
                <Upload size={24} className="text-gray-600 group-hover:text-[#D4AF37] transition-colors mb-2" />
                <p className="text-gray-500 text-sm">Upload image</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={uploading}
            whileHover={{ scale: uploading ? 1 : 1.01 }}
            whileTap={{ scale: uploading ? 1 : 0.99 }}
            className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit for Review
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
