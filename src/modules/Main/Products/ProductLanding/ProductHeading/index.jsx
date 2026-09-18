'use client';
import { S } from './styles';

/**
 * Reusable ProductHeading for landing sections.
 * Matches the layout:
 * [Eyebrow]
 * [Title with optional <em> tag]                         (o)--- [Link Text]
 * 
 * Props:
 * - eyebrow: string (e.g. "Latest Articles")
 * - title: ReactNode (e.g. <>Recent <em>Insights</em></>)
 * - linkText: string (e.g. "More Articles")
 * - onLinkClick: function
 * - className: string (for passing extra padding/margins from parent)
 */
export default function ProductHeading({
  eyebrow,
  title,
  linkText,
  onLinkClick,
  className = '',
}) {
  return (
    <>
      <style>{S}</style>
      <div className={`ph-wrap ${className}`}>
        <div className="ph-left">
          {eyebrow && <h4 className="ph-eyebrow">{eyebrow}</h4>}
          <h2 className="ph-title">{title}</h2>
        </div>

        {linkText && onLinkClick && (
          <div className="ph-right">
            <button type="button" className="ph-link" onClick={onLinkClick}>
              <div className="ph-deco" aria-hidden="true">
                <div className="ph-dot" />
                <div className="ph-line" />
              </div>
              <span>{linkText}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
