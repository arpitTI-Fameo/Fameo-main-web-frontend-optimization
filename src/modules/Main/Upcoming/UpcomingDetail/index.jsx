import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { ArrowUpRightIcon } from '../icons';
import UpcomingHeader from '../UpcomingHeader';

export default function UpcomingDetail({ feature }) {
  return (
    <>
      <Link href={ROUTES.UPCOMING} className="upc-back">← All upcoming features</Link>

      <UpcomingHeader eyebrow={feature.title} />
      
      <p className="upc-intro-desc" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px', fontSize: '1.2rem', color: '#666', lineHeight: 1.6 }}>
        {feature.description}
      </p>
      <section className="upc-panel">
        <div className="upc-media">
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <span className="upc-media-label">Fameo</span>
        </div>

        <div className="upc-info">
          <ul className="upc-features">
            {feature.features.map((item) => (
              <li key={item} className="upc-chip">{item}</li>
            ))}
          </ul>

          <div className="upc-card">
            <p className="upc-card-tag">Expected · {feature.date}</p>
            <h2 className="upc-card-title">{feature.description}</h2>
            <Link href={ROUTES.HOME} className="upc-cta">
              <span className="upc-view">Return to Home</span>
              <span className="upc-go"><ArrowUpRightIcon /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="upc-uses" aria-labelledby="upc-uses-title">
        <p className="upc-uses-eyebrow">Use cases</p>
        <h2 id="upc-uses-title" className="upc-uses-title">How creators will <em>use it</em></h2>

        <ol className="upc-uses-grid">
          {feature.useCases.map((useCase, i) => (
            <li key={useCase.title} className="upc-use">
              <span className="upc-use-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="upc-use-title">{useCase.title}</h3>
              <p className="upc-use-text">{useCase.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
