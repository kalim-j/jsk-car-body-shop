"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export default function CartPage() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart } =
    useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      router.push("/auth/login");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userName: user.displayName || "Customer",
        userEmail: user.email,
        items: cartItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          subtotal: i.price * i.quantity,
        })),
        totalPrice: totalAmount,
        totalAmount,
        status: "pending",
        paymentMethod: "COD",
        createdAt: serverTimestamp(),
      });

      toast.success("Order placed successfully!", { duration: 5000 });
      await clearCart();
      setOrdered(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ── Order Success ─────────────────────────────────────────────────────────
  if (ordered) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Order Placed! 🎉
          </h2>
          <p className="text-gray-400 mb-2">
            Your order has been received and is being processed.
          </p>
          <p className="text-gray-600 text-sm mb-8">
            Our team will contact you soon for delivery details. Payment is{" "}
            <span className="text-[#D4AF37]">Cash on Delivery</span>.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-[#111] border border-white/10 text-white rounded-xl hover:border-[#D4AF37]/30 transition-all text-sm"
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition-all text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Empty Cart ────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={36} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Browse our marketplace and add genuine spare parts to your cart.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition-all text-sm"
          >
            <ShoppingBag size={16} />
            Go to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // ── Cart Page ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/shop"
            className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Shopping <span className="text-[#D4AF37]">Cart</span>
            </h1>
            <p className="text-gray-500 text-sm">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  className="bg-[#111] border border-white/5 rounded-2xl p-5 flex gap-5 hover:border-white/10 transition-colors"
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0">
                    <Image
                      src={item.image || "/no-image.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex-shrink-0 p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="text-[#D4AF37] font-bold mt-1.5">
                      ₹{item.price.toLocaleString("en-IN")} / pc
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white font-bold text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item subtotal */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Subtotal</p>
                        <p className="text-white font-bold text-base">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sticky top-28">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <Package size={16} className="text-[#D4AF37]" />
                Order Summary
              </h2>

              {/* Line items */}
              <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-400 line-clamp-1 flex-1 mr-3">
                      {item.name}{" "}
                      <span className="text-gray-600">×{item.quantity}</span>
                    </span>
                    <span className="text-white whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Subtotal</span>
                  <span className="text-white font-semibold">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Shipping</span>
                  <span className="text-green-400 text-sm font-semibold">
                    Free
                  </span>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#D4AF37] font-bold text-xl">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment note */}
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl px-4 py-3 mb-5 text-center">
                <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                  Cash on Delivery
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Pay when your order arrives
                </p>
              </div>

              {/* Checkout button */}
              <motion.button
                onClick={placeOrder}
                disabled={isCheckingOut}
                whileHover={{ scale: isCheckingOut ? 1 : 1.02 }}
                whileTap={{ scale: isCheckingOut ? 1 : 0.98 }}
                className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Place Order
                  </>
                )}
              </motion.button>

              <Link
                href="/shop"
                className="block text-center text-gray-500 hover:text-white text-sm mt-4 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
