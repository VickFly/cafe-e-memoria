import type { CSSProperties } from 'react'

/** Ilustrações lineares da identidade Café & Memória (traço único, sem preenchimentos pesados). */
type P = { className?: string; title?: string; style?: CSSProperties }

const svgProps = (title?: string) =>
  title ? { role: 'img' as const, 'aria-label': title } : { 'aria-hidden': true as const }

export function Grao({ className, title, style, cheio = true }: P & { cheio?: boolean }) {
  return (
    <svg viewBox="0 0 32 40" className={className} style={style} {...svgProps(title)}>
      <ellipse
        cx="16" cy="20" rx="12.5" ry="16.5"
        transform="rotate(18 16 20)"
        fill={cheio ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M11.5 6.5c5 5.5 -2.5 12 3 17.5s2.5 9.5 2.5 11"
        transform="rotate(18 16 20)"
        fill="none"
        stroke={cheio ? 'var(--creme)' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Ramo({ className, title }: P) {
  return (
    <svg viewBox="0 0 160 60" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...svgProps(title)}>
      <path d="M4 40 C40 34 80 30 156 22" />
      {[22, 48, 76, 104, 130].map((x, i) => {
        const y = 38 - i * 3.6
        const up = i % 2 === 0
        return (
          <g key={x}>
            <path d={`M${x} ${y} q 10 ${up ? -22 : 20} 26 ${up ? -18 : 14} q -16 ${up ? 4 : -4} -26 ${up ? 18 : -14}z`} />
            <path d={`M${x} ${y} q 12 ${up ? -12 : 10} 24 ${up ? -16 : 12}`} strokeWidth="0.8" />
          </g>
        )
      })}
      <circle cx="62" cy="40" r="3.4" fill="#A66A3F" stroke="none" />
      <circle cx="68" cy="42.5" r="3.4" fill="#5B3928" stroke="none" />
      <circle cx="118" cy="31" r="3.4" fill="#A66A3F" stroke="none" />
    </svg>
  )
}

export function Selo({ className, texto = 'SÃO PAULO · 1867–1922 · CAFÉ & MEMÓRIA · ' }: P & { texto?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <path id="selo-circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <text fontSize="9.2" letterSpacing="2.2" fill="currentColor" fontFamily="Inter, sans-serif" fontWeight="600">
        <textPath href="#selo-circ">{texto}</textPath>
      </text>
      <g transform="translate(48 44) scale(0.75)" color="currentColor">
        <ellipse cx="16" cy="20" rx="12.5" ry="16.5" transform="rotate(18 16 20)" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M11.5 6.5c5 5.5 -2.5 12 3 17.5s2.5 9.5 2.5 11" transform="rotate(18 16 20)" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function Trem({ className, title }: P) {
  return (
    <svg viewBox="0 0 200 110" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" {...svgProps(title)}>
      <path d="M6 96h188" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${12 + i * 16} 96v6`} strokeWidth="1.4" />)}
      <path d="M30 80V46h44v34" />
      <path d="M26 46h52" />
      <path d="M74 80V58h70l10 22" />
      <path d="M96 58V36h-10v22" />
      <path d="M86 36c-4-10 4-14 0-22" strokeWidth="1.4" opacity=".6" />
      <path d="M100 30c-3-8 3-11 0-17" strokeWidth="1.4" opacity=".45" />
      <rect x="38" y="54" width="12" height="12" rx="1" />
      <rect x="54" y="54" width="12" height="12" rx="1" />
      <path d="M150 80h30v-18h-26" />
      <circle cx="48" cy="86" r="9" /><circle cx="96" cy="86" r="9" /><circle cx="124" cy="86" r="9" /><circle cx="166" cy="86" r="7" />
      <path d="M180 80l10 8" />
    </svg>
  )
}

export function Rua({ className, title }: P) {
  return (
    <svg viewBox="0 0 200 110" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" {...svgProps(title)}>
      <path d="M6 100h188" />
      <path d="M14 100V40l18-12 18 12v60" />
      <path d="M50 100V30h40v70" /><path d="M46 30h48" /><path d="M54 22h32v8" />
      <path d="M90 100V44h36v56" />
      <path d="M126 100V36l20-14 20 14v64" />
      {[60, 76].map((x) => [42, 60, 78].map((y) => <rect key={`${x}${y}`} x={x} y={y} width="8" height="11" rx="4" />))}
      {[98, 112].map((x) => [54, 72].map((y) => <rect key={`${x}${y}`} x={x} y={y} width="8" height="10" rx="1" />))}
      <path d="M140 100V70a6 6 0 0 1 12 0v30" />
      <path d="M30 44v10M22 50h16" strokeWidth="1.4" />
      <path d="M170 18l20 6M180 21v56" strokeWidth="1.4" />
      <path d="M150 88h40M150 88l6-10h28l6 10" strokeWidth="1.6" />
    </svg>
  )
}

export function Saca({ className, title }: P) {
  return (
    <svg viewBox="0 0 200 110" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" {...svgProps(title)}>
      <path d="M6 100h188" />
      <path d="M40 100c-10-20-8-46 4-62 6-8 4-14 0-18h40c-4 4-6 10 0 18 12 16 14 42 4 62z" />
      <path d="M44 22c8 4 32 4 40 0" />
      <path d="M50 60h28M48 72h32" strokeWidth="1.4" />
      <text x="64" y="68" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" fontFamily="Playfair Display, serif" fontWeight="700">SANTOS</text>
      <path d="M104 100c-8-16-6-36 3-48 4-6 3-10 0-13h30c-3 3-4 7 0 13 9 12 11 32 3 48z" />
      <path d="M108 39c6 3 24 3 30 0" />
      <path d="M150 100V54h36v46" /><path d="M146 54h44" />
      <path d="M156 66h24M156 76h24M156 86h16" strokeWidth="1.4" />
      <path d="M166 54V42h4v12" />
    </svg>
  )
}

export function Theatro({ className, title }: P) {
  return (
    <svg viewBox="0 0 200 110" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" {...svgProps(title)}>
      <path d="M6 100h188" />
      <path d="M24 100V56h152v44" />
      <path d="M18 56h164" /><path d="M24 48h152v8" />
      <path d="M72 48c0-18 12-28 28-28s28 10 28 28" />
      <path d="M100 20v-8M96 12h8" />
      <path d="M30 48c0-8 6-12 12-12s12 4 12 12M146 48c0-8 6-12 12-12s12 4 12 12" />
      {[38, 58, 78, 98, 118, 138, 158].map((x) => <path key={x} d={`M${x} 62v32`} />)}
      {[48, 68, 128, 148].map((x) => <path key={x} d={`M${x - 4} 94v-14a4 4 0 0 1 8 0v14`} strokeWidth="1.4" />)}
      <path d="M90 100V78a10 10 0 0 1 20 0v22" />
    </svg>
  )
}

export function Xicara({ className, title, cheia = 1, animar = false }: P & { cheia?: number; animar?: boolean }) {
  return (
    <svg viewBox="0 0 120 110" className={className} {...svgProps(title)}>
      <defs>
        <clipPath id="xic-clip">
          <path d="M22 34h64v28c0 18-14 30-32 30S22 80 22 62z" />
        </clipPath>
      </defs>
      <g clipPath="url(#xic-clip)">
        <rect x="18" y="30" width="72" height="66" fill="#F3EBDD" />
        <g className={animar ? 'animate-fill' : ''} style={{ transformBox: 'fill-box' }}>
          <rect x="18" y={34 + (1 - cheia) * 58} width="72" height="66" fill="#5B3928" />
          <path d={`M18 ${36 + (1 - cheia) * 58} q 9 -5 18 0 t 18 0 t 18 0 t 18 0 v 6 h -72z`} fill="#A66A3F" opacity=".7" />
        </g>
      </g>
      <path d="M22 34h64v28c0 18-14 30-32 30S22 80 22 62z" fill="none" stroke="#321D16" strokeWidth="2.4" />
      <path d="M86 44c14 0 16 22 0 22" fill="none" stroke="#321D16" strokeWidth="2.4" />
      <path d="M10 96h88c-4 6-12 8-44 8s-40-2-44-8z" fill="none" stroke="#321D16" strokeWidth="2.4" strokeLinejoin="round" />
      {animar && (
        <g fill="none" stroke="#5B3928" strokeWidth="2" strokeLinecap="round" opacity=".6">
          <path className="animate-steam" d="M42 26c-4-6 4-8 0-14" />
          <path className="animate-steam" style={{ animationDelay: '.7s' }} d="M56 24c-4-6 4-8 0-14" />
          <path className="animate-steam" style={{ animationDelay: '1.3s' }} d="M70 26c-4-6 4-8 0-14" />
        </g>
      )}
    </svg>
  )
}

export function CopoGelado({ className, title }: P) {
  return (
    <svg viewBox="0 0 160 200" className={className} {...svgProps(title)}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9D6BC" />
          <stop offset=".35" stopColor="#C49A72" />
          <stop offset="1" stopColor="#7A4E35" />
        </linearGradient>
        <clipPath id="copo"><path d="M34 40h92l-10 140a10 10 0 0 1-10 9H54a10 10 0 0 1-10-9z" /></clipPath>
      </defs>
      <g clipPath="url(#copo)">
        <rect x="30" y="58" width="100" height="140" fill="url(#cg)" />
        <path d="M30 58q10-8 20 0t20 0t20 0t20 0t20 0v10H30z" fill="#FAF7EF" />
        {[[58, 110, 14], [92, 128, -10], [70, 150, 6], [100, 96, 20]].map(([x, y, r], i) => (
          <rect key={i} x={x} y={y} width="22" height="20" rx="4" fill="#FAF7EF" opacity=".55" transform={`rotate(${r} ${x + 11} ${y + 10})`} />
        ))}
        <circle cx="66" cy="62" r="1.6" fill="#A66A3F" /><circle cx="80" cy="60" r="1.2" fill="#A66A3F" /><circle cx="94" cy="63" r="1.5" fill="#A66A3F" />
      </g>
      <path d="M34 40h92l-10 140a10 10 0 0 1-10 9H54a10 10 0 0 1-10-9z" fill="none" stroke="#321D16" strokeWidth="2.6" />
      <path d="M104 14l-14 112" stroke="#68704B" strokeWidth="6" strokeLinecap="round" />
      <path d="M48 52l4 110" stroke="#FAF7EF" strokeWidth="3" strokeLinecap="round" opacity=".6" />
    </svg>
  )
}

export const ilustracaoPorTipo = { trem: Trem, rua: Rua, saca: Saca, theatro: Theatro }
