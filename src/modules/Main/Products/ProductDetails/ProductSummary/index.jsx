'use client';
// modules/Main/Products/ProductDetails/ProductSummary/index.jsx
// Right half of the top block: category chip, title, rating, price, variant
// axes, quantity + add to cart, wishlist and the highlight list.
//
// Presentational. Every piece of state it shows — selected variants, quantity,
// wishlist — is owned by the page and arrives as props, so the same component
// can later be driven by a live SKU without touching this file.
//
// Price is rendered by PlanPrice rather than inr() directly: the storefront
// shows a member their plan price everywhere, and a detail page that printed
// the raw listed price would be the one surface that disagrees.

import AddToBagButton from '@/components/ui/AddToBagButton';
import Separator from '@/components/ui/Separator';
import { inr } from '@/utils/formatCurrency';

import PlanPrice from '../PlanPrice';
import { DETAIL_ADD_TO_CART, DETAIL_MAX_RATING, DETAIL_WISHLIST } from '../constants';
import { HeartIcon, LockIcon, StarIcon } from '../icons';

import HighlightList from './HighlightList';
import QuantityStepper from './QuantityStepper';
import VariantPicker from './VariantPicker';
import { S } from './styles';

/**
 * Props
 *  product      merged detail product
 *  selection    { [axisId]: value }
 *  onVariant    (axisId, value) => void
 *  quantity     number
 *  onQuantity   (next) => void
 *  onAddToCart  () => cartStore result   – handed straight to AddToBagButton
 *  isWished     boolean
 *  onWishlist   () => void
 */
export default function ProductSummary({
  product,
  selection = {},
  onVariant,
  quantity = 1,
  onQuantity,
  onAddToCart,
  isWished = false,
  onWishlist,
}) {
  if (!product) return null;

  const rating = Number(product.rating) || 0;
  const axes = product.variantAxes || [];

  return (
    <>
      <style>{S}</style>
      <section className="pds-wrap" aria-label={`${product.name} details`}>
        {product.category && <span className="pds-chip">{product.category}</span>}

        <h1 className="pds-title">{product.name}</h1>

        {(product.tagline || product.desc) && (
          <p className="pds-sub">{product.tagline || product.desc}</p>
        )}

        {rating > 0 && (
          <div className="pds-rating">
            <span className="pds-stars" aria-hidden="true">
              {Array.from({ length: DETAIL_MAX_RATING }, (_, i) => (
                <StarIcon key={i} filled={i < Math.round(rating)} size={13} />
              ))}
            </span>
            <span className="pds-rating-text">
              {rating} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="pds-price-row">
          <PlanPrice price={product.sellingPrice} qty={quantity} size="lg" />
          {product.mrp && <span className="pds-mrp">{inr(product.mrp)}</span>}
          {product.savePercent && (
            <span className="pds-save">Save {product.savePercent}%</span>
          )}
        </div>

        {axes.map((axis) => (
          <VariantPicker
            key={axis.id}
            axis={axis}
            selected={selection[axis.id]}
            onSelect={(value) => onVariant?.(axis.id, value)}
          />
        ))}

        <div className="pds-actions">
          <QuantityStepper value={quantity} max={product.stock} onChange={onQuantity} />

          <AddToBagButton
            className="pds-cart"
            onAdd={onAddToCart}
            label={DETAIL_ADD_TO_CART.label}
            addedLabel={DETAIL_ADD_TO_CART.added}
            disabled={product.available === false}
          />
          <span className="pds-lock" aria-hidden="true"><LockIcon /></span>
        </div>

        <button
          type="button"
          className={`pds-wish${isWished ? ' is-on' : ''}`}
          onClick={onWishlist}
          aria-pressed={isWished}
        >
          <HeartIcon filled={isWished} size={16} />
          {isWished ? DETAIL_WISHLIST.remove : DETAIL_WISHLIST.add}
        </button>

        <HighlightList items={product.highlights} />
      </section>
    </>
  );
}
