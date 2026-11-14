import { useId } from 'react'

type Props = {
  nome: string
  ano: string
  numero: number
  tinta: string
  /** Sem carimbo ainda: mostra o contorno tracejado do espaço vazio. */
  vazio?: boolean
  className?: string
}

/**
 * Carimbo de estação, desenhado como os carimbos postais e ferroviários antigos:
 * anel duplo, nome da estação em arco, ano ao centro e tinta levemente gasta.
 */
export function Carimbo({ nome, ano, numero, tinta, vazio, className = '' }: Props) {
  const id = useId().replace(/:/g, '')
  if (vazio) {
    return (
      <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`Estação ${numero}: ${nome}, ainda sem carimbo`}>
        <circle cx="60" cy="60" r="54" fill="none" stroke="#5B3928" strokeOpacity=".35" strokeWidth="2" strokeDasharray="5 6" />
        <text x="60" y="56" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="26" fontWeight="600" fill="#5B3928" fillOpacity=".35">
          {String(numero).padStart(2, '0')}
        </text>
        <text x="60" y="76" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8.5" letterSpacing="1.4" fill="#5B3928" fillOpacity=".55">
          A CARIMBAR
        </text>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`Carimbo da estação ${numero}: ${nome}, ${ano}`}>
      <defs>
        <path id={`arco-${id}`} d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" />
        {/* textura de tinta gasta: ruído estático, nunca animado */}
        <filter id={`gasto-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={numero * 7} result="ruido" />
          <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.5" result="mascara" />
          <feComposite in="SourceGraphic" in2="mascara" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#gasto-${id})`} fill={tinta} stroke={tinta}>
        <circle cx="60" cy="60" r="55" fill="none" strokeWidth="3.2" />
        <circle cx="60" cy="60" r="49" fill="none" strokeWidth="1.2" />
        <circle cx="60" cy="60" r="29" fill="none" strokeWidth="1.6" />
        <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="9.6" letterSpacing="2.1" stroke="none">
          <textPath href={`#arco-${id}`} startOffset="0">
            {`${nome.toUpperCase()} · CAFÉ & MEMÓRIA · `}
          </textPath>
        </text>
        <text x="60" y="58" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize={ano.length > 4 ? 13 : 17} stroke="none">
          {ano}
        </text>
        <text x="60" y="73" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="7.5" letterSpacing="1.2" stroke="none">
          ESTAÇÃO {String(numero).padStart(2, '0')}
        </text>
        <path d="M42 45h36M42 79h36" strokeWidth="1" />
      </g>
    </svg>
  )
}
