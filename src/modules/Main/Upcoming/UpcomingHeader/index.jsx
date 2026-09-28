export default function UpcomingHeader({ eyebrow, intro }) {
  return (
    <header className="upc-head">
      <p className="upc-eyebrow">( {eyebrow} )</p>
      <h1 className="upc-title">Launch <em>Coming Soon</em></h1>
      <p className="upc-tagline">( Stay Tuned )</p>
      {intro && <p className="upc-intro">{intro}</p>}
    </header>
  );
}
