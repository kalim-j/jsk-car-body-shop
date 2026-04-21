"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  AlertCircle,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Loader2,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { addDoc, collection as fsCollection, serverTimestamp } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  description: string;
  stock?: number;
  quantity?: number;
  status?: string;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "spare", label: "Spare Parts" },
  { value: "accessory", label: "Accessory" },
  { value: "oil", label: "Oil & Fluids" },
  { value: "tyre", label: "Tyres" },
];

const CATEGORY_BADGE: Record<string, string> = {
  spare: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  accessory: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  oil: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  tyre: "bg-green-500/15 text-green-400 border border-green-500/30",
};

export default function ShopPage() {
  const { user } = useAuth();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalAmount,
    clearCart,
  } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Only fetch approved products
  useEffect(() => {
    const q = query(
      collection(db, "products"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setProducts(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  const getStock = (p: Product) =>
    typeof p.stock === "number" ? p.stock : typeof p.quantity === "number" ? p.quantity : 0;

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q);
    const matchesCategory =
      category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const placeOrder = async () => {
    if (!user) { toast.error("Please login to place an order"); return; }
    if (cartItems.length === 0) { toast.error("Your cart is empty"); return; }

    setIsCheckingOut(true);
    try {
      await addDoc(fsCollection(db, "orders"), {
        userId: user.uid,
        userName: user.displayName || "Customer",
        userEmail: user.email,
        items: cartItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        totalPrice: totalAmount,
        totalAmount,
        status: "pending",
        paymentMethod: "COD",
        createdAt: serverTimestamp(),
      });

      toast.success("Order placed successfully!", { duration: 4000 });
      await clearCart();
      setIsCartOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      {/* Hero Strip */}
      <div className="border-b border-white/5 pb-10 mb-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Spare Parts{" "}
              <span className="text-[#D4AF37]">Marketplace</span>
            </h1>
            <p className="text-gray-400">
              Genuine parts · Fast delivery · COD available
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Suggest a product */}
            <Link
              href="/shop/submit"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all text-sm font-medium"
            >
              <Lightbulb size={15} />
              Suggest Product
            </Link>

            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-black rounded-xl hover:bg-yellow-500 transition-all font-bold text-sm"
            >
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Search + Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or brand..."
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:border-[#D4AF37] outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  category === cat.value
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-[#111] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <AlertCircle
              size={48}
              className="mx-auto text-gray-700 mb-4"
            />
            <h3 className="text-xl font-semibold text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Try adjusting your search or category filter
            </p>
            <Link
              href="/shop/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition-all text-sm"
            >
              <Lightbulb size={15} />
              Suggest a product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product, i) => {
              const stock = getStock(product);
              const inCart = cartItems.find(
                (ci) => ci.productId === product.id
              );

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col group hover:border-[#D4AF37]/20 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-black/50">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={32} className="text-gray-700" />
                      </div>
                    )}

                    {/* Out of stock overlay */}
                    {stock <= 0 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Stock badge */}
                    {stock > 0 && stock <= 5 && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-orange-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          Only {stock} left
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Category + Brand row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          CATEGORY_BADGE[product.category] ||
                          "bg-white/5 text-gray-500 border-white/10"
                        }`}
                      >
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="text-[9px] text-gray-600 uppercase tracking-wider">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {/* Price + Stock */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-white">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            stock > 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {stock > 0 ? `${stock} in stock` : "Out of stock"}
                        </span>
                      </div>

                      {/* Cart button */}
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(inCart.id, inCart.quantity - 1)
                            }
                            className="flex-1 h-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white text-sm font-bold w-6 text-center">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() =>
                              disabled_add_check(stock, inCart, updateQuantity)
                            }
                            className="flex-1 h-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (stock <= 0) return;
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image || "",
                            });
                          }}
                          disabled={stock <= 0}
                          className={`w-full h-9 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                            stock > 0
                              ? "bg-[#D4AF37] text-black hover:bg-yellow-500"
                              : "bg-white/5 text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          <Plus size={14} />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom suggest strip */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-16 text-center bg-[#111] border border-white/5 rounded-2xl p-8">
            <Lightbulb size={28} className="mx-auto text-[#D4AF37] mb-3" />
            <h3 className="text-white font-semibold mb-1">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              Suggest a product and we&apos;ll add it to the marketplace
            </p>
            <Link
              href="/shop/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition-all text-sm"
            >
              Suggest a Product
            </Link>
          </div>
        )}
      </div>

      {/* ── Cart Drawer ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-[#0c0c0c] border-l border-white/10 z-[60] flex flex-col"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} className="text-[#D4AF37]" />
                  <h2 className="text-lg font-bold text-white">
                    Shopping Cart
                  </h2>
                  {cartCount > 0 && (
                    <span className="bg-[#D4AF37] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart size={28} className="text-gray-600" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Add genuine spare parts to get started
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-5 px-5 py-2 bg-[#D4AF37] text-black font-bold rounded-xl text-sm hover:bg-yellow-500 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 bg-white/[0.03] rounded-2xl p-3 border border-white/5"
                    >
                      <div className="relative w-20 h-20 bg-black rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/no-image.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-white text-sm font-medium leading-snug line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[#D4AF37] font-bold text-sm mt-1">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-white text-sm font-semibold w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 transition-all"
                          >
                            <Plus size={12} />
                          </button>
                          <span className="ml-auto text-gray-500 text-xs">
                            Subtotal:{" "}
                            <span className="text-white font-semibold">
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-white/5 bg-[#0c0c0c]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-2xl font-bold text-white">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs text-center mb-3 uppercase tracking-widest">
                    Cash on Delivery • Free Pickup
                  </p>
                  <button
                    onClick={placeOrder}
                    disabled={isCheckingOut}
                    className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all disabled:opacity-60"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Place Order (COD)
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper — prevent adding more than stock
function disabled_add_check(
  stock: number,
  inCart: { id: string; quantity: number },
  updateQuantity: (id: string, qty: number) => void
) {
  if (inCart.quantity >= stock) {
    toast.error(`Only ${stock} in stock`);
    return;
  }
  updateQuantity(inCart.id, inCart.quantity + 1);
}
