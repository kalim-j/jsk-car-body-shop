"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { 
  Plus, 
  Trash2, 
  Camera, 
  Car, 
  Truck, 
  Wrench, 
  Sparkles, 
  Loader2, 
  Save, 
  X, 
  UploadCloud, 
  FileImage,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUploadRepairPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vehicleType, setVehicleType] = useState<"Car" | "Tipper" | "Truck">("Car");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Admin access check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const onFileSelect = (side: 'before' | 'after', file: File) => {
    if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        toast.error("Max file size (5MB) exceeded");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        if (side === 'before') {
            setBeforeFile(file);
            setBeforePreview(reader.result as string);
        } else {
            setAfterFile(file);
            setAfterPreview(reader.result as string);
        }
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (side: 'before' | 'after') => {
      if (side === 'before') {
          setBeforeFile(null);
          setBeforePreview(null);
      } else {
          setAfterFile(null);
          setAfterPreview(null);
      }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
        toast.error("Both 'Before' and 'After' images are required");
        return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("vehicleType", vehicleType);
    formData.append("beforeImage", beforeFile);
    formData.append("afterImage", afterFile);

    try {
        const token = localStorage.getItem("jsk_token");
        const xhr = new XMLHttpRequest();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                toast.success("Repair work published successfully!", { icon: "🏁" });
                router.push("/our-work");
            } else {
                const err = JSON.parse(xhr.responseText || "{}");
                toast.error(err.error || "Upload failed");
                setUploading(false);
            }
        };

        xhr.onerror = () => {
            toast.error("Network Error");
            setUploading(false);
        };

        xhr.open("POST", `${backendUrl}/upload-repair`, true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);

    } catch (err: any) {
        toast.error(err.message);
        setUploading(false);
    }
  };

  if (authLoading || !user) return <div className="h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-brand h-12 w-12" /></div>;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-4">
              <ShieldCheck size={14} /> Admin Terminal // Restoration
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter metallic-gold font-arabic-heading uppercase leading-none">
              Upload Work
            </h1>
            <p className="mt-4 text-zinc-500 max-w-lg font-medium">Add a new restoration story to our global repair showcase. Images are stored securely on Cloudinary.</p>
          </motion.div>

          <button 
            onClick={() => router.push("/admin/repairs")}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
          >
              <ArrowRight className="rotate-180" size={16} /> Portfolio Manager
          </button>
        </div>

        <form onSubmit={handleUpload} className="grid lg:grid-cols-12 gap-12">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="lg:col-span-7 space-y-8"
           >
              <div className="bg-zinc-900/40 p-8 rounded-[3rem] border border-white/5 backdrop-blur-xl">
                 <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Case Title</label>
                            <input 
                                value={title} onChange={e => setTitle(e.target.value)} required
                                placeholder="e.g., Luxury Sedan Dent Repair"
                                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Vehicle Type</label>
                            <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10">
                                {(["Car", "Truck", "Tipper"] as const).map(type => (
                                    <button
                                        key={type} type="button" onClick={() => setVehicleType(type)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            vehicleType === type ? "bg-brand text-black" : "text-zinc-500 hover:text-white"
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Case Description</label>
                        <textarea 
                            value={description} onChange={e => setDescription(e.target.value)} required
                            placeholder="Detail the work performed..."
                            className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand transition-all outline-none h-40 resize-none"
                        />
                    </div>
                 </div>
              </div>

              {/* Upload Controls for Screens */}
              <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Stage 1: Before Repair</label>
                      <ImageUploadBox 
                        onSelect={(f) => onFileSelect('before', f)} 
                        preview={beforePreview} 
                        onClear={() => clearFile('before')}
                      />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[10px] font-black text-brand uppercase tracking-widest px-2">Stage 2: After Restoration</label>
                      <ImageUploadBox 
                        onSelect={(f) => onFileSelect('after', f)} 
                        preview={afterPreview} 
                        onClear={() => clearFile('after')}
                        isAfter
                      />
                  </div>
              </div>
           </motion.div>

           {/* Sidebar Info/Progress */}
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-5 space-y-8"
           >
              <div className="sticky top-32 bg-zinc-900/60 p-10 rounded-[3rem] border border-white/10 backdrop-blur-2xl gold-glow">
                  <div className="mb-10 text-center">
                      <div className="h-20 w-20 bg-brand/10 border border-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <UploadCloud className="text-brand h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-widest italic">Ready to Sync?</h3>
                      <p className="text-zinc-500 text-sm mt-3 font-medium">Verify your restoration story details before synchronizing to the cloud.</p>
                  </div>

                  <div className="space-y-6">
                      <div className="bg-black/60 rounded-3xl p-6 border border-white/5 space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span className="text-zinc-500">Image Payload</span>
                             <span className={beforeFile && afterFile ? "text-green-500" : "text-red-500"}>
                                {beforeFile && afterFile ? "OK" : "MISSING"}
                             </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span className="text-zinc-500">Validation Status</span>
                             <span className="text-brand">PASSED</span>
                          </div>
                      </div>

                      {uploading ? (
                          <div className="space-y-4">
                             <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                <span>Syncing to Cloudinary...</span>
                                <span className="text-brand">{progress}%</span>
                             </div>
                             <div className="h-4 w-full bg-black rounded-full overflow-hidden border border-white/10 p-1">
                                 <motion.div 
                                    className="h-full bg-brand rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                 />
                             </div>
                          </div>
                      ) : (
                        <button 
                            type="submit"
                            className="w-full group bg-brand hover:bg-brand-light text-black py-6 rounded-3xl text-xs font-black uppercase tracking-widest gold-glow flex items-center justify-center gap-3 transition-all"
                        >
                            Publish Restoration Work <Zap size={18} className="fill-black" />
                        </button>
                      )}
                      
                      <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center justify-center p-4">
                          <ShieldCheck size={14} /> Encrypted Admin Session
                      </div>
                  </div>
              </div>
           </motion.div>
        </form>
      </div>
    </div>
  );
}

function ImageUploadBox({ onSelect, preview, onClear, isAfter }: { onSelect: (f: File) => void, preview: string | null, onClear: () => void, isAfter?: boolean }) {
    const [isDrag, setIsDrag] = useState(false);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDrag(false);
        const file = e.dataTransfer.files[0];
        if (file) onSelect(file);
    }, [onSelect]);

    return (
        <div 
            onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={onDrop}
            className={`relative aspect-square rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group ${
                preview ? "border-brand/40" : isDrag ? "border-brand bg-brand/5" : "border-white/10 hover:border-brand/20 bg-zinc-900/20"
            }`}
        >
            {preview ? (
                <>
                    <img src={preview} alt="Preview" className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                            type="button" onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="bg-red-500 p-3 rounded-full text-white shadow-xl hover:scale-110 transition-transform"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center p-8">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-zinc-900 border border-white/5 transition-transform group-hover:scale-110 ${isAfter ? 'text-brand' : 'text-zinc-500'}`}>
                        {isAfter ? <Sparkles size={28} /> : <FileImage size={28} />}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-brand">
                        Drag & Drop or Click to Upload
                    </p>
                    <p className="text-[8px] font-bold text-zinc-600 mt-2 uppercase tracking-tight">JPG, PNG, WEBP (Max 5MB)</p>
                </div>
            )}
            <input 
                type="file" 
                accept="image/*" 
                onChange={e => e.target.files?.[0] && onSelect(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
        </div>
    );
}
