"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useHydratedCart } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function CartButton({ ink }) {
  const router = useRouter();
  const { count: cartCount } = useHydratedCart();
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const lastAdded = useCartStore((s) => s.lastAdded);

  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (!lastAdded?.at) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 520);
    return () => clearTimeout(t);
  }, [lastAdded?.at]);

  return (
    <button
      className="group/bag relative flex cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent px-2 py-1.5"
      data-cart-anchor=""
      onClick={() => (cartCount > 0 ? openCartDrawer() : router.push(ROUTES.CART))}
      aria-label={`Shopping bag, ${cartCount} items`}
    >
      <img
        src="/assets/icons/common/cart.svg"
        alt="Cart"
        className={cn(
          'block size-6 [transition:filter_.22s,opacity_.22s] group-hover/bag:opacity-70',
          !ink && 'brightness-0 invert'
        )}
      />
      <span
        className={cn(
          "absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-[8px] border-[1.5px] bg-[#A85A2E] px-1 font-[family-name:'Jost',sans-serif] text-[9.5px] font-bold text-white",
          ink ? 'border-white' : 'border-transparent',
          bump && 'animate-[mnBump_.5s_cubic-bezier(.34,1.56,.64,1)]'
        )}
      >
        {cartCount}
      </span>
    </button>
  );
}
