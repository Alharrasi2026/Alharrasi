import type { CSSProperties } from 'react';

const paths: Record<string, JSX.Element> = {
  rings: (
    <>
      <circle cx="28" cy="28" r="19" />
      <circle cx="28" cy="28" r="12.5" />
      <circle cx="28" cy="28" r="6" />
    </>
  ),
  wave: (
    <>
      <path d="M8,40 Q28,8 48,40" />
      <path d="M14,40 Q28,18 42,40" />
    </>
  ),
  loop: (
    <>
      <path d="M10,20 C20,8 36,8 46,20 C36,32 20,32 10,20Z" />
      <circle cx="28" cy="20" r="3.4" />
    </>
  ),
  cross: (
    <>
      <path d="M12,12 L44,44 M12,44 L44,12" />
      <circle cx="28" cy="28" r="18" />
    </>
  ),
  circle: <circle cx="28" cy="28" r="18" />,
  squares: (
    <>
      <rect x="12" y="12" width="32" height="32" />
      <rect x="19" y="19" width="18" height="18" />
    </>
  ),
};

export function ProductIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      {paths[iconKey] || paths.circle}
    </svg>
  );
}

export function ProductIconSmall({ iconKey, className, style }: { iconKey: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.6" className={className} style={style}>
      {paths[iconKey] || paths.circle}
    </svg>
  );
}
