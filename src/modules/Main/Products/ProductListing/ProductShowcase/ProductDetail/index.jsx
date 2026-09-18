'use client';
// modules/Products/ProductShowcase/ProductDetail/index.jsx

import { useEffect, useState } from "react";
import { useMembership } from "@/lib/hooks/custome/useMembership";

import { DISCOUNT_LABEL } from '../constants';
import { formatINR } from '../helpers';

/* ── detail overlay ────────────────────────────────────────────── */
export default function ProductDetail({ product, onClose, onAddToCart }) {
  const { percent, meta, isMember } = useMembership();
  // Same silent-add problem as the grid — the CTA gave no confirmation at all.
  const [added, setAdded] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!product) return null;
  const img = product.images?.[0]?.url;
  const price = formatINR(product.listed_price);

  // BUG: this used to price off `product.max_discount_pct` — the product's
  // discount CEILING — so every visitor, including anonymous and free-tier
  // users, was shown the full Elite price as if it were their own. Now it
  // prices off the viewer's actual plan rate, capped by the product's ceiling.
  const capPct = Number(product.max_discount_pct) || 0;
  const planPct = capPct ? Math.min(percent, capPct) : percent;
  const applies = product.discount_mode !== "NO_DISCOUNT" && planPct > 0;
  const memberPrice = applies
    ? formatINR(Math.round(product.listed_price * (1 - planPct / 100)))
    : null;

  return (
    <div className="ps-overlay" role="dialog" aria-modal="true" aria-label={product.name}>
      <button className="ps-scrim" onClick={onClose} aria-label="Close details" />
      <div className="ps-sheet">
        <button className="ps-close" onClick={onClose} aria-label="Close">×</button>

        <div className="ps-sheet-media">
          {img ? (
            <img src={img} alt={product.name} />
          ) : (
            <div className="ps-sheet-fallback">
              <span className="ps-glyph">{(product.category || "g").slice(0, 1)}</span>
            </div>
          )}
        </div>

        <div className="ps-sheet-body">
          <p className="ps-eyebrow">{product.category || "gear"}</p>
          <h3 className="ps-sheet-title">{product.name}</h3>
          {product.size && <p className="ps-size">{product.size}</p>}
          <p className="ps-desc">{product.description}</p>

          {product.features?.length > 0 && (
            <ul className="ps-features">
              {product.features.map((f, i) => (
                <li key={i}><span className="ps-dot">•</span> {f}</li>
              ))}
            </ul>
          )}

          <div className="ps-pricing">
            <div>
              <p className="ps-price">{memberPrice || price}</p>
              {memberPrice && <p className="ps-strike">{price}</p>}
            </div>
            <p className="ps-plan-note">
              {applies
                ? `${meta.icon} ${meta.label} — ${planPct}% off applied`
                : isMember
                  ? (DISCOUNT_LABEL[product.discount_mode] || "fixed price")
                  : "join a plan for member pricing"}
            </p>
          </div>

          <div className="ps-actions">
            <button
              className="ps-cta"
              disabled={product.stock === 0}
              onClick={(e) => {
                const res = onAddToCart?.(product, e.currentTarget.closest('.ps-sheet'));
                if (res?.ok === false) return;
                setAdded(true);
                setTimeout(() => setAdded(false), 1400);
              }}
            >
              {product.stock === 0 ? "out of stock" : added ? "added ✓" : "add to cart"}
            </button>
            {typeof product.stock === "number" && product.stock > 0 && product.stock <= 5 && (
              <span className="ps-stock">only {product.stock} left</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
