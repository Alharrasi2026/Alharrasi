const offsets = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100];

export function RopeDivider() {
  return (
    <svg className="rope-divider" viewBox="0 0 1200 18" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <path id="lw" d="M0,9 C25,1 75,17 100,9" />
      </defs>
      <g stroke="var(--brass)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        {offsets.map((x) => (
          <use key={x} href="#lw" x={x} />
        ))}
      </g>
    </svg>
  );
}
