"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Package,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  description: string;
  stock: number;
  quantity?: number;
  status?: string;
  createdAt: unknown;
}

interface ProductSubmission {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  submittedByEmail: string;
  createdAt: unknown;
}

const CATEGORY_COLORS: Record<string, string> = {
  spare: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  accessory: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  oil: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  tyre: "bg-green-500/15 text-green-400 border-green-500/30",
};

export default function AdminProductsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [submissions, setSubmissions] = useState<ProductSubmission[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [activeTab, setActiveTab] = useState<"inventory" | "submissions">(
    "inventory"
  );
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState<ProductSubmission | null>(
    null
  );

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) { router.push("/"); return; }

    // Live inventory feed
    const pq = query(
      collection(db, "products"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const unsub1 = onSnapshot(pq, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
      setLoadingProducts(false);
    });

    // Live submissions feed
    const sq = query(
      collection(db, "product_submissions"),
      orderBy("createdAt", "desc")
    );
    const unsub2 = onSnapshot(sq, (snap) => {
      setSubmissions(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProductSubmission))
      );
      setLoadingSubmissions(false);
    });

    return () => { unsub1(); unsub2(); };
  }, [isAdmin, authLoading, router]);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product from the marketplace?")) return;
    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted");
  };

  const handleApproveSubmission = async (sub: ProductSubmission) => {
    try {
      // Copy to products collection
      await addDoc(collection(db, "products"), {
        name: sub.name,
        category: sub.category,
        brand: sub.brand,
        price: sub.price,
        description: sub.description,
        image: sub.image,
        images: [sub.image],
        stock: 0,
        quantity: 0,
        status: "approved",
        addedBy: "admin_approved_submission",
        submissionId: sub.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Mark submission as approved
      await updateDoc(doc(db, "product_submissions", sub.id), {
        status: "approved",
        updatedAt: serverTimestamp(),
      });

      toast.success(`"${sub.name}" approved & added to inventory`);
      setSelectedSub(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve submission");
    }
  };

  const handleRejectSubmission = async (id: string) => {
    await updateDoc(doc(db, "product_submissions", id), {
      status: "rejected",
      updatedAt: serverTimestamp(),
    });
    toast.success("Submission rejected");
    setSelectedSub(null);
  };

  // ── Filters ───────────────────────────────────────────────────────────────────

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const pendingSubs = submissions.filter((s) => s.status === "pending");
  const resolvedSubs = submissions.filter((s) => s.status !== "pending");

  if (authLoading || loadingProducts) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">
              Product{" "}
              <span className="text-[#D4AF37]">Management</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Manage inventory and review user submissions
            </p>
          </div>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all whitespace-nowrap"
          >
            <Plus size={18} /> Add Product
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#111] border border-white/5 rounded-xl p-1 w-fit mb-8">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "inventory"
                ? "bg-[#D4AF37] text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ShoppingBag size={14} />
            Inventory
            <span className="text-xs opacity-70">({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "submissions"
                ? "bg-[#D4AF37] text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Clock size={14} />
            Submissions
            {pendingSubs.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingSubs.length}
              </span>
            )}
          </button>
        </div>

        {/* ── INVENTORY TAB ─────────────────────────────────────────────────── */}
        {activeTab === "inventory" && (
          <>
            {/* Search */}
            <div className="relative mb-6 max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inventory..."
                className="w-full bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:border-[#D4AF37] outline-none"
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-20 text-center">
                <Package size={48} className="mx-auto text-gray-700 mb-4" />
                <h3 className="text-white text-lg font-medium">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Add your first product to the marketplace
                </p>
                <Link
                  href="/admin/products/add"
                  className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition-all text-sm"
                >
                  <Plus size={16} /> Add Product
                </Link>
              </div>
            ) : (
              <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.03] border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Brand</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((product, i) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black flex-shrink-0">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={20} className="text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-gray-600 text-xs line-clamp-1 max-w-[200px]">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                              CATEGORY_COLORS[product.category] ||
                              "bg-white/5 text-gray-400 border-white/10"
                            }`}
                          >
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {product.brand || "—"}
                        </td>
                        <td className="px-6 py-4 text-white font-mono text-sm">
                          ₹{product.price.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-medium ${
                              (product.stock || product.quantity || 0) < 5
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {product.stock || product.quantity || 0} pcs
                            {(product.stock || product.quantity || 0) < 5 && (
                              <AlertCircle
                                size={12}
                                className="inline ml-1 opacity-70"
                              />
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── SUBMISSIONS TAB ───────────────────────────────────────────────── */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            {/* Pending */}
            {pendingSubs.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock size={14} /> Pending Review ({pendingSubs.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {pendingSubs.map((sub, i) => (
                    <SubmissionCard
                      key={sub.id}
                      sub={sub}
                      i={i}
                      onView={() => setSelectedSub(sub)}
                      onApprove={() => handleApproveSubmission(sub)}
                      onReject={() => handleRejectSubmission(sub.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {resolvedSubs.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  History ({resolvedSubs.length})
                </h2>
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.03] border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Submitted By</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {resolvedSubs.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {sub.image && (
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0">
                                  <Image
                                    src={sub.image}
                                    alt={sub.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {sub.name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {sub.category} · {sub.brand}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {sub.submittedByEmail}
                          </td>
                          <td className="px-6 py-4 text-white font-mono text-sm">
                            ₹{sub.price.toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                sub.status === "approved"
                                  ? "bg-green-500/15 text-green-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {submissions.length === 0 && !loadingSubmissions && (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-20 text-center">
                <Tag size={40} className="mx-auto text-gray-700 mb-4" />
                <h3 className="text-white text-lg font-medium">
                  No submissions yet
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Users can suggest products from the marketplace page
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Review Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedSub && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSub(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              className="fixed inset-x-4 top-[10%] max-w-lg mx-auto bg-[#0c0c0c] border border-white/10 rounded-3xl p-8 z-[60] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Review Submission
                </h2>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Image */}
              {selectedSub.image && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 bg-black">
                  <Image
                    src={selectedSub.image}
                    alt={selectedSub.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Product</span>
                  <span className="text-white font-medium">
                    {selectedSub.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="text-white capitalize">
                    {selectedSub.category}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Brand</span>
                  <span className="text-white">{selectedSub.brand}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Suggested Price</span>
                  <span className="text-[#D4AF37] font-bold">
                    ₹{selectedSub.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Submitted By</span>
                  <span className="text-white">
                    {selectedSub.submittedByEmail}
                  </span>
                </div>
                {selectedSub.description && (
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Description</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedSub.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApproveSubmission(selectedSub)}
                  className="flex-1 py-3 bg-green-500/15 text-green-400 border border-green-500/30 rounded-xl text-sm font-bold hover:bg-green-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => handleRejectSubmission(selectedSub.id)}
                  className="flex-1 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function SubmissionCard({
  sub,
  i,
  onView,
  onApprove,
  onReject,
}: {
  sub: ProductSubmission;
  i: number;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      className="bg-[#111] border border-yellow-500/20 rounded-2xl overflow-hidden"
    >
      {sub.image && (
        <div className="relative h-40 bg-black">
          <Image
            src={sub.image}
            alt={sub.name}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold text-sm line-clamp-1">
              {sub.name}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              {sub.brand} · {sub.category}
            </p>
          </div>
          <span className="text-[#D4AF37] font-bold text-sm whitespace-nowrap ml-2">
            ₹{sub.price.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-gray-500 text-xs mb-1">
          by {sub.submittedByEmail}
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onView}
            className="flex-1 py-2 bg-white/5 text-gray-400 hover:text-white rounded-xl text-xs transition-all flex items-center justify-center gap-1 border border-white/5"
          >
            <Eye size={12} /> View
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-2 bg-green-500/15 text-green-400 hover:bg-green-500/25 rounded-xl text-xs transition-all flex items-center justify-center gap-1 border border-green-500/20"
          >
            <CheckCircle size={12} /> Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-xs transition-all flex items-center justify-center gap-1 border border-red-500/20"
          >
            <XCircle size={12} /> Reject
          </button>
        </div>
      </div>
    </motion.div>
  );
}
