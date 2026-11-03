import React, { useState } from 'react';
import { ShoppingBag, Star, Plus, Minus, Check, ArrowRight, X, ShieldCheck } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageColor: string;
}

export function ECommerceApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({ '1': 1 });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const products: Product[] = [
    { id: '1', name: 'AeroPulse Wireless ANC Headphones', category: 'Audio', price: 249, rating: 4.9, imageColor: 'from-slate-700 to-slate-900' },
    { id: '2', name: 'Precision Mechanical Keyboard 75%', category: 'Hardware', price: 179, rating: 4.8, imageColor: 'from-blue-900 to-indigo-950' },
    { id: '3', name: 'Titanium Minimalist Smart Ring Gen 3', category: 'Wearables', price: 299, rating: 4.9, imageColor: 'from-emerald-950 to-slate-900' },
    { id: '4', name: 'Ultra-Wide 4K Studio Monitor Lightbar', category: 'Accessories', price: 89, rating: 4.7, imageColor: 'from-amber-950 to-slate-900' },
    { id: '5', name: 'Ergonomic Magnetic Desk Mat', category: 'Accessories', price: 49, rating: 4.6, imageColor: 'from-purple-950 to-slate-900' },
    { id: '6', name: 'Pro Thunderbolt 4 Docking Station', category: 'Hardware', price: 219, rating: 4.8, imageColor: 'from-cyan-950 to-slate-900' },
  ];

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[id] > 1) {
        copy[id] -= 1;
      } else {
        delete copy[id];
      }
      return copy;
    });
  };

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = products.find((p) => p.id === id);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div 
      className="h-full w-full bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden relative"
      data-component="ECommerceApp"
      data-file="src/components/preview-apps/ECommerceApp.tsx"
    >
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div className="text-sm font-bold tracking-tight text-white">
            OmniCommerce
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          {['All', 'Hardware', 'Audio', 'Wearables', 'Accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCategory === cat ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cart Trigger */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Cart</span>
          <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold rounded-full text-[10px] tabular-nums">
            {cartTotalItems}
          </span>
        </button>
      </header>

      {/* Product Grid */}
      <main className="flex-1 overflow-y-auto p-5">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Curated Hardware Essentials</h2>
            <span className="text-xs text-slate-400 font-mono">Showing {filteredProducts.length} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className={`h-32 w-full rounded-lg bg-gradient-to-br ${p.imageColor} border border-slate-800 flex items-center justify-center text-slate-400 font-mono text-xs mb-3`}>
                    <div className="text-center p-2">
                      <div className="font-semibold text-white text-xs">{p.name}</div>
                      <span className="text-[10px] text-emerald-400 block mt-1">{p.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">{p.category}</span>
                    <span className="text-amber-400 flex items-center gap-1 font-mono text-[11px]">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {p.rating}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{p.name}</h3>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                  <span className="text-sm font-bold font-mono text-white tabular-nums">${p.price}</span>
                  <button
                    onClick={() => addToCart(p.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 flex justify-end">
          <div className="w-80 h-full bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-emerald-400" />
                  Your Cart ({cartTotalItems})
                </div>
                <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {checkoutSuccess ? (
                <div className="text-center py-12 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Order Confirmed!</h4>
                  <p className="text-xs text-slate-400">Transaction verified. Receipt dispatched to your email.</p>
                  <button
                    onClick={() => {
                      setCart({});
                      setCheckoutSuccess(false);
                      setCartOpen(false);
                    }}
                    className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-medium"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
                  {Object.entries(cart).map(([id, qty]) => {
                    const prod = products.find((p) => p.id === id);
                    if (!prod) return null;
                    return (
                      <div key={id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-white truncate">{prod.name}</div>
                          <div className="text-slate-400 font-mono mt-0.5">${prod.price} ea</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => removeFromCart(id)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono font-bold text-white tabular-nums">{qty}</span>
                          <button onClick={() => addToCart(id)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!checkoutSuccess && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-base font-bold font-mono text-white tabular-nums">${cartSubtotal}</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Stripe Checkout Simulator Active
                </div>
                <button
                  disabled={cartTotalItems === 0}
                  onClick={() => setCheckoutSuccess(true)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Complete Checkout (${cartSubtotal})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
