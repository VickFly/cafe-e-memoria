/**
 * Locomotivas a vapor da identidade Café & Memória.
 *  - <LocomotivaLado>: vista lateral com tênder e vagão de sacas de café (tela inicial).
 *  - <LocomotivaTopo>: vista de cima, apontando para baixo (corre sobre o trilho da trilha e do mapa).
 */

const roda = (cx: number, cy: number, r: number, girar: boolean, key?: string) => (
  <g key={key} className={girar ? 'animate-giro' : ''} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
    <circle cx={cx} cy={cy} r={r} fill="#FAF7EF" stroke="#321D16" strokeWidth="2.4" />
    <circle cx={cx} cy={cy} r={r * 0.28} fill="#321D16" />
    {[0, 45, 90, 135].map((a) => (
      <line key={a} x1={cx} y1={cy - r + 2} x2={cx} y2={cy + r - 2} stroke="#321D16" strokeWidth="1.3" transform={`rotate(${a} ${cx} ${cy})`} />
    ))}
  </g>
)

export function LocomotivaLado({ className, rodando = false, fumaca = true }: { className?: string; rodando?: boolean; fumaca?: boolean }) {
  return (
    <svg viewBox="0 0 420 150" className={className} role="img" aria-label="Locomotiva a vapor puxando um vagão de sacas de café">
      {/* Fumaça */}
      {fumaca && (
        <g fill="#F3EBDD" stroke="#5B3928" strokeOpacity=".35" strokeWidth="1.5">
          {[0, 0.8, 1.6].map((d, i) => (
            <circle key={i} cx={346} cy={30} r={11 - i} className="animate-fumaca" style={{ animationDelay: `${d}s`, transformBox: 'fill-box', transformOrigin: 'center' }} />
          ))}
        </g>
      )}

      {/* Vagão de café */}
      <g>
        <rect x="8" y="70" width="128" height="46" rx="4" fill="#A66A3F" stroke="#321D16" strokeWidth="2.4" />
        <path d="M8 82h128M8 104h128" stroke="#321D16" strokeOpacity=".35" strokeWidth="1.4" />
        {[22, 50, 78, 106].map((x) => (
          <g key={x}>
            <path d={`M${x} 70c-3-10 0-18 6-22h12c6 4 9 12 6 22z`} fill="#E9D9BF" stroke="#321D16" strokeWidth="1.8" />
            <path d={`M${x + 4} 56h16`} stroke="#5B3928" strokeWidth="1.2" />
          </g>
        ))}
        <text x="72" y="98" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="800" fontSize="15" letterSpacing="3" fill="#FAF7EF">CAFÉ</text>
        <rect x="136" y="104" width="16" height="5" fill="#321D16" />
        {roda(36, 124, 11, rodando)}
        {roda(108, 124, 11, rodando)}
      </g>

      {/* Tênder */}
      <g>
        <path d="M152 76h62v40h-62z" fill="#5B3928" stroke="#321D16" strokeWidth="2.4" />
        <path d="M156 76l6-10h42l6 10" fill="#321D16" />
        <path d="M152 90h62" stroke="#B99A62" strokeWidth="2" />
        {roda(170, 124, 10, rodando)}
        {roda(198, 124, 10, rodando)}
      </g>

      {/* Locomotiva */}
      <g>
        <rect x="214" y="104" width="10" height="5" fill="#321D16" />
        {/* cabine */}
        <path d="M224 50h48v66h-48z" fill="#321D16" />
        <path d="M218 50h60l-4-10h-52z" fill="#5B3928" stroke="#321D16" strokeWidth="2" strokeLinejoin="round" />
        <rect x="234" y="60" width="26" height="22" rx="3" fill="#F3EBDD" stroke="#B99A62" strokeWidth="2" />
        {/* caldeira */}
        <rect x="272" y="70" width="98" height="40" rx="18" fill="#24201D" />
        <path d="M282 70v40M318 70v40M352 70v40" stroke="#B99A62" strokeWidth="2.2" />
        <rect x="364" y="66" width="10" height="48" rx="3" fill="#5B3928" stroke="#321D16" strokeWidth="2" />
        {/* domo e chaminé */}
        <path d="M300 70c0-12 22-12 22 0" fill="#B99A62" stroke="#321D16" strokeWidth="2" />
        <path d="M338 70l-4-22h24l-4 22z" fill="#321D16" />
        <rect x="331" y="42" width="30" height="8" rx="2" fill="#5B3928" stroke="#321D16" strokeWidth="2" />
        {/* farol */}
        <rect x="370" y="52" width="16" height="14" rx="2" fill="#B99A62" stroke="#321D16" strokeWidth="2" />
        <circle cx="386" cy="59" r="3.5" fill="#FAF7EF" />
        {/* limpa-trilhos */}
        <path d="M374 108l30 14h-30z" fill="#A66A3F" stroke="#321D16" strokeWidth="2" strokeLinejoin="round" />
        {/* rodas e biela */}
        {roda(244, 120, 14, rodando)}
        {roda(290, 120, 14, rodando)}
        {roda(336, 120, 14, rodando)}
        {roda(364, 126, 8, rodando)}
        <path d="M244 120h92" stroke="#A66A3F" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/** Vista de cima, frente para baixo. Tamanho base 44×84. */
export function LocomotivaTopo({ className, fumaca = true }: { className?: string; fumaca?: boolean }) {
  return (
    <svg viewBox="0 0 44 84" className={className} aria-hidden="true" overflow="visible">
      {/* sombra desenhada no próprio SVG (filtros CSS custam caro em elementos que se movem) */}
      <rect x="6" y="4" width="34" height="80" rx="12" fill="#24201D" opacity=".18" transform="translate(2 4)" />
      {/* tênder (atrás, em cima) */}
      <rect x="7" y="0" width="30" height="22" rx="4" fill="#5B3928" stroke="#321D16" strokeWidth="2" />
      <rect x="11" y="4" width="22" height="13" rx="2" fill="#24201D" />
      <path d="M22 22v5" stroke="#321D16" strokeWidth="3" />
      {/* cabine */}
      <rect x="5" y="27" width="34" height="18" rx="3" fill="#321D16" />
      <rect x="9" y="30" width="26" height="11" rx="2" fill="#A66A3F" />
      {/* caldeira */}
      <rect x="9" y="44" width="26" height="32" rx="12" fill="#24201D" stroke="#321D16" strokeWidth="2" />
      <path d="M9 52h26M9 64h26" stroke="#B99A62" strokeWidth="1.8" />
      <circle cx="22" cy="58" r="4" fill="#B99A62" stroke="#321D16" strokeWidth="1.5" />
      {/* chaminé */}
      <circle cx="22" cy="69" r="5" fill="#5B3928" stroke="#321D16" strokeWidth="1.8" />
      <circle cx="22" cy="69" r="2.2" fill="#24201D" />
      {/* frente e farol */}
      <path d="M8 76h28l-5 7H13z" fill="#A66A3F" stroke="#321D16" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="22" cy="78.5" r="2" fill="#FAF7EF" />
      {fumaca && (
        <g fill="#FAF7EF" stroke="#5B3928" strokeOpacity=".3">
          {[0, 0.6, 1.2].map((d, i) => (
            <circle key={i} cx={22 + (i - 1) * 3} cy={68 - i * 6} r="6" className="animate-fumacaTopo" style={{ animationDelay: `${d}s`, transformBox: 'fill-box', transformOrigin: 'center' }} />
          ))}
        </g>
      )}
    </svg>
  )
}

/** Faixa com trilhos e a locomotiva chegando à estação (tela inicial). */
export function TremChegando() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative mx-auto h-[150px] max-w-6xl sm:h-[170px]">
        <div className="absolute bottom-[15px] right-0 hidden flex-col items-center sm:flex">
          <div className="rounded border-2 border-espresso bg-creme px-3 py-1 text-center">
            <p className="font-display text-sm font-bold leading-tight text-espresso">ESTAÇÃO DA LUZ</p>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-caramelo-texto">Ponto de encontro · 13h</p>
          </div>
          <div className="h-10 w-1 bg-espresso" />
        </div>
        <div className="absolute bottom-[3px] left-0 w-[340px] max-w-[92vw] animate-chegada sm:bottom-[1px] sm:left-[8%] sm:w-[420px] sm:max-w-none">
          <LocomotivaLado className="w-full" rodando />
        </div>
      </div>
      {/* trilhos */}
      <div className="absolute inset-x-0 bottom-0 h-[18px]" aria-hidden="true">
        <div className="absolute inset-x-0 top-[3px] h-[3px] bg-espresso" />
        <div className="absolute inset-x-0 top-[3px] h-[13px] bg-[repeating-linear-gradient(90deg,#5B3928_0_8px,transparent_8px_22px)] opacity-60" />
        <div className="absolute inset-x-0 top-[12px] h-[2px] bg-espresso/40" />
      </div>
    </div>
  )
}
