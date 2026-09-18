// modules/Main/Products/ProductDetails/ProductReviews/ReviewCard/index.jsx
// One review: stars, title, body, then the author with an initial avatar.

import { DETAIL_MAX_RATING } from '../../constants';
import { StarIcon } from '../../icons';

import { S } from './styles';

/** Props: review { rating, title, body, author } */
export default function ReviewCard({ review }) {
  if (!review) return null;

  return (
    <>
      <style>{S}</style>
      <article className="prc-card">
        <span className="prc-stars" aria-label={`${review.rating} out of ${DETAIL_MAX_RATING}`}>
          {Array.from({ length: DETAIL_MAX_RATING }, (_, i) => (
            <StarIcon key={i} filled={i < review.rating} size={12} />
          ))}
        </span>

        <h3 className="prc-title">{review.title}</h3>
        <p className="prc-body">{review.body}</p>

        <footer className="prc-author">
          <span className="prc-avatar" aria-hidden="true">{review.author.charAt(0)}</span>
          {review.author}
        </footer>
      </article>
    </>
  );
}
