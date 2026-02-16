import React from "react";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  Package,
  Truck,
  Tag,
  Gift,
} from "lucide-react";
import { CartItem, Product } from "../types";
import { formatCurrency } from "../lib/utils";
import { ProductCard } from "../components/ProductCard";

interface CartProps {
  cart: CartItem[];
  products: Product[];
  updateQuantity: (
    id: string,
    options: Record<string, string> | undefined,
    delta: number
  ) => void;
  removeFromCart: (uniqueId: string) => void;
  handleCheckout: (total: number) => void;
  navigateTo: (view: string, id?: string) => void;
  onQuickView: (p: Product) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  compareIds: string[];
  onAddToCart: (p: Product) => void;
}

export const Cart: React.FC<CartProps> = ({
  cart,
  products,
  updateQuantity,
  removeFromCart,
  handleCheckout,
  navigateTo,
  onQuickView,
  wishlist,
  toggleWishlist,
  onToggleCompare,
  compareIds,
  onAddToCart,
}) => {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.125;
  const shipping = subtotal > 5000 ? 0 : 50;
  const total = subtotal + tax + shipping;
  const recommendations = products
    .filter((p) => !cart.find((c) => c.id === p.id))
    .slice(0, 4);

  return (
    <div className="bg-black min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto space-y-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#CDA032] to-[#F1E08A] rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart size={26} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white leading-none">
                Shopping Cart
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 mt-2">
                {cart.length} {cart.length === 1 ? "Item" : "Items"} •{" "}
                {formatCurrency(subtotal)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">

          {/* LEFT SIDE */}
          <div className="xl:col-span-8 space-y-8">

            {/* Cart Items */}
            {cart.length > 0 ? (
              <div className="space-y-6">
                {cart.map((item) => {
                  const uniqueId = `${item.id}-${JSON.stringify(
                    item.selectedOptions
                  )}`;

                  return (
                    <div
                      key={uniqueId}
                      className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8"
                    >
                      {/* Image */}
                      <div className="w-full md:w-36 h-36 bg-black/50 rounded-2xl p-6 flex items-center justify-center border border-white/5 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between space-y-6">

                        {/* Top Info */}
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="space-y-2">
                            <h3 className="text-lg font-black italic uppercase text-white">
                              {item.name}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                              {item.category}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-black text-white">
                              {formatCurrency(item.price)}
                            </span>
                            <p className="text-[9px] text-white/20 uppercase">
                              Per Unit
                            </p>
                          </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-white/10 pt-6">

                          {/* Quantity */}
                          <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-xl px-5 py-3">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.selectedOptions,
                                  -1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="text-white/40"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-base font-black w-10 text-center text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.selectedOptions,
                                  1
                                )
                              }
                              className="text-white/40"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Subtotal + Remove */}
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-[9px] uppercase text-white/30">
                                Subtotal
                              </p>
                              <span className="text-xl font-black text-white">
                                {formatCurrency(
                                  item.price * item.quantity
                                )}
                              </span>
                            </div>

                            <button
                              onClick={() => removeFromCart(uniqueId)}
                              className="p-3 bg-red-500/10 rounded-xl"
                            >
                              <Trash2 size={18} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-40 text-center bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl">
                <ShoppingCart
                  size={40}
                  className="mx-auto text-white/20 mb-6"
                />
                <h2 className="text-xl font-black italic uppercase text-white/40">
                  Your Cart is Empty
                </h2>
                <button
                  onClick={() => navigateTo("store")}
                  className="mt-8 px-10 py-4 bg-gradient-to-r from-[#CDA032] to-[#F1E08A] text-black font-black uppercase text-[11px] rounded-full"
                >
                  Browse Store
                </button>
              </div>
            )}

            {/* Recommendations */}
            {cart.length > 0 && recommendations.length > 0 && (
              <div className="pt-16 space-y-8">
                <h3 className="text-xl font-black italic uppercase text-white">
                  You Might Also Like
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {recommendations.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onQuickView={onQuickView}
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={onAddToCart}
                      isCompared={compareIds.includes(p.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE — SUMMARY */}
          <aside className="xl:col-span-4 sticky top-28">
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl p-10 space-y-10">

              <h2 className="text-2xl font-black italic uppercase text-white flex items-center gap-3">
                <Package size={22} className="text-[#CDA032]" />
                Order Summary
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between text-white/40 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white font-black">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-white/40 text-sm">
                  <span>Tax</span>
                  <span className="text-white font-black">
                    {formatCurrency(tax)}
                  </span>
                </div>

                <div className="flex justify-between text-white/40 text-sm">
                  <span>Shipping</span>
                  <span className="text-white font-black">
                    {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                  </span>
                </div>

                <div className="h-px bg-white/10"></div>

                <div className="flex justify-between items-end">
                  <span className="text-white/50 text-sm">Total</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-[#CDA032] to-[#F1E08A] bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigateTo("checkout")}
                disabled={cart.length === 0}
                className="w-full py-5 bg-gradient-to-r from-[#CDA032] to-[#F1E08A] text-black rounded-full font-black uppercase"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigateTo("store")}
                className="w-full py-5 border border-white/10 rounded-full text-white/60"
              >
                Continue Shopping
              </button>

              <div className="pt-6 border-t border-white/5 space-y-3 text-white/30 text-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-green-400" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-blue-400" />
                  Free Shipping Over GHS 5,000
                </div>
                <div className="flex items-center gap-3">
                  <Gift size={16} className="text-[#CDA032]" />
                  Gift Wrapping Available
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
