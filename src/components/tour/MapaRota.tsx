import { useEffect, useMemo, useRef } from 'react'
import { paradas } from '../../data/historia'

const W = 300
const H = 360

/**
 * Esquema ilustrativo da ordem do percurso. Não é um mapa em escala:
 * as posições só indicam a sequência, sem coordenadas ou distâncias reais.
 * Um trenzinho percorre a ferrovia até a estação mais recente explorada (ou a que está aberta).
 */
export function MapaRota({ exploradas, ativa, onSelecionar }: { exploradas: Set<number>; ativa?: number; onSelecionar: (n: number) => void }) {
  const pts = useMemo(
    () => paradas.map((p) => ({ ...p, px: (p.esquema.x / 100) * (W - 60) + 30, py: (p.esquema.y / 100) * (H - 70) + 30 })),
    [],
  )
  const segmentos = useMemo(
    () =>
      pts.slice(1).map((p, i) => {
        const a = pts[i]
        const mx = (a.px + p.px) / 2 + ((i + 1) % 2 ? 26 : -26)
        return `M${a.px} ${a.py} Q${mx} ${(a.py + p.py) / 2} ${p.px} ${p.py}`
      }),
    [pts],
  )
  const caminho = useMemo(() => [`M${pts[0].px} ${pts[0].py}`, ...segmentos.map((s) => s.replace(/^M[^Q]+/, ''))].join(' '), [pts, segmentos])

  const maxExplorada = Math.max(1, ...exploradas)
  const destino = ativa ?? maxExplorada

  const pathRef = useRef<SVGPathElement>(null)
  const segRefs = useRef<(SVGPathElement | null)[]>([])
  const tremRef = useRef<SVGGElement>(null)
  const posRef = useRef(0) // comprimento atual no caminho

  useEffect(() => {
    const path = pathRef.current
    const trem = tremRef.current
    if (!path || !trem) return
    // comprimento acumulado até cada estação
    const acumulado = [0]
    segRefs.current.forEach((s, i) => acumulado.push(acumulado[i] + (s?.getTotalLength() ?? 0)))
    // o trem para na plataforma, logo antes da estação, sem cobrir o número
    const total = path.getTotalLength()
    const alvo = destino === 1 ? Math.min(44, total) : Math.max(0, (acumulado[destino - 1] ?? 0) - 44)
    const inicio = posRef.current
    const reduz = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const duracao = reduz ? 0 : Math.min(1800, 500 + Math.abs(alvo - inicio) * 4)
    const t0 = performance.now()
    let raf = 0

    const posicionar = (l: number) => {
      const p = path.getPointAtLength(l)
      const q = path.getPointAtLength(Math.min(l + 1, path.getTotalLength()))
      const r = path.getPointAtLength(Math.max(l - 1, 0))
      const ang = (Math.atan2(q.y - r.y, q.x - r.x) * 180) / Math.PI
      const sentido = alvo < inicio || destino === 1 ? 180 : 0
      trem.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${ang - 90 + sentido}) scale(1.25) translate(-11 -21)`)
    }
    const passo = (agora: number) => {
      const t = duracao ? Math.min(1, (agora - t0) / duracao) : 1
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      const l = inicio + (alvo - inicio) * e
      posRef.current = l
      posicionar(l)
      if (t < 1) raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [destino])

  return (
    <figure className="moldura moldura-dupla rounded-2xl p-4">
      <figcaption className="flex items-baseline justify-between gap-2 px-1">
        <span className="font-display text-lg font-bold text-espresso">O percurso</span>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cafe/80">Esquema · sem escala</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full max-w-full" aria-describedby="mapa-descricao">
        <defs>
          <pattern id="quadricula" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#5B3928" strokeOpacity=".07" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} rx="10" fill="#F3EBDD" />
        <rect width={W} height={H} rx="10" fill="url(#quadricula)" />
        <path d="M268 24l8 -14 8 14M276 12v22" stroke="#5B3928" strokeOpacity=".5" strokeWidth="1.4" fill="none" />
        <text x="276" y="46" textAnchor="middle" fontSize="10" fill="#5B3928" fillOpacity=".6" fontFamily="Inter, sans-serif" fontWeight="600">N</text>

        {/* Ferrovia: linha escura com dormentes claros (símbolo clássico de mapa) */}
        <path ref={pathRef} d={caminho} fill="none" stroke="#321D16" strokeWidth="6" strokeLinecap="round" />
        <path d={caminho} fill="none" stroke="#FAF7EF" strokeWidth="2.6" strokeDasharray="7 6" />
        {segmentos.map((d, i) => (
          <path key={i} ref={(el) => (segRefs.current[i] = el)} d={d} fill="none" stroke="none" />
        ))}


        {pts.map((p) => {
          const feita = exploradas.has(p.numero)
          const ehAtiva = ativa === p.numero
          const ladoDir = p.px < W / 2
          return (
            <g
              key={p.numero}
              className="cursor-pointer"
              onClick={() => onSelecionar(p.numero)}
              role="button"
              tabIndex={0}
              aria-label={`Parada ${p.numero}: ${p.nome}`}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelecionar(p.numero))}
            >
              <circle cx={p.px} cy={p.py} r={ehAtiva ? 19 : 16} fill={feita ? '#68704B' : '#321D16'} stroke="#FAF7EF" strokeWidth="3" />
              <text x={p.px} y={p.py + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#FAF7EF" fontFamily="Playfair Display, serif">
                {p.numero}
              </text>
              <text x={ladoDir ? p.px + 26 : p.px - 26} y={p.py + 4} textAnchor={ladoDir ? 'start' : 'end'} fontSize="12.5" fontWeight="600" fill="#321D16" fontFamily="Inter, sans-serif">
                {p.nome}
              </text>
            </g>
          )
        })}

        {/* Trenzinho (vista de cima, 22×42) */}
        <g ref={tremRef} transform={`translate(${pts[0].px - 11} ${pts[0].py - 21})`} pointerEvents="none">
          <rect x="3" y="0" width="16" height="11" rx="2" fill="#5B3928" stroke="#321D16" strokeWidth="1.2" />
          <rect x="2" y="13" width="18" height="9" rx="2" fill="#321D16" />
          <rect x="4" y="21" width="14" height="17" rx="6" fill="#24201D" stroke="#B99A62" strokeWidth="1.2" />
          <circle cx="11" cy="33" r="2.6" fill="#A66A3F" />
          <path d="M4 38h14l-3 4H7z" fill="#A66A3F" stroke="#321D16" strokeWidth="1" />
        </g>
      </svg>
      <p id="mapa-descricao" className="sr-only">Esquema da ordem do percurso, ilustrativo e sem escala: 1 Estação da Luz, 2 Rua XV de Novembro e Rua Anchieta, 3 Largo do Café, 4 Theatro Municipal.</p>
      <p className="mt-2 px-1 text-xs text-cafe/80">Toque em uma estação para abrir os detalhes.</p>
    </figure>
  )
}
