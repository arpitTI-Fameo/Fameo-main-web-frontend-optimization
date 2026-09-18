'use client';
// modules/Main/Products/ProductDetails/ProductReviews/RatingSummary/index.jsx
// Big average on the left, the five-to-one distribution bars on the right.

import { DETAIL_MAX_RATING, DETAIL_REVIEWS } from '../../constants';
import { StarIcon } from '../../icons';

import { S } from './styles';

/**
 * Props
 *  rating  number
 *  count   number
 *  bars    [{ stars, percent }]  – already ordered 5 → 1 by ratingBars()
 */
export default function RatingSummary({ rating = 0, count = 0, bars = [] }) {
  return (
    <>
      <style>{S}</style>
      <div className="prs-wrap">
        <div className="prs-score">
          <span className="prs-avg">{rating}</span>
          <span className="prs-stars" aria-hidden="true">
            {Array.from({ length: DETAIL_MAX_RATING }, (_, i) => (
              <StarIcon key={i} filled={i < Math.round(rating)} size={13} />
            ))}
          </span>
          <span className="prs-count">{DETAIL_REVIEWS.countLabel(count)}</span>
        </div>

        <ul className="prs-bars">
          {bars.map((bar) => (
            <li className="prs-bar-row" key={bar.stars}>
              <span className="prs-bar-star">{bar.stars}</span>
              <span className="prs-track">
                <span className="prs-fill" style={{ width: `${bar.percent}%` }} />
              </span>
              <span className="prs-pct">{bar.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
