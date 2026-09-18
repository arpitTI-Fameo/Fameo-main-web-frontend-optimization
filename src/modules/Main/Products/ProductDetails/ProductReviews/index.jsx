'use client';
// modules/Main/Products/ProductDetails/ProductReviews/index.jsx
// Rating summary above, the review columns below. Composes its two children
// and holds no state of its own.

import { DETAIL_REVIEWS } from '../constants';
import Separator from '@/components/ui/Separator';

import RatingSummary from './RatingSummary';
import ReviewCard from './ReviewCard';
import { S } from './styles';

/**
 * Props
 *  rating   number
 *  count    number
 *  bars     [{ stars, percent }]
 *  reviews  [{ id, rating, title, body, author }]
 */
export default function ProductReviews({ rating = 0, count = 0, bars = [], reviews = [] }) {
  if (!reviews.length) return null;

  return (
    <>
      <style>{S}</style>
      <section className="pdp-section" aria-labelledby="pdp-reviews-title">
        <div className="pdp-inner">
          <h2 className="pdp-section-title" id="pdp-reviews-title">
            {DETAIL_REVIEWS.title}
          </h2>

          <RatingSummary rating={rating} count={count} bars={bars} />
          
          <Separator variant="straight" className="prv-sep" />

          <div className="prv-grid">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
