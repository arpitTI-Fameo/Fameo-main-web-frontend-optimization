// modules/Main/Products/ProductDetails/ProductSummary/HighlightList/index.jsx
// The ticked promises under the add-to-cart row. Pure presentation.

import { CheckIcon } from '../../icons';

import { S } from './styles';

/** Props: items string[] */
export default function HighlightList({ items = [] }) {
  if (!items.length) return null;

  return (
    <>
      <style>{S}</style>
      <ul className="phl-list">
        {items.map((text) => (
          <li className="phl-item" key={text}>
            <span className="phl-tick" aria-hidden="true"><CheckIcon size={12} /></span>
            {text}
          </li>
        ))}
      </ul>
    </>
  );
}
